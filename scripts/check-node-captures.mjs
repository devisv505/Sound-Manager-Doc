import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const hash = (data) => createHash('sha256').update(data).digest('hex');
const manifest = await json('content-data/node-captures.json');
const catalogue = await json('content-data/node-catalogue.json');
assert.equal(manifest.sourceRevision, catalogue.sourceRevision);
assert.equal(manifest.captures.length, 49);
assert.equal(
  new Set(manifest.captures.map((c) => c.sha256)).size,
  49,
  'Every node needs its own image',
);
assert.deepEqual(
  manifest.captures.map((c) => c.operation).sort(),
  catalogue.nodes.map((c) => c.operation).sort(),
);
assert.equal(hash(await readFile(manifest.captureHelper)), manifest.helperSha256);
const captured = [];
for (let i = 1; i <= 5; i++) {
  const result = await json(`validation/node-captures/batch-${i}.json`);
  assert(result.success && result.data.result.success, 'Unity capture batch failed');
  captured.push(...result.data.result.result);
}
for (const c of manifest.captures) {
  const original = await readFile(c.original),
    published = await readFile(c.publishedSource);
  assert.equal(hash(original), c.sha256, `${c.operation} original changed`);
  assert(original.equals(published), `${c.operation} published source differs`);
  assert(original.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
  assert.equal(original.readUInt32BE(16), c.width);
  assert.equal(original.readUInt32BE(20), c.height);
  assert(c.alt.includes(c.title) && c.caption && c.unityVersion === '6000.6.0f1');
  assert(Number.isFinite(Date.parse(c.capturedAt)));
  const sidecar = await json(c.captureRecord),
    proof = captured.find((item) => item.operation === c.operation);
  assert(proof, `${c.operation} capture proof missing`);
  assert.deepEqual(
    { ...sidecar, capturedAt: new Date(sidecar.capturedAt).toISOString() },
    { ...proof, capturedAt: new Date(proof.capturedAt).toISOString() },
    `${c.operation} capture proof differs`,
  );
  for (const key of ['capturedAt', 'width', 'height', 'unityVersion'])
    assert.equal(sidecar[key], c[key]);
  assert(
    sidecar.labels.includes(c.title),
    `${c.operation}: title absent from captured editor node`,
  );
}
const unwrap = (envelope) => {
  assert(envelope.success && envelope.data.result.success);
  return envelope.data.result.result;
};
const before = unwrap(await json('validation/node-captures/unity-before.json'));
const after = unwrap(await json('validation/node-captures/unity-after.json'));
for (const key of ['scene', 'dirty', 'playing', 'paused', 'background', 'selection'])
  assert.deepEqual(after[key], before[key], `Unity ${key} changed`);
const sortWindows = (windows) =>
  [...windows].sort((a, b) => (a.type + a.title).localeCompare(b.type + b.title));
assert.deepEqual(
  sortWindows(after.windows),
  sortWindows(before.windows),
  'Original editor windows must be preserved',
);
const cleanup = unwrap(await json('validation/node-captures/cleanup.json'));
assert(
  cleanup.deleted && cleanup.path.startsWith('Assets/__SoundDocsNodeCapture'),
  'Temporary capture graph not cleaned up',
);
console.log(
  'Node images OK: 49 distinct Unity captures, matching provenance/dimensions, restored editor windows and scene.',
);

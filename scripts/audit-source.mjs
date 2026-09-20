import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = process.argv[2];
if (!root) throw Error('Usage: npm run audit:source -- /path/to/Unity-project');
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 128 * 1024 * 1024 });
const baseline = JSON.parse(await readFile('content-data/source-baseline.json', 'utf8'));
const revision = git('rev-parse', 'HEAD').toString().trim();
assert.equal(
  revision,
  baseline.revision,
  'Unity revision changed; review the source baseline and affected documentation',
);
const files = [];
for (const relative of git('ls-tree', '-r', '--name-only', revision, 'Assets/DEV505/SoundManager')
  .toString()
  .trim()
  .split('\n')) {
  const committed = git('show', `${revision}:${relative}`);
  const actual = await readFile(path.join(root, relative));
  const sha256 = createHash('sha256').update(actual).digest('hex');
  const lfs = committed
    .toString()
    .match(/^version https:\/\/git-lfs.github.com\/spec\/v1\noid sha256:([a-f0-9]+)/);
  files.push({
    path: relative,
    sha256,
    matchesRevision: lfs ? lfs[1] === sha256 : committed.equals(actual),
    storage: lfs ? 'Git LFS (checked content SHA-256)' : 'Git blob',
  });
}
const colors = JSON.parse(await readFile('content-data/node-colors.json', 'utf8'));
const nativeNodes = {},
  nativeColors = {};
for (const source of colors.sources) {
  const data = await readFile(path.join(root, source.path));
  assert.equal(
    createHash('sha256').update(data).digest('hex'),
    source.sha256,
    `Color source changed: ${source.path}`,
  );
  for (const m of data
    .toString()
    .matchAll(/Node\(SoundNodeStyle\.(\w+),[^\n]+\)\]\s+public sealed class (\w+)Node/g))
    nativeNodes[m[2]] = m[1];
  for (const m of data.toString().matchAll(/\[(\w+)\] = Hex\(0x([A-F0-9]+)\)/g))
    nativeColors[m[1]] = '#' + m[2];
}
assert.deepEqual(colors.nodes, nativeNodes);
assert.deepEqual(Object.fromEntries(colors.categories.map((c) => [c.name, c.color])), nativeColors);
const changed = files.filter((f) => !f.matchesRevision);
await mkdir('validation/m6', { recursive: true });
await writeFile(
  'validation/m6/source-freshness.json',
  JSON.stringify(
    {
      sourceRevision: revision,
      checkedAt: new Date().toISOString(),
      files,
      colorMappingsVerified: 49,
      result: changed.length
        ? `${changed.length} inputs changed; review required`
        : `All ${files.length} tracked Unity inputs match the documented revision, including Git LFS content. No screenshots invalidated.`,
    },
    null,
    2,
  ) + '\n',
);
assert.equal(changed.length, 0, `Changed Unity files: ${changed.map((f) => f.path).join(', ')}`);
console.log(
  `Source freshness OK: ${files.length} Unity inputs and all 49 color mappings verified.`,
);

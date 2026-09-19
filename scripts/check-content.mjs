import { readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const load = async (file) => JSON.parse(await readFile(file, 'utf8'));
const demos = await load('content-data/demos.json');
if (demos.length !== 10 || new Set(demos.map((d) => d.slug)).size !== 10)
  throw Error('Expected ten distinct demos');
for (const d of demos.filter((d) => d.status === 'available'))
  await access(`src/content/docs/demos/${d.slug}.mdx`);
const captures = await load('content-data/captures.json');
const baseline = await load('content-data/source-baseline.json');
const captureIds = new Set();
for (const c of captures.captures) {
  if (!c.alt || !c.caption || !c.steps.length) throw Error(`Incomplete capture: ${c.id}`);
  if (captureIds.has(c.id)) throw Error(`Duplicate capture ID: ${c.id}`);
  captureIds.add(c.id);
  if (
    !demos.some((d) => d.slug === c.demo) ||
    c.sourceRevision !== baseline.revision ||
    !Number.isFinite(Date.parse(c.capturedAt)) ||
    !c.unityVersion ||
    !c.scene ||
    !c.state
  )
    throw Error(`Invalid capture provenance: ${c.id}`);
  const source = await readFile(c.original);
  if (createHash('sha256').update(source).digest('hex') !== c.sha256)
    throw Error(`Capture changed: ${c.id}`);
  if (
    !source.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
    source.readUInt32BE(16) !== c.width ||
    source.readUInt32BE(20) !== c.height
  )
    throw Error(`Capture dimensions do not match PNG: ${c.id}`);
  if (c.kind === 'game-view' && (c.width !== 1920 || c.height !== 1080))
    throw Error(`Game View must be 1920 × 1080: ${c.id}`);
  const published = await readFile(c.publishedSource);
  if (!source.equals(published)) throw Error(`Published input differs from original: ${c.id}`);
  if (c.captureRecord) {
    const proof = await load(c.captureRecord);
    if (
      proof.width !== c.width ||
      proof.height !== c.height ||
      proof.capturedAt !== c.capturedAt ||
      proof.demo !== c.demo ||
      proof.kind !== c.kind ||
      proof.hudIncluded !== c.hudIncluded
    )
      throw Error(`Capture sidecar differs from manifest: ${c.id}`);
    if (!/^[a-f0-9]{64}$/.test(c.sourceSha256) || !c.sourceFile || !c.controllerSha256)
      throw Error(`Missing source hashes: ${c.id}`);
  }
}
const requiredStates = {
  '01-campfire': ['unlit', 'lit', 'graph'],
  '02-footstep': [
    'grass',
    'stone',
    'wood',
    'graph',
    'grass-group',
    'stone-group',
    'wood-group',
    'surface-selection',
    'trim-range',
  ],
  '03-bee': ['rest', 'flight-right', 'flight-left', 'graph', 'spatial-settings'],
  '04-engine': ['idle', 'driving', 'graph', 'rpm-mapping', 'load-mapping', 'horn-shift-graph'],
  '05-weather': [
    'clear',
    'rain',
    'lightning',
    'graph-weather',
    'graph-thunder',
    'rain-layers',
    'thunder-delay',
  ],
  '06-workshop': [
    'hammer',
    'handsaw',
    'drill',
    'hammer-over-saw',
    'graph',
    'work-sequence',
    'hammer-signal',
  ],
  '07-arcade': [
    'calm',
    'chaos',
    'graph-arcadezap',
    'graph-arcadecoin',
    'graph-arcadejackpot',
    'zap-limits',
    'coin-limits',
    'jackpot-cooldown',
    'jackpot-limit',
  ],
  '08-jukebox': [
    'playing',
    'crossfade',
    'paused',
    'graph',
    'track-parameter',
    'allowed-tracks',
    'gain-volume',
  ],
  '09-portals': [
    'meadow',
    'crossing',
    'detach',
    'cove',
    'stop',
    'graph-portalworld',
    'graph-portalhum',
    'graph-portalecho',
    'graph-portalcut',
    'graph-portalarrival',
    'detach-settings',
    'stop-settings',
  ],
  '10-launch': [
    'ready',
    'warning',
    'aborted',
    'countdown',
    'flight',
    'paused',
    'graph-launchpad',
    'graph-launchsequence',
    'graph-launchflight',
    'graph-launchclamp',
    'graph-launchvent',
    'graph-launchui',
    'pressure-condition',
    'release-flow',
    'launch-conditions',
    'countdown-flow',
    'ignition-finish',
  ],
};
for (const demo of demos) {
  await access(`src/content/docs/captures/${demo.slug}.mdx`);
  const images = captures.captures.filter((c) => c.demo === demo.slug);
  if (
    images.filter((c) => c.kind === 'game-view' && c.hudIncluded).length < 2 ||
    !images.some((c) => c.kind === 'graph-editor')
  )
    throw Error(`Missing required scene/graph coverage: ${demo.slug}`);
  for (const state of requiredStates[demo.slug])
    if (!images.some((c) => c.original.endsWith(`/${state}.png`)))
      throw Error(`Missing required capture: ${demo.slug}/${state}`);
}
const before = await load(captures.sessions.M3.before);
const after = await load(captures.sessions.M3.after);
for (const key of [
  'scene',
  'dirty',
  'playing',
  'paused',
  'background',
  'sizeIndex',
  'customSizeCount',
  'gameMaximized',
  'selection',
])
  if (before[key] !== after[key]) throw Error(`Unity session was not restored: ${key}`);
if (!after.originalTabSetRestored || !after.temporaryResolutionRemoved)
  throw Error('Temporary Unity capture setup was not removed');
const walk = async (dir) =>
  (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
const pages = (await walk('src/content/docs')).filter((f) => /\.mdx?$/.test(f));
for (const file of pages) {
  const text = await readFile(file, 'utf8');
  if (/\]\((?:file:\/\/|\/Users\/)/.test(text)) throw Error(`Local link: ${file}`);
  if (text.includes('TODO') || text.includes('Lorem ipsum'))
    throw Error(`Placeholder content: ${file}`);
}
const example = await readFile('examples/CampfireSound.cs');
const proof = await load('validation/campfire-example.json');
if (!proof.success || proof.exampleSha256 !== createHash('sha256').update(example).digest('hex'))
  throw Error('Example needs Unity verification');

const exampleProof = await load('validation/examples.json');
if (!exampleProof.compilation.success || exampleProof.compilation.diagnostics.length)
  throw Error('Complete examples need clean Unity compilation');
const actualExamples = (await walk('examples')).filter((file) => file.endsWith('.cs'));
if (actualExamples.length !== exampleProof.examples.length)
  throw Error('Every complete example needs a verification record');
for (const entry of exampleProof.examples) {
  const code = await readFile(entry.file);
  if (!entry.compiled || createHash('sha256').update(code).digest('hex') !== entry.sha256)
    throw Error(`Example changed since Unity verification: ${entry.file}`);
  if (!(await load(entry.runtimeReport)).success)
    throw Error(`Example has no passing runtime evidence: ${entry.file}`);
}

const inventory = await load('content-data/public-api-inventory.json');
const coverage = await load('content-data/api-coverage.json');
if (
  coverage.sourceRevision !== inventory.sourceRevision ||
  coverage.sourceRevision !== exampleProof.sourceRevision
)
  throw Error('API and example source revisions disagree');
const declared = inventory.declarations.flatMap((type) =>
  type.members.map(
    (member) =>
      `${type.source.includes('/Editor/') ? 'editor' : type.source.includes('.Generated/') ? 'generated' : 'runtime'}:${type.name}:${member.signature}`,
  ),
);
const accounted = coverage.types.flatMap((type) =>
  type.members.map((member) => `${type.area}:${type.name}:${member.signature}`),
);
if (JSON.stringify(declared.sort()) !== JSON.stringify(accounted.sort()))
  throw Error('Public API declarations are missing from the coverage record');
for (const type of coverage.types) {
  if (
    !type.reason ||
    !['consumer', 'generated', 'advanced', 'infrastructure'].includes(type.category)
  )
    throw Error(`API type needs an explicit scope: ${type.name}`);
  for (const member of type.members) {
    if (
      type.category === 'consumer' &&
      member.status !== 'documented' &&
      member.status !== 'excluded'
    )
      throw Error(`Unfinished consumer member: ${type.name}.${member.name}`);
    if (member.status === 'documented' && !member.page)
      throw Error(`Documented member has no reference: ${type.name}.${member.name}`);
    if (member.status !== 'documented' && !member.reason)
      throw Error(`Unexplained API exclusion: ${type.name}.${member.name}`);
  }
}
console.log(
  `Content OK: ${pages.length} pages, ${demos.length} demos, ${captures.captures.length} captures, ${actualExamples.length} verified C# examples, ${accounted.length} API declarations accounted for.`,
);

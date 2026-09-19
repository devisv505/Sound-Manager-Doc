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
for (const c of captures.captures) {
  if (!c.alt || !c.caption || !c.steps.length) throw Error(`Incomplete capture: ${c.id}`);
  const source = await readFile(c.original);
  if (createHash('sha256').update(source).digest('hex') !== c.sha256)
    throw Error(`Capture changed: ${c.id}`);
  await access(c.publishedSource);
}
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
if (coverage.sourceRevision !== inventory.sourceRevision || coverage.sourceRevision !== exampleProof.sourceRevision)
  throw Error('API and example source revisions disagree');
const declared = inventory.declarations.flatMap((type) => type.members.map((member) =>
  `${type.source.includes('/Editor/') ? 'editor' : type.source.includes('.Generated/') ? 'generated' : 'runtime'}:${type.name}:${member.signature}`));
const accounted = coverage.types.flatMap((type) => type.members.map((member) =>
  `${type.area}:${type.name}:${member.signature}`));
if (JSON.stringify(declared.sort()) !== JSON.stringify(accounted.sort()))
  throw Error('Public API declarations are missing from the coverage record');
for (const type of coverage.types) {
  if (!type.reason || !['consumer', 'generated', 'advanced', 'infrastructure'].includes(type.category))
    throw Error(`API type needs an explicit scope: ${type.name}`);
  for (const member of type.members) {
    if (type.category === 'consumer' && member.status !== 'documented' && member.status !== 'excluded')
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

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
console.log(
  `Content OK: ${pages.length} pages, ${demos.length} demos, ${captures.captures.length} captures, verified C# example.`,
);

import { readFile, access } from 'node:fs/promises';
import { normalizeDemoAudit } from './lib/demo-audit.mjs';
const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
const audit = await read('validation/m4/source-audit.json');
const published = await read('content-data/demo-audit.json');
if (JSON.stringify(published) !== JSON.stringify(normalizeDemoAudit(audit)))
  throw Error(
    'Demo settings drifted from the native Unity audit. Run npm run audit:demos after recording a new audit.',
  );
const captures = (await read('content-data/captures.json')).captures;
const demos = await read('content-data/demos.json');
const recipes = await read('content-data/recipes.json');
const examples = await read('validation/examples.json');
const runtime = await read('validation/m4/runtime-cli.json');
if (
  !runtime.success ||
  !runtime.data.result.success ||
  runtime.data.result.diagnostics.length ||
  !runtime.data.result.result.success
)
  throw Error('M4 runtime checks or compilation failed.');
if (
  audit.sourceRevision !== examples.sourceRevision ||
  audit.sourceRevision !== published.sourceRevision
)
  throw Error('M4 source revisions disagree.');
if (audit.events.length !== 22 || new Set(audit.events.map((e) => e.key)).size !== 22)
  throw Error('Expected all 22 demo events.');
if (recipes.length !== 12 || new Set(recipes.map((r) => r.slug)).size !== 12)
  throw Error('Expected twelve distinct recipes.');
for (const recipe of recipes) {
  const page = await readFile(`src/content/docs/recipes/${recipe.slug}.mdx`, 'utf8');
  if (
    !examples.examples.some((e) => e.file === `examples/${recipe.example}`) ||
    !page.includes(recipe.example)
  )
    throw Error(`Recipe has no checked component: ${recipe.slug}`);
  await access(`src/content/docs/demos/${recipe.demo}.mdx`);
}
for (const demo of demos) {
  if (demo.status !== 'available') throw Error(`M4 guide unavailable: ${demo.slug}`);
  const page = await readFile(`src/content/docs/demos/${demo.slug}.mdx`, 'utf8');
  for (const part of [
    '<Explanation',
    '## Try it in Unity',
    '## Common surprises',
    '<DemoNavigation',
  ])
    if (!page.includes(part)) throw Error(`Missing guide section ${part}: ${demo.slug}`);
  const ids = [...page.matchAll(/(?:<Capture id|\bid)="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids)
    if (!captures.some((c) => c.id === id && c.demo === demo.slug))
      throw Error(`Unknown or wrong-demo screenshot: ${demo.slug}/${id}`);
  if (demo.slug !== '01-campfire' && !page.includes(`<DemoContract demo="${demo.slug}"`))
    throw Error(`Missing verified settings: ${demo.slug}`);
}
const before = await read('validation/m4/session-before.json');
const after = await read('validation/m4/session-after.json');
if (JSON.stringify(before) !== JSON.stringify(after))
  throw Error('M4 did not restore Unity scene and play state.');
console.log(
  'M4 OK: ten walkthroughs, twelve recipes, 22 audited events, and restored Unity session.',
);

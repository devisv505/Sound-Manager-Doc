import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const read = async (p) => JSON.parse(await readFile(p, 'utf8'));
const colors = await read('content-data/node-colors.json');
const catalogue = await read('content-data/node-catalogue.json');
assert.equal(colors.sourceRevision, catalogue.sourceRevision);
assert.equal(colors.categories.length, 7);
assert.equal(new Set(colors.categories.map((c) => c.name)).size, 7);
assert.deepEqual(Object.keys(colors.nodes).sort(), catalogue.nodes.map((n) => n.operation).sort());
for (const category of colors.categories) {
  assert(/^#[A-F0-9]{6}$/.test(category.color));
  assert(category.colorName && category.description);
}
for (const category of Object.values(colors.nodes))
  assert(colors.categories.some((c) => c.name === category));
assert.equal(colors.nodes.RandomClip, 'Sources');
assert.equal(colors.nodes.RandomFloat, 'Random');
console.log('Node colors OK: all 49 operations mapped to seven named editor categories.');

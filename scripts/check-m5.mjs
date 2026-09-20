import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const read = (file) => readFile(file, 'utf8');
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash('sha256').update(value).digest('hex');
const catalogue = await json('content-data/node-catalogue.json');
const audit = await json('validation/m5/runtime-audit.json');
const source = await json('validation/m5/source-audit.json');
const coverage = await json('content-data/api-coverage.json');
const baseline = await json('content-data/source-baseline.json');
const command = await json('validation/m5/runtime-command.json');
assert(
  audit.success &&
    command.success &&
    command.data.result.success &&
    command.data.result.result.success,
  'M5 Unity audit must succeed, including the inner command result',
);
for (const record of [catalogue, audit, source, coverage])
  assert.equal(record.sourceRevision, baseline.revision);
assert.equal(audit.unity, baseline.unityVersion);
assert.equal(catalogue.nodes.length, 49);
assert.equal(new Set(catalogue.nodes.map((node) => node.operation)).size, 49);
assert.deepEqual(
  catalogue.nodes.map((node) => node.operation).sort(),
  audit.nodes.map((node) => node.operation).sort(),
);
const counts = { lifecycle: 5, clips: 4, parameters: 7, flow: 7, timing: 5, math: 21 };
for (const [family, count] of Object.entries(counts)) {
  const nodes = catalogue.nodes.filter((node) => node.family === family);
  assert.equal(nodes.length, count);
  const page = await read(`src/content/docs/graph/${family}.mdx`);
  assert(page.includes("sitePath('recipes/"), `${family} needs a working example link`);
  for (const node of nodes) {
    const native = audit.nodes.find((item) => item.operation === node.operation);
    assert.equal(node.title, native.title);
    assert.deepEqual(
      node.ports.filter((port) => !port.name.includes('…')),
      native.ports,
      `${node.operation}: fixed ports differ from Unity`,
    );
    const dynamic = node.ports.filter((port) => port.name.includes('…'));
    if (['Sequence', 'BranchByIndex', 'RandomBranch'].includes(node.operation))
      assert.deepEqual(dynamic, [
        { direction: 'Output', name: 'Out 0 … Out (Count − 1)', type: 'Execution' },
      ]);
    else if (['SelectFloat', 'SelectInt', 'SelectByIndex'].includes(node.operation))
      assert.deepEqual(dynamic, [
        {
          direction: 'Input',
          name: 'In 0 … In (Count − 1)',
          type: { SelectFloat: 'Float', SelectInt: 'Int', SelectByIndex: 'Clip' }[node.operation],
        },
      ]);
    else if (node.operation === 'RandomClip')
      assert.deepEqual(dynamic, [{ direction: 'Input', name: 'Clip 1 … Clip N', type: 'Clip' }]);
    else assert.equal(dynamic.length, 0);
    for (const key of ['behavior', 'setup', 'example'])
      assert(node[key]?.length > 15, `${node.operation} lacks ${key}`);
    assert(
      page.includes(`## ${node.title}\n`) &&
        page.includes(`<NodeReference operation="${node.operation}" />`),
      `${node.operation} is missing from its family page`,
    );
  }
}
assert.equal(coverage.types.filter((type) => type.category === 'advanced').length, 18);
for (const type of coverage.types.filter((type) =>
  ['consumer', 'advanced', 'generated'].includes(type.category),
)) {
  assert.notEqual(type.status, 'deferred', `${type.name} remains deferred`);
  for (const member of type.members)
    assert.notEqual(member.status, 'deferred', `${type.name}.${member.name} remains deferred`);
}
for (const type of coverage.types.filter((type) => type.category === 'advanced')) {
  assert.equal(type.status, 'documented');
  const page = await read(`src/content/docs/${type.page.slice(0, -1)}.mdx`);
  assert(page.includes(`<ApiSignatures type="${type.name}" />`));
  for (const member of type.members) assert.equal(member.status, 'documented');
}
for (const excerpt of source.excerpts) {
  const page = await read(`src/content/docs/${excerpt.page}.mdx`);
  const code = [...page.matchAll(/```csharp[^\n]*\n([\s\S]*?)```/g)][excerpt.index]?.[1];
  assert(
    code && hash(code) === excerpt.sha256,
    `${excerpt.page} excerpt changed after compilation`,
  );
  const compiled = await read('validation/m5/CompileM5Excerpts.cs.txt');
  assert(
    compiled.includes(
      code
        .trimEnd()
        .split('\n')
        .map((line) => '        ' + line)
        .join('\n'),
    ),
    'Compiled excerpt must match the displayed code',
  );
}
assert.equal(hash(await read('validation/m5/VerifyM5Reference.cs.txt')), source.harnessSha256);
assert.equal(
  hash(await read('validation/m5/CompileM5Excerpts.cs.txt')),
  source.excerptsHarnessSha256,
);
assert(
  source.sources.some(
    (entry) => entry.path === catalogue.source && entry.sha256 === catalogue.sourceSha256,
  ),
);
for (const file of ['unity-before', 'unity-after']) {
  const proof = await json(`validation/m5/${file}.json`);
  assert(proof.success && proof.data.result.success, `${file} snapshot failed`);
}
const before = (await json('validation/m5/unity-before.json')).data.result.result;
const after = (await json('validation/m5/unity-after.json')).data.result.result;
assert.deepEqual(after, before, 'M5 audit must preserve the active Unity scene and mode');
for (const route of [
  'graph/trimming',
  'graph/authoring',
  'graph/validation',
  'guides/outcomes',
  'guides/troubleshooting',
])
  await access(`src/content/docs/${route}.mdx`);
console.log(
  `M5 OK: 49 nodes and native ports, 18 advanced types, ${source.excerpts.length} compiled excerpts, ${audit.checks.length} Unity checks, and unchanged Unity scene.`,
);

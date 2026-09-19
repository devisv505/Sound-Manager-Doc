// Astro emits imported PNGs alongside transformed images. Keep only the WebP versions
// used by the site, without deleting unrelated assets or any referenced original.
import { readFile, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const walk = async (directory) =>
  (
    await Promise.all(
      (await readdir(directory, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? walk(path.join(directory, entry.name))
          : path.join(directory, entry.name),
      ),
    )
  ).flat();
const files = await walk('dist');
const manifest = JSON.parse(await readFile('content-data/captures.json', 'utf8'));
const originals = new Set(manifest.captures.map((capture) => capture.sha256));
const references = (
  await Promise.all(
    files
      .filter((file) => /\.(?:html|css|js|json|xml)$/.test(file))
      .map((file) => readFile(file, 'utf8')),
  )
).join('\n');
let count = 0;
let bytes = 0;
for (const file of files.filter(
  (file) => file.startsWith('dist/_astro/') && file.endsWith('.png'),
)) {
  const data = await readFile(file);
  if (!originals.has(createHash('sha256').update(data).digest('hex'))) continue;
  if (references.includes(path.basename(file)))
    throw Error(`A page still uses an unoptimized capture: ${file}`);
  await unlink(file);
  count++;
  bytes += data.length;
}
console.log(
  `Capture output: omitted ${count} unreferenced source PNGs (${(bytes / 1e6).toFixed(1)} MB); original files remain in the repository.`,
);

import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
const base = '/Sound-Manager-Doc/';
const walk = async (d) =>
  (
    await Promise.all(
      (await readdir(d, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? walk(path.join(d, e.name)) : path.join(d, e.name),
      ),
    )
  ).flat();
const files = (await walk('dist')).filter((f) => f.endsWith('.html'));
let links = 0;
for (const f of files) {
  const html = await readFile(f, 'utf8');
  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|data:|mailto:|tel:|javascript:|\/\/)/.test(raw)) continue;
    const current = base + path.relative('dist', f).replace(/index\.html$/, '');
    const url = new URL(raw, 'https://docs.test' + current);
    if (!url.pathname.startsWith(base)) throw Error(`${f}: URL outside base ${raw}`);
    const relative = decodeURIComponent(url.pathname.slice(base.length));
    const target = path.join(
      'dist',
      relative,
      ...(url.pathname.endsWith('/') ? ['index.html'] : []),
    );
    await access(target).catch(() => {
      throw Error(`${f}: Missing target ${raw} => ${target}`);
    });
    if (url.hash && target.endsWith('.html')) {
      const doc = await readFile(target, 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      if (!doc.includes(`id="${id}"`)) throw Error(`${f}: Missing anchor ${raw}`);
    }
    links++;
  }
  if (/(?:file:\/\/|\/Users\/devisv)/.test(html))
    throw Error(`${f}: Local filesystem reference in published page`);
}
await access('dist/pagefind/pagefind.js');
console.log(
  `Build OK: ${files.length} HTML pages, ${links} local links/assets, repository base and Pagefind output verified.`,
);

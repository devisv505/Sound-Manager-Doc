import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const walk = async (dir) =>
  (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
const files = await walk('dist');
const forbidden = /\.(?:wav|mp3|ogg|flac|blend|fbx|unity|cs|env)$/i;
let checked = 0,
  bytes = 0;
for (const file of files) {
  if (forbidden.test(file) || /(?:^|\/)(?:Library|Temp|\.git|node_modules)(?:\/|$)/.test(file))
    throw Error(`Unexpected published file: ${file}`);
  bytes += (await stat(file)).size;
  if (!/\.(html|css|js|json|xml|txt)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  if (
    /(?:sk_[a-f0-9]{40,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----)/.test(
      text,
    )
  )
    throw Error(`Potential credential in ${file}`);
  if (file.endsWith('.html')) {
    const canonical = text.match(/rel="canonical" href="([^"]+)"/);
    if (!canonical || !canonical[1].startsWith('https://devisv505.github.io/Sound-Manager-Doc/'))
      throw Error(`Unexpected canonical in ${file}`);
    for (const match of text.matchAll(/srcset="([^"]+)"/g)) {
      for (const item of match[1].split(',')) {
        const url = item.trim().split(/\s+/)[0];
        if (!url.startsWith('/Sound-Manager-Doc/'))
          throw Error(`Image variant outside base: ${file}`);
        await stat(path.join('dist', url.slice('/Sound-Manager-Doc/'.length)));
        checked++;
      }
    }
  }
  if (file.endsWith('.css')) {
    for (const match of text.matchAll(/url\(["']?([^\s)"']+)["']?\)/g)) {
      const url = match[1];
      if (/^(data:|#)/.test(url)) continue;
      if (/^https?:/.test(url)) throw Error(`External font/image dependency in ${file}`);
      const target = url.startsWith('/Sound-Manager-Doc/')
        ? path.join('dist', url.slice('/Sound-Manager-Doc/'.length))
        : path.resolve(path.dirname(file), url);
      await stat(target);
      checked++;
    }
  }
}
console.log(
  `Release output OK: ${files.length} files, ${(bytes / 1e6).toFixed(2)} MB, ${checked} responsive image/font references; canonical URLs, credential patterns, and excluded asset types checked.`,
);

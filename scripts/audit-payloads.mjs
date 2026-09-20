import { chromium } from '@playwright/test';
import { readdir, writeFile } from 'node:fs/promises';
const walk = async (dir) =>
  (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? walk(`${dir}/${e.name}`) : `${dir}/${e.name}`,
      ),
    )
  ).flat();
const routes = (await walk('dist'))
  .filter((p) => p.endsWith('.html'))
  .map((p) => p.replace(/^dist\//, '').replace(/index\.html$/, ''));
const browser = await chromium.launch();
const results = [];
try {
  for (const route of routes) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    const badResponses = [],
      externalRequests = [];
    page.on('response', (r) => {
      if (r.status() >= 400 && !r.url().endsWith('/404.html'))
        badResponses.push({ url: r.url(), status: r.status() });
    });
    page.on('request', (r) => {
      if (!r.url().startsWith('http://127.0.0.1:4321/')) externalRequests.push(r.url());
    });
    await page.goto('http://127.0.0.1:4321/Sound-Manager-Doc/' + route, {
      waitUntil: 'networkidle',
    });
    const data = await page.evaluate(() => {
      const entries = [
        ...performance.getEntriesByType('navigation'),
        ...performance.getEntriesByType('resource'),
      ];
      return {
        transferBytes: entries.reduce((sum, e) => sum + (e.transferSize || 0), 0),
        imageBytes: entries
          .filter((e) => e.initiatorType === 'img')
          .reduce((sum, e) => sum + (e.transferSize || 0), 0),
      };
    });
    results.push({ route, ...data, badResponses, externalRequests });
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(
  'validation/m6/payloads.json',
  JSON.stringify(
    {
      method:
        'Fresh browser context per route, 390×844 CSS pixels, DPR 2, no scrolling or dialogs/search opened. Navigation and resource transferSize after network idle on local production preview.',
      results,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  `Cold route payloads: ${results.length} pages; largest ${Math.max(...results.map((r) => r.transferBytes))} bytes.`,
);
if (
  results.some(
    (r) => r.transferBytes >= 1_000_000 || r.badResponses.length || r.externalRequests.length,
  )
)
  process.exitCode = 1;

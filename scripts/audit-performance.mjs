import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const origin = process.env.DOCS_PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
const base = '/Sound-Manager-Doc/';
await mkdir('validation/m6', { recursive: true });
const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
});
const results = [];
try {
  for (const route of ['', 'getting-started/', 'graph/math/']) {
    const { lhr } = await lighthouse(origin + base + route, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    const name = route.replaceAll('/', '-') || 'home';
    await writeFile(`validation/m6/lighthouse-${name}.json`, JSON.stringify(lhr, null, 2));
    const entry = {
      route,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, val]) => [key, Math.round(val.score * 100)]),
      ),
      transferBytes: lhr.audits['total-byte-weight'].numericValue,
      fcp: lhr.audits['first-contentful-paint'].numericValue,
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      errors: lhr.runtimeError || null,
    };
    results.push(entry);
    console.log(JSON.stringify(entry));
  }
} finally {
  chrome.kill();
}
await writeFile(
  'validation/m6/performance.json',
  JSON.stringify(
    {
      mode: 'Lighthouse default simulated mobile; cold navigation; local production preview',
      results,
    },
    null,
    2,
  ),
);
if (results.some((r) => r.errors || r.scores.performance < 90 || r.transferBytes >= 1_000_000))
  process.exitCode = 1;

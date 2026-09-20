import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = '/Sound-Manager-Doc/';
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`],
  );
const routes = walk('dist')
  .filter((p) => p.endsWith('.html'))
  .map((p) => p.replace(/^dist\//, '').replace(/index\.html$/, ''));
mkdirSync('validation/m6', { recursive: true });

test('every production page passes WCAG A/AA automation and phone/tablet layout checks', async ({
  page,
}) => {
  test.setTimeout(300000);
  const results = [];
  for (const route of routes) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.expressive-code pre')].every(
        (e) => e.scrollWidth <= e.clientWidth || e.getAttribute('tabindex') === '0',
      ),
    );
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.sl-markdown-content table')].every(
        (e) => e.scrollWidth <= e.clientWidth || e.getAttribute('tabindex') === '0',
      ),
    );
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const entry: any = {
      route,
      violations: audit.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
      layouts: [],
    };
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      );
      entry.layouts.push({
        width,
        fits: await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      });
    }
    results.push(entry);
  }
  writeFileSync('validation/m6/accessibility-layout.json', JSON.stringify(results, null, 2));
  expect(
    results.flatMap((r) =>
      r.violations.map((v: { id: string; impact: string; nodes: unknown[] }) => ({
        route: r.route,
        ...v,
      })),
    ),
  ).toEqual([]);
  expect(
    results.flatMap((r) =>
      r.layouts.filter((l: any) => !l.fits).map((l: any) => ({ route: r.route, ...l })),
    ),
  ).toEqual([]);
});

test('search finds exact symbols and everyday words, and nested refresh works', async ({
  page,
}) => {
  await page.goto(base + 'graph/');
  await page.reload();
  await expect(page.locator('h1')).toContainText('Build a sound');
  await page.locator('[data-open-modal]').click();
  for (const query of ['SoundBus', 'SoundPlayContext', 'trim', 'follow', 'crossfade', 'owner']) {
    await page.locator('.pagefind-ui__search-input').fill(query);
    await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
    await expect(page.locator('.pagefind-ui__message')).not.toContainText('No results');
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-open-modal]')).toBeFocused();
  const missing = await page.goto(base + 'missing-m6-page/');
  expect(missing!.status()).toBe(404);
  await page.goto(base + '404.html');
  await expect(page.locator('h1')).toContainText('404');
  await expect(page.locator('a[href="/Sound-Manager-Doc/"]').first()).toBeVisible();
});

test('color key, keyboard previews, 200% text, and reduced motion remain usable', async ({
  page,
}) => {
  await page.goto(base + 'graph/#recognize-nodes-by-color');
  await expect(page.locator('.color-key tbody tr')).toHaveCount(7);
  await page.locator('.color-key').screenshot({ path: 'validation/m6/node-color-key.png' });
  await page.goto(base + 'graph/timing/#idle-loop');
  const node = page.locator('[data-node="IdleLoop"]');
  await expect(node.locator('.node-color')).toContainText('Logic · orange header');
  const button = node.locator('.image-open');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(node.locator('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await node.screenshot({ path: 'validation/m6/idle-loop.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['', 'getting-started/', 'graph/', 'api/sound-bus/', 'advanced/service/']) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(base + route);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      route,
    ).toBe(true);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.locator('body').evaluate((e) => getComputedStyle(e).animationName)).toBe(
      'none',
    );
    await page.screenshot({
      path: `validation/m6/zoom-${route.replaceAll('/', '-') || 'home'}.png`,
    });
  }
});

test('phone pages retain accessible controls and keyboard scrolling', async ({ page }) => {
  test.setTimeout(300000);
  await page.setViewportSize({ width: 320, height: 740 });
  const results = [];
  for (const route of routes) {
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.expressive-code pre')].every(
        (e) => e.scrollWidth <= e.clientWidth || e.getAttribute('tabindex') === '0',
      ),
    );
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.sl-markdown-content table')].every(
        (e) => e.scrollWidth <= e.clientWidth || e.getAttribute('tabindex') === '0',
      ),
    );
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    results.push({
      route,
      violations: audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    });
  }
  writeFileSync('validation/m6/accessibility-phone.json', JSON.stringify(results, null, 2));
  expect(results.filter((r) => r.violations.length)).toEqual([]);
  await page.goto(base + 'getting-started/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#_top$/);
  await page.screenshot({ path: 'validation/m6/getting-started-phone.png' });
});

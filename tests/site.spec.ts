import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
const base = '/Sound-Manager-Doc/';
test('home, source images, gallery, and primary navigation', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', (e) => failures.push(e.message));
  await page.goto(base);
  await expect(page.locator('h1')).toHaveText('A little sound.A lot of life.');
  await expect(page.locator('.demo-card')).toHaveCount(10);
  await expect(page.locator('.hero-scene img')).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator('.hero-scene img')
        .evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({ path: 'validation/home-desktop.png', fullPage: true });
  await page.getByRole('link', { name: 'Make your first sound' }).click();
  await expect(page.locator('h1')).toHaveText('Your first sound.');
  expect(failures).toEqual([]);
});
test('Campfire deep link, screenshots, image dialog and keyboard focus', async ({ page }) => {
  await page.goto(base + 'demos/01-campfire/');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('A little warmth.');
  const buttons = page.getByRole('button', { name: /Enlarge image/ });
  await expect(buttons).toHaveCount(3);
  const graph = page.locator('#campfire-graph .image-open');
  await graph.click();
  const dialog = page.locator('#campfire-graph-dialog');
  await expect(dialog).toBeVisible();
  await expect
    .poll(() =>
      dialog.locator('img').evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 3000),
    )
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(graph).toBeFocused();
  await page.screenshot({ path: 'validation/campfire-desktop.png', fullPage: true });
});
test('built search finds concepts and the public API', async ({ page }) => {
  await page.goto(base + 'api/sound-bus/');
  await page.locator('[data-open-modal]').click();
  const input = page.locator('.pagefind-ui__search-input');
  await input.fill('SoundBus');
  await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
  await expect(page.locator('.pagefind-ui__results')).toContainText('SoundBus');
  await input.fill('crackle');
  await expect(page.locator('.pagefind-ui__results')).toContainText('warmth');
  await page.screenshot({ path: 'validation/search-desktop.png' });
  await page.keyboard.press('Escape');
});
test('copyable C# stays identical to the validated example', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(base + 'recipes/campfire-loop/');
  const block = page
    .locator('.expressive-code')
    .filter({ hasText: 'public sealed class CampfireSound' })
    .first();
  const copy = block.getByRole('button', { name: /copy/i });
  await copy.click();
  const value = await page.evaluate(() => navigator.clipboard.readText());
  expect(value.trim()).toBe(readFileSync('examples/CampfireSound.cs', 'utf8').trim());
  expect(value).toContain('private void OnDisable() => Extinguish();');
});
test('mobile navigation and pages do not overflow', async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['', 'getting-started/', 'api/sound-bus/', 'demos/01-campfire/']) {
      await page.goto(base + route);
      const sizes = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(sizes.scroll, route).toBeLessThanOrEqual(sizes.client + 1);
      if (width === 390 && !route)
        await page.screenshot({ path: 'validation/home-mobile.png', fullPage: true });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + 'getting-started/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page
    .locator('#starlight__sidebar')
    .getByRole('link', { name: 'SoundBus', exact: true })
    .click();
  await expect(page.locator('h1')).toHaveText('SoundBus');
  await page.screenshot({ path: 'validation/api-mobile.png', fullPage: true });
});

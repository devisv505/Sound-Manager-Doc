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
  await page.locator('#starlight__sidebar').getByText('API reference', { exact: true }).click();
  await page
    .locator('#starlight__sidebar')
    .getByRole('link', { name: 'SoundBus', exact: true })
    .click();
  await expect(page.locator('h1')).toHaveText('SoundBus');
  await page.screenshot({ path: 'validation/api-mobile.png', fullPage: true });
});

test('M2 guide navigation, exact signatures, and API coverage', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(base + 'guides/');
  await page.getByRole('link', { name: 'Change sounds with parameters', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Change sounds with parameters.');
  await page.getByRole('link', { name: 'parameter reference', exact: true }).click();
  await expect(page.locator('#api-soundparameteroverride')).toContainText(
    'public SoundParameterOverride(string name, SoundValue value)',
  );
  await page.goto(base + 'api/context/');
  await page.reload();
  await expect(page.locator('#api-soundplaycontext')).toContainText(
    'public readonly SoundPlayContext With(SoundParameterId parameter, AudioClip value)',
  );
  await page.goto(base + 'api/coverage/');
  await expect(page.getByRole('heading', { name: 'Everyday integration', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'SoundRequest', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('M2 complete components copy exactly and search finds beginner topics', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  for (const [route, name] of [
    ['getting-started/', 'FirstSound'],
    ['guides/position-and-ownership/', 'MovingBeeSound'],
    ['guides/signals-and-notifications/', 'EngineSoundControls'],
  ]) {
    await page.goto(base + route);
    const block = page.locator('.expressive-code').filter({ hasText: `public sealed class ${name}` }).first();
    await block.getByRole('button', { name: /copy/i }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.trim()).toBe(readFileSync(`examples/${name}.cs`, 'utf8').trim());
  }
  await page.locator('[data-open-modal]').click();
  const input = page.locator('.pagefind-ui__search-input');
  await input.fill('owner');
  await expect(page.locator('.pagefind-ui__results')).toContainText(/owner/i);
  await input.fill('SoundPlayContext');
  await expect(page.locator('.pagefind-ui__results')).toContainText('SoundPlayContext');
});

test('M2 long reference pages and guides fit a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  for (const route of [
    'getting-started/', 'guides/parameters/', 'guides/position-and-ownership/',
    'guides/signals-and-notifications/', 'api/context/', 'api/services/',
    'api/components/', 'api/settings/', 'api/coverage/',
  ]) {
    await page.goto(base + route);
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(sizes.scroll, route).toBeLessThanOrEqual(sizes.client + 1);
  }
  await page.goto(base + 'getting-started/');
  await page.screenshot({ path: 'validation/m2-first-sound-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + 'guides/position-and-ownership/');
  await page.screenshot({ path: 'validation/m2-moving-sound-desktop.png', fullPage: true });
});

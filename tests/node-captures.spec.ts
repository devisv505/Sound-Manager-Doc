import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
const base = '/Sound-Manager-Doc/';
const nodes = JSON.parse(readFileSync('content-data/node-catalogue.json', 'utf8')).nodes;
const captures = JSON.parse(readFileSync('content-data/node-captures.json', 'utf8')).captures;

test('homepage pairs the actual Campfire graph with code and stacks on a phone', async ({
  page,
  context,
}) => {
  await page.goto(base);
  const graph = page.locator('.home-graph-panel'),
    code = page.locator('.home-script-panel');
  await graph.scrollIntoViewIfNeeded();
  const a = await graph.boundingBox(),
    b = await code.boundingBox();
  expect(Math.abs(a!.y - b!.y)).toBeLessThan(2);
  expect(b!.x).toBeGreaterThan(a!.x + a!.width);
  await expect(graph.locator('img').first()).toHaveJSProperty('complete', true);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await code.getByRole('button', { name: /copy/i }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'SoundBus.Play(Sounds.Campfire, transform)',
  );
  await graph.getByRole('button', { name: /Enlarge image/ }).click();
  await expect(page.locator('#home-campfire-graph-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page
    .locator('.home-code')
    .screenshot({ path: 'validation/node-captures/home-graph-code-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await graph.scrollIntoViewIfNeeded();
  const mobileGraph = await graph.boundingBox(),
    mobileCode = await code.boundingBox();
  expect(mobileCode!.y).toBeGreaterThanOrEqual(mobileGraph!.y + mobileGraph!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page
    .locator('.home-code')
    .screenshot({ path: 'validation/node-captures/home-graph-code-phone.png' });
});

test('every node has its own genuine capture and full-size dialog', async ({ page }) => {
  test.setTimeout(60000);
  for (const family of [...new Set<string>(nodes.map((n: any) => n.family))]) {
    await page.goto(base + `graph/${family}/`);
    for (const node of nodes.filter((n: any) => n.family === family)) {
      const capture = captures.find((c: any) => c.operation === node.operation);
      const section = page.locator(`[data-node="${node.operation}"]`);
      const image = section.locator('.image-open img');
      await expect(image).toHaveCount(1);
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute('alt', capture.alt);
      await expect(section.locator('.zoom-label')).toHaveCount(0);
      await expect(section.locator('.node-color')).toBeVisible();
      await expect
        .poll(() => image.evaluate((im: HTMLImageElement) => im.complete && im.naturalWidth > 0))
        .toBe(true);
      await section.getByRole('button', { name: /Enlarge image/ }).click();
      const dialog = section.locator('dialog');
      await expect(dialog).toBeVisible();
      await expect
        .poll(() =>
          dialog.locator('img').evaluate((im: HTMLImageElement) => im.complete && im.naturalWidth),
        )
        .toBe(capture.width);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    }
  }
  await page.goto(base + 'graph/clips/#wave-asset');
  await page
    .locator('[data-node="WaveAsset"]')
    .screenshot({ path: 'validation/node-captures/wave-asset-desktop.png' });
});

test('node captures and tables fit a narrow phone and keep preview controls visible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const family of ['clips', 'parameters', 'flow', 'timing', 'math', 'lifecycle']) {
    await page.goto(base + `graph/${family}/`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
  await page.goto(base + 'graph/timing/#repeat');
  const node = page.locator('[data-node="Repeat"]');
  await node.scrollIntoViewIfNeeded();
  await node.getByRole('button', { name: /Enlarge image/ }).click();
  const dialog = node.locator('dialog');
  await expect(dialog.getByRole('button', { name: /Close/ })).toBeInViewport();
  await expect(dialog.getByRole('button', { name: 'View actual size' })).toBeInViewport();
  await page.screenshot({ path: 'validation/node-captures/repeat-phone-preview.png' });
  await page.keyboard.press('Escape');
  await node.screenshot({ path: 'validation/node-captures/repeat-phone.png' });
});

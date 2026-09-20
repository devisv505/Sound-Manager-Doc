import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
const base = '/Sound-Manager-Doc/';
const catalogue = JSON.parse(readFileSync('content-data/node-catalogue.json', 'utf8'));

test('all shipped nodes render with exact ports and working local navigation', async ({ page }) => {
  for (const family of [...new Set<string>(catalogue.nodes.map((node: any) => node.family))]) {
    await page.goto(base + `graph/${family}/`);
    const nodes = catalogue.nodes.filter((node: any) => node.family === family);
    await expect(page.locator('[data-node]')).toHaveCount(nodes.length);
    for (const node of nodes) {
      const section = page.locator(`[data-node="${node.operation}"]`);
      await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
      await expect(section.locator('tbody tr')).toHaveCount(node.ports.length);
      for (let i = 0; i < node.ports.length; i++) {
        const port = node.ports[i];
        await expect(section.locator('tbody tr').nth(i).locator('td')).toHaveText([
          port.direction,
          port.name,
          port.type,
        ]);
      }
    }
    await page
      .locator('starlight-toc')
      .getByRole('link', { name: nodes.at(-1).title, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${nodes.at(-1).anchor}$`));
  }
  await page.goto(base + 'graph/flow/#sequence');
  await expect(page.locator('[data-node="Sequence"]')).toContainText('does not wait');
  await page.screenshot({ path: 'validation/m5/flow-desktop.png' });
});

test('advanced integration has complete coverage and copyable registration code', async ({
  page,
  context,
}) => {
  const coverage = JSON.parse(readFileSync('content-data/api-coverage.json', 'utf8'));
  const types = coverage.types.filter((type: any) => type.category === 'advanced');
  expect(types).toHaveLength(18);
  for (const route of [...new Set<string>(types.map((type: any) => type.page))]) {
    await page.goto(base + route);
    for (const type of types.filter((type: any) => type.page === route)) {
      expect(type.status).toBe('documented');
      await expect(
        page.locator(`#api-${type.name.toLowerCase().replaceAll('.', '-')}`),
      ).toHaveCount(1);
    }
  }
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(base + 'advanced/service/');
  const example = page
    .locator('.expressive-code')
    .filter({ hasText: 'Collect, register, and prepare' });
  await example.getByRole('button', { name: /copy/i }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('SoundCatalogue.Collect(null, new[] { library }, diagnostics)');
  expect(copied).toContain('service.BeginPreparation();');
  await page.screenshot({ path: 'validation/m5/service-desktop.png' });
});

test('new graph and advanced material is searchable', async ({ page }) => {
  await page.goto(base + 'graph/');
  await page.locator('[data-open-modal]').click();
  const input = page.locator('.pagefind-ui__search-input');
  await input.fill('ContinuationCapacity');
  await expect(page.locator('.pagefind-ui__results')).toContainText(
    /broken connection|running graph/,
  );
  await input.fill('SoundVoiceRequest');
  await expect(page.locator('.pagefind-ui__results')).toContainText('clock and a voice backend');
  await page.keyboard.press('Escape');
});

test('phone reference tables stay contained and trim capture remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    'graph/math/',
    'graph/clips/',
    'advanced/service/',
    'advanced/backend/',
    'guides/outcomes/',
    'guides/troubleshooting/',
  ]) {
    await page.goto(base + route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await expect(page.locator('h1')).toBeVisible();
  }
  await page.screenshot({ path: 'validation/m5/troubleshooting-phone.png' });
  await page.goto(base + 'graph/trimming/');
  await page.locator('#footstep-trim-range .image-open').click();
  const dialog = page.locator('#footstep-trim-range-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Close/ })).toBeVisible();
  const fits = await dialog.locator('.image-viewport').evaluate((viewport) => {
    const image = viewport.querySelector('img')!;
    return image.getBoundingClientRect().height <= viewport.clientHeight + 1;
  });
  expect(fits).toBe(true);
  await page.screenshot({ path: 'validation/m5/trimming-phone.png' });
  await page.keyboard.press('Escape');
});

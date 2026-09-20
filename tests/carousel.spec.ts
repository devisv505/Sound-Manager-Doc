import { test, expect } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
const demos = JSON.parse(readFileSync('content-data/demos.json', 'utf8'));
const base = '/Sound-Manager-Doc/';
mkdirSync('validation/carousel', { recursive: true });
const active = '.demo-slide:not([hidden])';

test('carousel shows all ten real demos with matching links, navigation and accessible controls', async ({
  page,
}) => {
  await page.goto(base);
  const carousel = page.getByRole('region', { name: 'Explore the ten demos' });
  await expect(carousel.locator('.demo-slide')).toHaveCount(10);
  await carousel.getByRole('button', { name: 'Pause slideshow' }).click();
  for (const demo of demos) {
    const slide = carousel.locator(active);
    await expect(slide.locator('strong')).toHaveText(demo.title);
    await expect(slide.locator('a')).toHaveAttribute('href', `${base}demos/${demo.slug}/`);
    await expect
      .poll(() =>
        slide.locator('img').evaluate((im: HTMLImageElement) => im.complete && im.naturalWidth > 0),
      )
      .toBe(true);
    await carousel.screenshot({
      animations: 'disabled',
      path: `validation/carousel/${demo.slug}.png`,
    });
    await carousel.getByRole('button', { name: 'Next demo' }).click();
  }
  await expect(carousel.locator(active)).toContainText('A little warmth.');
  await carousel.getByRole('button', { name: 'Previous demo' }).click();
  await expect(carousel.locator(active)).toContainText('A little liftoff.');
  const audit = await new AxeBuilder({ page })
    .include('demo-carousel')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  await carousel.locator(`${active} a`).click();
  await expect(page).toHaveURL(new RegExp(`${base}demos/10-launch/$`));
});

test('autoplay loops, pauses for hover/focus, and obeys the explicit pause control', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto(base);
  const carousel = page.locator('demo-carousel');
  await expect(carousel.locator('.carousel-controls')).toBeVisible();
  await carousel.scrollIntoViewIfNeeded();
  for (let i = 1; i <= 10; i++) {
    await page.clock.fastForward(5100);
    await expect(carousel.locator(`${active} strong`)).toHaveText(demos[i % 10].title);
  }
  await carousel.hover();
  await page.clock.fastForward(10000);
  await expect(carousel.locator(active)).toContainText('A little warmth.');
  await page.mouse.move(0, 0);
  await page.clock.fastForward(5100);
  await expect(carousel.locator(active)).toContainText('Every step counts.');
  await carousel.locator(`${active} a`).focus();
  await page.clock.fastForward(10000);
  await expect(carousel.locator(active)).toContainText('Every step counts.');
  await carousel.getByRole('button', { name: 'Pause slideshow' }).click();
  await page.locator('h1').click();
  await page.clock.fastForward(10000);
  await expect(carousel.locator(active)).toContainText('Every step counts.');
  await carousel.getByRole('button', { name: 'Play slideshow' }).click();
  await page.clock.fastForward(5100);
  await expect(carousel.locator(active)).toContainText('A little buzz.');
  await page.mouse.move(0, 0);
  await page.locator('.home-section-heading').scrollIntoViewIfNeeded();
  await expect(carousel).not.toBeInViewport();
  await page.clock.fastForward(10000);
  await expect(carousel.locator(active)).toContainText('A little buzz.');
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel).toBeInViewport({ ratio: 0.25 });
  await page.clock.fastForward(5100);
  await expect(carousel.locator(active)).toContainText('A little drive.');
});

test('keyboard navigation keeps focus and reduced motion starts paused on small screens', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(base);
  const carousel = page.locator('demo-carousel');
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel.getByRole('button', { name: 'Play slideshow' })).toBeVisible();
  await page.clock.fastForward(15000);
  await expect(carousel.locator(active)).toContainText('A little warmth.');
  await carousel.locator(`${active} a`).focus();
  await page.keyboard.press('ArrowRight');
  await expect(carousel.locator(`${active} a`)).toBeFocused();
  await expect(carousel.locator(active)).toContainText('Every step counts.');
  await page.keyboard.press('End');
  await expect(carousel.locator(active)).toContainText('A little liftoff.');
  await page.keyboard.press('Home');
  await expect(carousel.locator(active)).toContainText('A little warmth.');
  for (const width of [320, 390, 768, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    for (const button of await carousel.locator('button').all()) {
      const box = await button.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    await carousel.screenshot({
      animations: 'disabled',
      path: `validation/carousel/width-${width}.png`,
    });
  }
});

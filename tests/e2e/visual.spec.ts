import { expect, test } from '@playwright/test';
import { PNG } from 'pngjs';

const viewports = [
  { name: 'desktop', width: 1280, height: 820 },
  { name: 'mobile', width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`renders a nonblank interactive canvas on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/crystal-growth-simulator/');
    await page.getByRole('button', { name: /start/i }).click();
    await expect(page.getByText(/growing|fallback active/i)).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(900);

    const canvas = page.locator('canvas');
    const buffer = await canvas.screenshot();
    const image = PNG.sync.read(buffer);
    let litPixels = 0;
    let variedPixels = 0;

    for (let index = 0; index < image.data.length; index += 4 * 31) {
      const r = image.data[index];
      const g = image.data[index + 1];
      const b = image.data[index + 2];
      if (r + g + b > 55) {
        litPixels += 1;
      }
      if (Math.max(r, g, b) - Math.min(r, g, b) > 12) {
        variedPixels += 1;
      }
    }

    expect(litPixels).toBeGreaterThan(20);
    expect(variedPixels).toBeGreaterThan(20);
  });
}

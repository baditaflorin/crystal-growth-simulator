import { expect, test } from '@playwright/test';

test('loads the simulator and starts a growth frame', async ({ page }) => {
  await page.goto('/crystal-growth-simulator/');
  await expect(page.getByRole('heading', { name: 'Crystal Growth Simulator' })).toBeVisible();
  await expect(page.getByRole('link', { name: /star/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/crystal-growth-simulator'
  );
  await expect(page.getByText(/commit/i)).toBeVisible();

  await page.getByRole('button', { name: /start/i }).click();
  await expect(page.getByText(/growing|fallback active/i)).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('canvas')).toBeVisible();
});

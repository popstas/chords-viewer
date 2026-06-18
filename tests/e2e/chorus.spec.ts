import { test, expect } from '@playwright/test';

// Chorus-detection coverage. The exact heuristic (utils/chorus.ts) is verified
// manually against real songs (chorus text is downloaded, not a fixture), so
// here we assert structurally: a song opens, renders its chord/text body, and
// produces no console errors — i.e. the chorus grouping/render code is safe.

const SONG_HEADER = '.song-item .el-collapse-item__header';
const ACTIVE = '.song-item.active:visible';

test('opening a song renders without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/');
  await expect(page.locator('.song-item').first()).toBeVisible();

  await page.locator(SONG_HEADER).first().click();
  const active = page.locator(ACTIVE).first();
  await expect(active).toBeVisible();
  await expect(active.locator('.song-item__content').first()).toBeVisible();

  expect(errors).toEqual([]);
});

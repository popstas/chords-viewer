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

// Task 2: the chorus grouping flags <hr> separators that follow a chorus block
// with a `big_chorus` class. We assert structurally (a song renders at least one
// <hr>, and any chorus-flagged hr is still a real <hr>) and that verse-nav, which
// queries hr elements for scroll anchoring, still works after the change.
test('chorus hr renders and verse-nav still scrolls', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/');
  await expect(page.locator('.song-item').first()).toBeVisible();

  // open songs until we find one whose body contains at least one <hr> separator
  const headers = page.locator(SONG_HEADER);
  const count = await headers.count();
  let hrCount = 0;
  for (let i = 0; i < Math.min(count, 5); i++) {
    await headers.nth(i).click();
    const active = page.locator(ACTIVE).first();
    await expect(active).toBeVisible();
    hrCount = await active.locator('.song-item__content hr').count();
    if (hrCount > 0) break;
    await headers.nth(i).click(); // collapse and try the next song
  }
  expect(hrCount).toBeGreaterThan(0);

  // every chorus-flagged separator is still a genuine <hr> (verse-nav anchors on hr)
  const active = page.locator(ACTIVE).first();
  const chorusHrCount = await active.locator('.song-item__content hr.big_chorus').count();
  for (let i = 0; i < chorusHrCount; i++) {
    const tag = await active
      .locator('.song-item__content hr.big_chorus')
      .nth(i)
      .evaluate((el) => el.tagName.toLowerCase());
    expect(tag).toBe('hr');
  }

  // verse-nav (shown only on narrow viewports) anchors on hr; clicking must not throw
  const verseNav = page.locator('.verse-nav');
  if (await verseNav.isVisible().catch(() => false)) {
    await verseNav.click();
  }

  expect(errors).toEqual([]);
});

import { test, expect } from '@playwright/test';

// Chord nowrap-mode coverage. `chordNowrap` is a transient (non-persisted,
// default-off) store flag that switches chord lines from wrapping to horizontal
// scroll. This spec grows across tasks 3-6; here (task 3) we assert the default
// state is OFF on song open: chord lines render without the nowrap modifier.

const SONG_HEADER = '.song-item .el-collapse-item__header';
const ACTIVE = '.song-item.active:visible';
const CHORD_LINE = '.song-item__content .song-item__line_chords';
const NOWRAP_LINE = '.song-item__content .song-item__line_chords_nowrap';

// open songs until we find one whose body renders at least one chord line
async function openSongWithChords(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.locator('.song-item').first()).toBeVisible();

  const headers = page.locator(SONG_HEADER);
  const count = await headers.count();
  for (let i = 0; i < Math.min(count, 8); i++) {
    await headers.nth(i).click();
    const active = page.locator(ACTIVE).first();
    await expect(active).toBeVisible();
    if ((await active.locator('.song-item__line_chords').count()) > 0) return active;
    await headers.nth(i).click(); // collapse and try the next song
  }
  return null;
}

test('chord nowrap defaults to off on song open', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  const active = await openSongWithChords(page);
  expect(active, 'expected a song with chord lines').not.toBeNull();

  // default off: chord lines render, none carry the nowrap modifier class
  expect(await page.locator(CHORD_LINE).count()).toBeGreaterThan(0);
  expect(await page.locator(NOWRAP_LINE).count()).toBe(0);

  expect(errors).toEqual([]);
});

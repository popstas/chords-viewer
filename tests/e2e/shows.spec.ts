import { test, expect } from '@playwright/test';

// Shows (view-count) reactivity. The displayed count must reflect the store value
// reactively — previously SongItem kept a local `shows` data mirror that went stale
// after the 60s auto-increment (only a reload refreshed it). The fix renders the
// `showsStore` computed directly, so a store change (here, the manual +/- buttons,
// which dispatch setShow) updates the number on screen WITHOUT a reload.
//
// The +/- controls live in the expanded song body: `.song-categories__item_shows`
// holds the disabled count button plus −/+ buttons. Scope to the visible active
// song so the virtual scroller's recycled/off-screen copies don't ambiguate it.

const SONG_HEADER = '.song-item .el-collapse-item__header';
const ACTIVE = '.song-item.active:visible';
const SHOWS_ROW = `${ACTIVE} .song-categories__item_shows`;
const SHOWS_COUNT = `${SHOWS_ROW} .el-button.is-disabled`; // the read-only count

const readCount = async (page: import('@playwright/test').Page) => {
  const txt = await page.locator(SHOWS_COUNT).textContent();
  return parseInt((txt || '0').trim(), 10) || 0;
};

test('shows count updates reactively (no reload) when changed via the +/- buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.song-item').first()).toBeVisible();

  await page.locator(SONG_HEADER).first().click();
  await expect(page.locator(ACTIVE).first()).toBeVisible();

  // enabled (clickable) buttons in the row are [−, +]
  const actions = page.locator(`${SHOWS_ROW} .el-button:not(.is-disabled)`);
  await expect(actions.nth(1)).toBeVisible(); // the "+" button

  const before = await readCount(page);

  // "+" → addShows(1) → setShow → store update; the count must follow reactively
  await actions.nth(1).click();
  await expect(page.locator(SHOWS_COUNT)).toHaveText(String(before + 1));

  // "−" → back down, still no reload
  await actions.nth(0).click();
  await expect(page.locator(SHOWS_COUNT)).toHaveText(String(before));
});

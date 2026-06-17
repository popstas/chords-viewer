import { test, expect } from '@playwright/test';

// Smoke E2E covering the critical chords-viewer flows after the Vue 3 migration.
// Verifies behavior end-to-end against the running dev server.
//
// Notes:
// - There are two SearchInputs (Toolbar + PlayerFloating); only one is visible
//   at a time (Toolbar hides once a song is open), so fills target `:visible`.
// - On mobile the virtual scroller may render the active item twice in its
//   recycle pool, so active-item locators target `:visible`.

const SONG_HEADER = '.song-item .el-collapse-item__header';
const ACTIVE = '.song-item.active:visible';
const SEARCH = '.search-input input:visible';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.song-item').first()).toBeVisible();
});

test('app loads and renders the song list', async ({ page }) => {
  await expect(page.locator('.search-total')).toContainText(/total: \d+/);
  const count = await page.locator('.song-item').count();
  expect(count).toBeGreaterThan(10);
});

test('search filters the song list', async ({ page }) => {
  // the store suppresses filtering for the first 2s after load (anti double-filter guard)
  await page.waitForTimeout(2100);
  await page.fill(SEARCH, 'кино');
  await expect(page.locator('.search-total')).toContainText(/total: \d+/);
  await expect(page.locator(SONG_HEADER).first()).toContainText('Кино');
  const after = await page.locator('.song-item').count();
  expect(after).toBeLessThan(200);
});

test('opening a song shows its chords', async ({ page }) => {
  await page.locator(SONG_HEADER).first().click();
  const active = page.locator(ACTIVE).first();
  await expect(active).toBeVisible();
  await expect(active.locator('.song-item__content .chord_known').first()).toBeVisible();
  await expect(page).toHaveURL(/[?&]url=/);
});

test('transpose shifts the rendered chords', async ({ page }) => {
  await page.locator(SONG_HEADER).first().click();
  const active = page.locator(ACTIVE).first();
  await expect(active).toBeVisible();

  const firstChord = active.locator('.song-item__content .chord_known .el-button').first();
  const before = (await firstChord.textContent())?.trim();

  // transpose buttons within the active song: [−, level, +]
  await active.locator('.song-transpose button').nth(2).click();
  await expect(firstChord).not.toHaveText(before || '');
});

test('keyboard j/k navigate between songs', async ({ page }) => {
  await page.locator(SONG_HEADER).first().click();
  await expect(page.locator(ACTIVE).first()).toBeVisible();
  const titleOf = async () =>
    (await page.locator(`${ACTIVE} .el-collapse-item__header`).first().textContent())?.trim();
  const first = await titleOf();

  await page.keyboard.press('j'); // next
  await expect.poll(titleOf).not.toBe(first);
});

test('queue: adding a song marks it queued', async ({ page }) => {
  await page.locator(SONG_HEADER).first().click();
  const active = page.locator(ACTIVE).first();
  await expect(active).toBeVisible();

  // toggle the current song into the play queue (this also collapses the song)
  await active.locator('.song-transpose__queue').first().click();

  // queue is persisted to localStorage (same key as before the migration)
  await expect
    .poll(async () => page.evaluate(() => {
      try { return (JSON.parse(localStorage.getItem('vuex') || '{}').queue || []).length; } catch { return 0; }
    }))
    .toBeGreaterThan(0);
});

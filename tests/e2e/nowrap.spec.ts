import { test, expect } from '@playwright/test';

// Chord nowrap-mode coverage. `chordNowrap` is a transient (non-persisted,
// default-off) store flag that switches chord lines from wrapping to horizontal
// scroll. This spec grows across tasks 3-6; here (task 3) we assert the default
// state is OFF on song open: chord lines render without the nowrap modifier.

const SONG_HEADER = '.song-item .el-collapse-item__header';
const ACTIVE = '.song-item.active:visible';
const CHORD_LINE = '.song-item__content .song-item__line_chords';
const NOWRAP_LINE = '.song-item__content .song-item__line_chords_nowrap';
const NOWRAP_TOGGLE = '.song-item.active .song-transpose__nowrap';

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

// Measure (in the page) whether a chord line inside the active song would
// overflow its container when laid out on a single line — mirrors the
// component's `measureChordsOverflow` (temporarily force white-space:nowrap).
async function activeSongHasOverflowingChordLine(page: import('@playwright/test').Page) {
  return page.evaluate((sel) => {
    const lines = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
    for (const line of lines) {
      const prev = line.style.whiteSpace;
      line.style.whiteSpace = 'nowrap';
      const overflow = line.scrollWidth > line.clientWidth + 1;
      line.style.whiteSpace = prev;
      if (overflow) return true;
    }
    return false;
  }, CHORD_LINE);
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

// Task 4: chord-line overflow detection. On the narrow mobile viewport, many
// songs have chord lines wider than the 393px screen. Scan several songs and
// assert at least one produces an overflowing chord line — the condition that
// drives `chordsOverflow` (and the Task 5 toggle visibility). Desktop's wide
// viewport rarely overflows, so this assertion is mobile-only.
test('chord-line overflow is detectable on a narrow viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'overflow only reliably occurs on the mobile viewport');

  const active = await openSongWithChords(page);
  expect(active, 'expected a song with chord lines').not.toBeNull();

  // Shrink the viewport below the chord-line content width — deterministic
  // overflow that also exercises the component's debounced resize re-measure.
  await page.setViewportSize({ width: 120, height: 851 });
  await page.waitForTimeout(300);

  // the single-line content of at least one chord line now exceeds its container
  expect(
    await activeSongHasOverflowingChordLine(page),
    'expected at least one chord line to overflow on a narrow viewport',
  ).toBe(true);
});

// Task 5: nowrap toggle button. It lives in `.song-transpose__right` (left of the
// beat button) and renders ONLY when `chordsOverflow` is true. On the wide
// desktop viewport chord lines rarely overflow, so the toggle is hidden; on the
// narrow mobile viewport it appears, is clickable, and flips the pressed state.
test('nowrap toggle visibility tracks chord-line overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'wide viewport is where chord lines usually fit');

  const active = await openSongWithChords(page);
  expect(active, 'expected a song with chord lines').not.toBeNull();

  // the toggle renders only when at least one chord line overflows — assert the
  // toggle's presence mirrors the measured overflow (no overflow → no toggle)
  const overflows = await activeSongHasOverflowingChordLine(page);
  const toggleCount = await page.locator(NOWRAP_TOGGLE).count();
  if (overflows) {
    expect(toggleCount).toBeGreaterThan(0);
  } else {
    expect(toggleCount).toBe(0);
  }
});

// The DynamicScroller keeps recycled instances in its pool, so several DOM nodes
// can carry the nowrap toggle — most are translated off-screen, and one is a
// visibility:hidden size-measurement copy. Resolve the index of the toggle that is
// genuinely on-screen and interactive (the active song the user sees), or -1.
async function inViewportToggleIndex(page: import('@playwright/test').Page) {
  return page.evaluate((sel) => {
    const nodes = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
    const vw = window.innerWidth, vh = window.innerHeight;
    return nodes.findIndex((n) => {
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && n.offsetParent !== null &&
        r.left >= 0 && r.top >= 0 && r.right <= vw && r.bottom <= vh;
    });
  }, NOWRAP_TOGGLE);
}

// Navigate songs with the `j` keyboard shortcut (reliable with the virtual
// scroller — index-based header clicks detach as the list recycles) until the
// active song's chord lines overflow the mobile width and produce an on-screen
// nowrap toggle. Returns that toggle's locator, or null if none found in range.
async function openSongWithVisibleToggle(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.locator('.song-item').first()).toBeVisible();
  await page.locator(SONG_HEADER).first().click();
  await expect(page.locator(ACTIVE).first()).toBeVisible();

  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(150); // let the overflow measure settle for this song
    const idx = await inViewportToggleIndex(page);
    if (idx >= 0) return page.locator(NOWRAP_TOGGLE).nth(idx);
    await page.keyboard.press('j'); // advance to the next song
  }
  return null;
}

test('nowrap toggle appears on overflow and flips pressed state on click', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'overflow only reliably occurs on the mobile viewport');
  test.setTimeout(90000); // scans several songs via keyboard nav to find an overflowing one

  const toggle = await openSongWithVisibleToggle(page);
  expect(toggle, 'expected a song whose chord lines overflow the mobile width').not.toBeNull();
  await expect(toggle!).toBeVisible();

  // default off → not pressed
  await expect(toggle!).not.toHaveClass(/song-transpose__nowrap_active/);

  // click → pressed (chordNowrap on)
  await toggle!.click();
  await expect(toggle!).toHaveClass(/song-transpose__nowrap_active/);

  // click again → back off
  await toggle!.click();
  await expect(toggle!).not.toHaveClass(/song-transpose__nowrap_active/);
});

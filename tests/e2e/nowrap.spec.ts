import { test, expect } from '@playwright/test';

// Chord nowrap-mode coverage. `chordNowrap` is a transient (non-persisted) store
// flag that switches chord lines from wrapping to a single horizontally-scrollable
// line. Current behavior:
//   - the toggle button is ALWAYS rendered for an active song (left of the beat
//     button), painted `.song-transpose__nowrap_active` when on;
//   - it is DEFAULT ON for songs whose chord lines overflow the screen (derived
//     per song open by `measureChordsOverflow`), OFF otherwise;
//   - a manual toggle is never overridden by a later resize/font re-measure.
//
// `chordNowrap` is a single global flag, so the most robust signal for its state
// is the count of chord lines carrying the `_nowrap` modifier (NOWRAP_LINE) —
// unambiguous across the DynamicScroller's recycled/off-screen toggle copies.

const SONG_HEADER = '.song-item .el-collapse-item__header';
const ACTIVE = '.song-item.active:visible';
const CHORD_LINE = '.song-item__content .song-item__line_chords';
const NOWRAP_LINE = '.song-item__content .song-item__line_chords_nowrap';
// the toggle of the on-screen active song (`:visible` skips recycled/measure copies)
const NOWRAP_TOGGLE = `${ACTIVE} .song-transpose__nowrap`;
const ACTIVE_CLASS = /song-transpose__nowrap_active/;

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

// Open the first song at a viewport narrow enough to GUARANTEE its chord lines
// overflow, so the per-song measure auto-enables nowrap at open time (regardless
// of which song / how sparse its chords are). We stay on song 0 — no list
// navigation — to avoid the DynamicScroller's `nth(i)` detach + the trail of
// expanded songs that muddy the global count. Polls for the `_nowrap` modifier to
// appear (nextTick + 1s delayed measure).
async function openSongWithAutoNowrap(page: import('@playwright/test').Page) {
  await page.setViewportSize({ width: 120, height: 851 });
  await page.goto('/');
  await expect(page.locator('.song-item').first()).toBeVisible();
  await page.locator(SONG_HEADER).first().click();
  await expect(page.locator(ACTIVE).first()).toBeVisible();
  await expect(page.locator(NOWRAP_LINE).first()).toBeAttached({ timeout: 10000 });
}

test('nowrap toggle is always rendered for a song with chords', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  const active = await openSongWithChords(page);
  expect(active, 'expected a song with chord lines').not.toBeNull();

  // the toggle renders regardless of overflow (always visible)
  expect(await active!.locator('.song-transpose__nowrap').count()).toBeGreaterThan(0);
  // and the nowrap modifier on chord lines matches the toggle's pressed state
  const isActive = await active!
    .locator('.song-transpose__nowrap')
    .first()
    .evaluate((n) => n.classList.contains('song-transpose__nowrap_active'));
  const nowrapCount = await page.locator(NOWRAP_LINE).count();
  if (isActive) expect(nowrapCount).toBeGreaterThan(0);
  else expect(nowrapCount).toBe(0);

  expect(errors).toEqual([]);
});

// Task 4: chord-line overflow detection. On the narrow mobile viewport, many
// songs have chord lines wider than the 393px screen. Scan several songs and
// assert at least one produces an overflowing chord line — the condition that
// drives `chordsOverflow` and the default-on nowrap. Desktop's wide viewport
// rarely overflows, so this assertion is mobile-only.
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

// Default-off branch: on the wide desktop viewport chord lines usually fit, so
// nowrap stays OFF on open — but the toggle is still rendered (just not pressed).
test('toggle is present and inactive when chord lines fit (no overflow)', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'wide viewport is where chord lines usually fit');

  const active = await openSongWithChords(page);
  expect(active, 'expected a song with chord lines').not.toBeNull();

  const overflows = await activeSongHasOverflowingChordLine(page);
  test.skip(overflows, 'opened song overflows even on desktop — not the no-overflow case');

  const toggle = active!.locator('.song-transpose__nowrap');
  await expect(toggle).toHaveCount(1); // always rendered
  await expect(toggle).not.toHaveClass(ACTIVE_CLASS); // not auto-enabled
  expect(await page.locator(NOWRAP_LINE).count()).toBe(0); // chord lines wrap
});

// Default-on branch: a song whose chord lines overflow the screen opens with
// nowrap already enabled (chord lines carry the modifier, toggle pressed).
test('chord nowrap is ON by default when chord lines overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'auto-apply on song open is exercised on the mobile project');
  test.setTimeout(60000); // includes first-compile of the dev server + auto-apply poll

  await openSongWithAutoNowrap(page); // narrow viewport → overflow → auto-on

  // overflow → default ON: chord lines carry the modifier and the toggle is pressed
  expect(await page.locator(NOWRAP_LINE).count()).toBeGreaterThan(0);
  await expect(page.locator(NOWRAP_TOGGLE).first()).toHaveClass(ACTIVE_CLASS);
});

// The toggle wiring is independent of overflow — clicking flips `chordNowrap`
// either way — so this runs against any song with chords (no need to find an
// overflowing one). State is read globally via the `_nowrap` modifier count.
test('nowrap toggle flips state on click', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'one project is enough for the toggle-wiring check');

  const active = await openSongWithChords(page);
  expect(active, 'expected a song with chord lines').not.toBeNull();

  const toggle = active!.locator('.song-transpose__nowrap');
  await expect(toggle).toHaveCount(1);
  const startedOn = (await page.locator(NOWRAP_LINE).count()) > 0;
  expect(await toggle.evaluate((n) => n.classList.contains('song-transpose__nowrap_active'))).toBe(startedOn);

  // Dispatch the click directly: on mobile a trusted pointer click can be
  // intercepted by the fixed top toolbar / bottom player overlay.
  // click → flips
  await toggle.dispatchEvent('click');
  if (startedOn) {
    await expect(page.locator(NOWRAP_LINE)).toHaveCount(0);
    await expect(toggle).not.toHaveClass(ACTIVE_CLASS);
  } else {
    await expect(page.locator(NOWRAP_LINE).first()).toBeAttached();
    await expect(toggle).toHaveClass(ACTIVE_CLASS);
  }

  // click again → flips back
  await toggle.dispatchEvent('click');
  if (startedOn) {
    await expect(page.locator(NOWRAP_LINE).first()).toBeAttached();
    await expect(toggle).toHaveClass(ACTIVE_CLASS);
  } else {
    await expect(page.locator(NOWRAP_LINE)).toHaveCount(0);
    await expect(toggle).not.toHaveClass(ACTIVE_CLASS);
  }
});

// Task 6: apply nowrap rendering. With nowrap ON the chord line gets the
// `_nowrap` modifier (white-space:nowrap + overflow-x:auto) so it becomes a
// single horizontally-scrollable line; OFF restores wrapping (modifier gone).
// Driven by the manual toggle, so it works on any song regardless of overflow.
test('nowrap on makes the chord line horizontally scrollable; off restores wrapping', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'one project is enough for the nowrap-rendering check');

  const active = await openSongWithChords(page);
  expect(active, 'expected a song with chord lines').not.toBeNull();
  const toggle = active!.locator('.song-transpose__nowrap');

  // ensure nowrap is ON (turn it on if this song didn't auto-enable it)
  if ((await page.locator(NOWRAP_LINE).count()) === 0) await toggle.dispatchEvent('click');
  await expect(page.locator(NOWRAP_LINE).first()).toBeAttached();

  // reads the on-screen chord lines' layout: whether they carry the nowrap
  // modifier, their computed white-space, and overflow-x. (Filter out the
  // scroller's visibility:hidden shrink-to-content measure copies.)
  const readChordLines = () => page.evaluate((s) => {
    const lines = (Array.from(document.querySelectorAll(s)) as HTMLElement[])
      .filter((l) => getComputedStyle(l).visibility !== 'hidden' && l.offsetParent !== null);
    return {
      count: lines.length,
      nowrap: lines.filter((l) => l.classList.contains('song-item__line_chords_nowrap')).length,
      whiteSpaces: Array.from(new Set(lines.map((l) => getComputedStyle(l).whiteSpace))),
      overflowXs: Array.from(new Set(lines.map((l) => getComputedStyle(l).overflowX))),
    };
  }, CHORD_LINE);

  // on: every on-screen chord line carries the modifier + horizontal scroll
  const on = await readChordLines();
  expect(on.nowrap).toBe(on.count);
  expect(on.whiteSpaces).toEqual(['nowrap']); // wrapping disabled — single line
  expect(on.overflowXs).toEqual(['auto']); // horizontally scrollable when content overflows

  // toggle off → modifier removed, wrapping restored
  await toggle.dispatchEvent('click');
  await expect(page.locator(NOWRAP_LINE)).toHaveCount(0);
  const off = await readChordLines();
  expect(off.nowrap).toBe(0);
  expect(off.whiteSpaces).not.toContain('nowrap');
});

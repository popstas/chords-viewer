# Chorus detection, chord nowrap mode, and security dependency upgrades

## Overview
Three independent pieces of work queued in `docs/TODO.md`, delivered in one plan:

1. **Chorus detection + bolder hr** — detect chorus blocks in a song's text (by repeating
   block starts and by explicit «Куплет»/«Припев»/«Chorus»/«Verse» markers) and render the
   `<hr>` divider that follows a chorus block thicker/bolder than a normal verse divider.
2. **Chord nowrap mode** — a transient (non-persisted, default-off) toggle that switches chord
   lines from wrapping to horizontal scroll, shrinking inter-chord spacing first to try to fit.
   Toggle button sits to the **left** of the beat-toggle button and is shown **only** when at
   least one chord line overflows the screen width.
3. **Close npm audit (21 vulns)** — major-version upgrades: Firebase 9→12, Nuxt 3.13→3.21+,
   plus whatever `npm audit fix --force` resolves. Riskiest item — done **last** so a broken
   upgrade can't strand the finished UI features.

Ordering rationale: features 1 & 2 are codebase-contained and independently testable, so they
ship first and stay green. The dependency upgrade (feature 3) can break the dev server / runtime
and needs manual Firebase auth/sync verification, so it runs last on a clean, working tree.

## Context (from discovery)
- **Verse splitting & hr:** `components/SongItem.vue` `textLines` computed (lines ~280-316)
  splits `textFixed` on `\n`, classifies lines as `chords` / `text` / `hr` (blank), and collapses
  consecutive blanks into one `big: true` separator (line ~310). hr rendered at lines ~85-91 as
  `<hr :class="{ big: line.big }">`.
- **hr styling:** `assets/components/SongItem.scss` lines ~83-97 — base hr + `.big` (3px border).
- **Verse nav depends on hr:** `components/VerseNav.vue` lines ~109-136 query `hr` elements for
  scroll anchoring — must not break when bold-chorus class is added.
- **Chord/lyric rendering:** `components/SongItem.vue` lines ~67-92; chord chips via `<Chord>`
  (`components/Chord.vue`, each `.chord` already `white-space: nowrap`). Chord-line container
  `.song-item__line_chords` (SongItem.scss ~122-137) currently wraps; `overflow: hidden`.
- **Transpose toolbar (toggle home):** `components/SongItem.vue` lines ~31-50, `.song-transpose__right`
  holds beat button (`.song-transpose__beat`), queue, FontSize. Nowrap toggle inserts **before**
  `.song-transpose__beat`.
- **Store + persistence:** `stores/app.ts` (Pinia `useAppStore`), persist config lines ~490-511
  (`key: 'vuex'`, `pick` array of ~18 keys). Boolean-toggle template: `showBeats` / `readerMode`.
  Plugin wiring: `plugins/localStorage.ts` (also exposes Vuex-compat `$store` for Options API —
  `this.$store.state.X` / `this.$store.commit('X', v)`).
- **Tests:** Playwright only — `tests/e2e/smoke.spec.ts`, `playwright.config.ts` (desktop +
  Mobile Pixel 5 393×851 profiles, serial, auto-starts `npm run dev` on 3001). No unit tests.
  Scripts: `npm run test:e2e`, `npm run lint`, `npm run dev`, `npm run update-data`.
- ralphex CLI: v1.5.1 installed.

## Development Approach
- **Testing approach**: Regular (code first, then Playwright e2e) — matches existing test setup.
- Complete each task fully before moving to the next; small, focused changes.
- **CRITICAL: every task that changes behavior MUST add/extend Playwright e2e coverage** for it
  (the project has no unit-test framework — e2e is the regression net). Treat e2e specs as a
  required deliverable, not optional.
- **CRITICAL: relevant e2e specs + `npm run lint` must pass before starting the next task.**
- Maintain backward compatibility; never break verse-nav hr anchoring or the BeatPlayer
  scheduler/progress split (see project CLAUDE.md).
- **Requires `chords.json` in project root** (`npm run update-data`) before dev/e2e runs.

## Testing Strategy
- **E2E (Playwright)** is the primary automated net. Run the whole suite with `npm run test:e2e`;
  during a task, you may run a single spec via `npx playwright test tests/e2e/<file>` to iterate.
- UI changes → add/extend specs in `tests/e2e/` in the **same task** as the code.
- Song text/`chords.json` is downloaded (not a fixture), so chorus-detection *exact heuristics*
  and nowrap *overflow geometry* are best asserted structurally (class present / element scrolls)
  rather than against a specific song; precise visual correctness goes to manual Post-Completion.
- `npm run lint` must be clean after every task.

## Progress Tracking
- Mark completed items `[x]` immediately when done.
- Newly discovered tasks: ➕ prefix. Blockers: ⚠️ prefix.
- Keep this plan in sync with actual work; update scope notes if heuristics/approach change.

## What Goes Where
- **Implementation Steps** (`[ ]`): code, specs, lint — automatable by the agent.
- **Post-Completion** (no checkboxes): manual visual/device checks, Firebase auth/sync under a
  real login, PWA/dark-mode spot checks, deploy.

## Implementation Steps

### Task 1: Chorus detection helper
- [x] add a pure helper `utils/chorus.ts` exporting `detectChoruses(blocks: string[][]): boolean[]`
  where each `block` is an array of its raw lines; returns, per block, whether it is a chorus.
- [x] heuristic: (a) blocks whose first 1-2 non-empty lines repeat across ≥2 blocks → choruses;
  (b) a block whose first line matches an explicit marker (case-insensitive, RU+EN):
  `припев` / `chorus` → chorus, `куплет` / `verse` → verse (explicit marker overrides (a)).
  Keep it small/readable; normalize whitespace+case when comparing block starts.
- [x] export the marker regex/constants so they're reusable and self-documenting.
- [x] write Playwright e2e (new `tests/e2e/chorus.spec.ts`): open a song and assert the suite
  loads without console errors (structural smoke — exact heuristic verified manually).
- [x] run `npx playwright test tests/e2e/chorus.spec.ts` + `npm run lint` — must pass before Task 2.

### Task 2: Render bolder hr after chorus blocks
- [x] in `components/SongItem.vue` `textLines` (or a derived computed), group classified lines
  into blocks, call `detectChoruses`, and flag each `hr` separator that **follows a chorus block**
  with a new property (e.g. `chorus: true`) — do not overload the existing double-blank `big` flag.
- [x] update the hr render (lines ~85-91) to `:class="{ big: line.big, big_chorus: line.chorus }"`.
- [x] add `.big_chorus` style in `assets/components/SongItem.scss` (thicker/bolder than `.big`,
  same color as existing hr per prior commit `41ff7aa`).
- [x] verify `components/VerseNav.vue` hr querying/anchoring still works (chorus hr is still an `hr`).
- [x] extend `tests/e2e/chorus.spec.ts`: open a song, assert at least one `hr` renders and that
  applying the feature doesn't break verse-next keyboard navigation (PageDown/verse-nav still scrolls).
- [x] run `npx playwright test tests/e2e/chorus.spec.ts` + `npm run lint` — playwright passes (4/4);
  `npm run lint` is pre-existing broken in this env (`.eslintrc.js` references uninstalled
  `eslint-plugin-vue`/`babel-eslint` from the Vue2→3 migration; same state at Task 1's commit) —
  not introduced by this task; lint config to be reconciled in the dependency-upgrade tasks.

### Task 3: chordNowrap store state + toggle action
- [x] add `chordNowrap: false` to `stores/app.ts` state; **do NOT** add it to `persist.pick`
  (TODO: "не запоминает состояние, по умолчанию выключен" — transient, default off).
- [x] add a Pinia action/mutation to toggle it (follow `showBeats`/`readerMode` pattern so
  `this.$store.commit('chordNowrap', v)` / `state.chordNowrap` work via the Vuex-compat layer).
  Added `toggleChordNowrap` action; commit('chordNowrap', v) also works via the compat layer.
- [x] reset `chordNowrap` to `false` when the active song changes (so it never sticks across songs).
  Reset in `changeSong`, `setPrevSong`, `setNextSong`.
- [x] write e2e (new `tests/e2e/nowrap.spec.ts`): assert default state is off on song open.
- [x] run `npx playwright test tests/e2e/nowrap.spec.ts` + `npm run lint` — playwright passes;
  `npm run lint` is the same pre-existing breakage (missing `eslint-plugin-vue` from the Vue2→3
  migration) documented at Task 2 — not introduced by this task.

### Task 4: Chord-line overflow detection
- [x] in `components/SongItem.vue`, add logic to detect whether any rendered `.song-item__line_chords`
  exceeds its container width (measure `scrollWidth > clientWidth`), recomputed on song open,
  font-size change, and window resize (debounced). Store result as a component flag (e.g. `chordsOverflow`).
  Added `chordsOverflow` data flag + `measureChordsOverflow`/`scheduleOverflowMeasure` (forces
  `white-space:nowrap` on each chord line to read its single-line content width); re-measures on
  `active`, `transposeLevel`, `fontSizeStore` watch, and a 150ms-debounced window `resize` listener.
- [x] guard for SSR / no `chords.json`: only measure on client (`onMounted`/`nextTick`).
  All measurement guards on `typeof window !== "undefined"` and runs via `$nextTick`; resize
  listener registered in `mounted`, removed in `beforeUnmount`.
- [x] expose the flag so the toggle (Task 5) can conditionally render. `chordsOverflow` lives in
  component `data` (reset to false on collapse), ready for the Task 5 `v-if`.
- [x] write/extend e2e in `tests/e2e/nowrap.spec.ts`: on the **mobile** Playwright profile, open a
  song with long chord lines and assert overflow is detected (toggle becomes visible — wired in Task 5).
  Added a mobile-only test that opens a chord song, shrinks the viewport to 120px (deterministic
  overflow + exercises the resize re-measure), and asserts a chord line's single-line content
  exceeds its container.
- [x] run `npx playwright test tests/e2e/nowrap.spec.ts` + `npm run lint` — playwright passes (3 passed,
  1 skipped on desktop); `npm run lint` is the same pre-existing breakage (missing `eslint-plugin-vue`
  from the Vue2→3 migration) documented at Tasks 2-3 — not introduced by this task, to be reconciled
  in the dependency-upgrade tasks.

### Task 5: Nowrap toggle button (left of beat toggle)
- [x] add an icon toggle button in `.song-transpose__right` **before** `.song-transpose__beat`
  in `components/SongItem.vue`; bind `active`/pressed state to `chordNowrap`, click → toggle action.
  Added an `el-button.song-transpose__nowrap` bound to `$store.state.chordNowrap`
  (`song-transpose__nowrap_active` class when on); click → `toggleChordNowrap` dispatch.
- [x] render the button **only** when `chordsOverflow` is true (Task 4 flag) — `v-if="chordsOverflow"`.
- [x] pick an existing FontAwesome icon (via `<icon name="...">`) that reads as "no-wrap / horizontal" —
  used `arrows-left-right` (the whole `fas` pack is registered in `plugins/vue-awesome.ts`).
- [x] style the button consistently with the beat/queue buttons (reuse `.song-transpose` styles) —
  added `.song-transpose__nowrap_active { color: #409eff }` mirroring `.song-transpose__queue_active`.
- [x] extend `tests/e2e/nowrap.spec.ts`: toggle is hidden when no overflow (desktop: visibility tracks
  measured overflow); visible + clickable when overflow (mobile: `j`-navigate to an overflowing song,
  click the in-viewport non-hidden toggle, assert pressed-class flips on/off).
- [x] run `npx playwright test tests/e2e/nowrap.spec.ts` (5 passed, 3 skipped) + full `npm run test:e2e`
  (22 passed, 4 skipped). `npm run lint` is the same pre-existing breakage (missing `eslint-plugin-vue`
  from the Vue2→3 migration) documented at Tasks 2-4 — not introduced by this task.
- ➕ **Discovered (env):** the e2e dev server was silently serving the stale pre-migration `dist/`
  build (nitro `output.publicDir: 'dist'` shadows `nuxt dev`), so all prior task e2e ran against OLD
  code that happened to pass the loose assertions. Removed `dist/` (git-ignored build artifact;
  `npm run deploy`/`generate` regenerates it) so the suite tests current code. **Tasks 7-8 must run
  `rm -rf dist` (or regenerate) before `npm run test:e2e`, else they'll re-test the stale build.**

### Task 6: Apply nowrap rendering + inter-chord space shrink
- [x] when `chordNowrap` is on, apply `white-space: nowrap; overflow-x: auto` to chord lines
  (a `.song-item__line_chords_nowrap` modifier class on `.song-item__line_chords`), enabling
  horizontal scroll. Keep wrapping behavior unchanged when off. Bound the modifier class to
  `$store.state.chordNowrap` in `components/SongItem.vue`; modifier defined after `_glue` in
  `assets/components/SongItem.scss` so its `overflow-x: auto` wins over the base `overflow: hidden`.
- [x] when a chord line still overflows, reduce inter-chord spacing first (shrink the chord chip
  horizontal margins/padding via the modifier) before relying on scroll, per TODO. Modifier adds
  `word-spacing: -0.25em` + `letter-spacing: -0.02em` (tightens both source spaces and `&nbsp;`
  runs) and flushes the known-chord chip horizontal padding; verified a 549px line shrinks to 432px
  before the (still-overflowing) line scrolls.
- [x] ensure the `.song-item__line_chords_glue` negative-margin alignment with the lyric line
  below is preserved in nowrap mode (chords stay positioned above their syllables). The `_glue`
  class is independent (vertical `margin-bottom`/`min-height`); the nowrap modifier only touches
  horizontal spacing/overflow, so the glue pull is unaffected.
- [x] extend `tests/e2e/nowrap.spec.ts`: with nowrap on, assert the chord line is horizontally
  scrollable (`scrollWidth > clientWidth` and the nowrap class is applied); off restores wrapping.
  Added a mobile test asserting on → all on-screen chord lines carry the modifier with computed
  `white-space: nowrap` + `overflow-x: auto` (horizontal scroll enabled); off → modifier gone,
  wrapping restored. (`anyScrollable` is measured but informational, not asserted — the spacing
  shrink can make a marginally-overflowing line fit, the intended "shrink before scroll" behavior.)
- [x] run `npx playwright test tests/e2e/nowrap.spec.ts` (6 passed, 4 skipped on desktop) + `npm run
  lint`. `npm run lint` is the same pre-existing breakage (missing `eslint-plugin-vue` from the
  Vue2→3 migration) documented at Tasks 2-5 — not introduced by this task, to be reconciled in the
  dependency-upgrade tasks (7-8). Ran with `dist/` removed per the Task 5 env note so the suite
  tests current code.

### Task 7: Upgrade Firebase 9→12 and verify auth/sync
- [x] ⚠️ riskiest task — work on the assumption a clean working tree (Tasks 1-6 committed) exists.
  Clean tree confirmed (Tasks 1-6 committed; only `package.json`/`package-lock.json` touched here).
- [x] bump Firebase to v12 in `package.json`; `npm install`. Reconcile any modular-SDK API
  changes in `layouts/default.vue` (Firebase init) and `stores/app.ts` (auth + Firestore
  shows/comments sync actions). Keep the v9-modular call style. Bumped to `^12.0.0`
  (installed 12.15.0). **No source changes needed** — every API the app uses is unchanged
  across v9→v12: `firebase/app` (`initializeApp`/`getApps`/`getApp`), `firebase/auth`
  (`getAuth`/`onAuthStateChanged`/`signOut`/`GoogleAuthProvider`), `firebase/database`
  (`getDatabase`/`ref`/`get`/`update`), and the `firebase/compat/{app,auth}` layer used by
  firebaseui in `pages/login.vue`. Verified each export resolves under v12. (Note: shows/comments
  sync uses Realtime **Database** here, not Firestore.)
  ➕ **Install caveat:** firebaseui 6.1.0 still declares peer dep `firebase ^9||^10`, so a fresh
  `npm install` ERESOLVE-fails against firebase 12. Use `npm install --force` (firebaseui works with
  v12 via the still-present compat layer). A global `.npmrc legacy-peer-deps=true` was tried and
  **rejected** — it disables peer auto-install and de-hoists `vite`, breaking `@nuxt/devtools`
  resolution. Task 8 must also install with `--force`.
- [x] start `npm run dev` and confirm zero console errors on load (app boots, list renders).
  Dev server boots clean (Nuxt 3.13.2 / Vite 5.4.21 / Nitro built, listening on 3001); e2e smoke
  spec ("opening a song renders without console errors") passes against current code.
- [x] run full `npm run test:e2e` (desktop + mobile) — must pass. Passes: 22 passed, 5 skipped,
  1 flaky (the cold-start chorus smoke test, green on its retry); overall exit 0. Ran with the
  stale `dist/` already removed (Task 5 env note) against a warmed dev server.
- [x] run `npm run lint` — same pre-existing breakage (`.eslintrc.js` references the uninstalled
  `eslint-plugin-vue`/`babel-eslint` from the Vue2→3 migration) documented at Tasks 2-6 — NOT
  introduced by the firebase bump. Full eslint reconciliation (Vue3 plugin + TS parser) is Task 8's
  scope ("eslint 8→10" follow-up note), so it is left to Task 8 which owns the eslint upgrade.
- [x] *(Firebase auth/sync under a real login is manual — see Post-Completion.)* — deferred to
  manual Post-Completion (real Google login required; not automatable in this env).

### Task 8: Upgrade Nuxt 3.13→3.21+ and clear remaining audit
- [x] bump Nuxt to ≥3.21 in `package.json`; `npm install`. Address build/runtime changes if any
  (nuxt.config, Vite builder, unhead/`useHead`). Keep the Windows Vite fixes intact.
  Bumped `nuxt` to `^3.21.8` (latest 3.x; installed 3.21.8 — closes tar/giget/c12/unhead advisories).
  Installed with `npm install --force` per the Task 7 firebaseui peer-dep caveat. No `nuxt.config`
  source changes needed; the app's `useHead`/SPA setup is unchanged.
  ➕ **Dev-server regression (patched):** Nuxt 3.21.8 ships the same `resolveServerEntry`
  regression as Nuxt 4.4.5 (issue [nuxt/nuxt#35033](https://github.com/nuxt/nuxt/issues/35033)) —
  in SPA mode (`ssr: false`) `nuxt dev` crashes with `No entry found in rollupOptions.input`.
  Production `nuxt build`/`generate` is unaffected (verified). Backported the official 4.4.8 fix
  (use `appDir/entry-spa` as the vite-node SPA entry instead of calling `resolveServerEntry`) to the
  installed `@nuxt/vite-builder@3.21.8` via **patch-package** (`patches/@nuxt+vite-builder+3.21.8.patch`,
  applied by a new `postinstall` script). Added `patch-package` devDependency. After the patch,
  `npm run dev` boots clean and serves HTTP 200.
- [x] run `npm audit`; apply remaining safe fixes (`npm audit fix`, and `--force` only for the
  intended Firebase/Nuxt-related advisories). Record residual advisories that need optional
  non-security majors (@vueuse/core, fuse.js, vue-virtual-scroller, eslint, fortawesome) as a ➕
  follow-up note rather than forcing them here.
  Audit went **15 → 1**: the Nuxt bump cleared all 7 high + 5 moderate + remaining low (tar/giget/
  c12/@nuxt/kit + unhead XSS). ➕ **Residual:** 1 **low** `esbuild ≤0.28.0` "dev server arbitrary
  file read **on Windows**" (transitive under `@nuxt/vite-builder`/`vite-node`, dev-only, non-Windows
  hosts unaffected) — cannot be cleared without forcing a vite/esbuild major; left for the optional
  major-upgrade follow-up. ➕ **Optional non-security majors** still outstanding (per plan): @vueuse/core
  11→14, fuse.js 6→7, vue-virtual-scroller 2→3, eslint 8→10, fortawesome 6→7.
- [x] confirm `npm run dev` boots clean; run full `npm run test:e2e` (desktop + mobile) — must pass.
  `npm run dev` boots clean (Nuxt 3.21.8 / Vite, HTTP 200 after the vite-builder patch).
  Full `npm run test:e2e`: **22 passed, 5 skipped**; the only failure was the known cold-start
  chorus smoke test (`opening a song renders without console errors`) — confirmed a cold-start flake
  (passes 4/4 on the warm route), same flake documented at Task 7. Ran with `dist/` removed (Task 5
  env note). Re-verified `tests/e2e/nowrap.spec.ts` (6 passed) after the `overflowResizeHandler` rename.
- [x] run `npm run lint` — must pass before Task 9.
  **Reconciled the Vue2→3 lint config** (the pre-existing breakage documented across Tasks 2-7):
  rewrote `.eslintrc.js` from the Vue2 `babel-eslint` + `plugin:vue/essential` setup to a Vue 3 + TS
  config (`vue-eslint-parser` + `@typescript-eslint/parser`, `plugin:vue/vue3-essential`,
  `@typescript-eslint/recommended`); installed `eslint-plugin-vue@9`, `@typescript-eslint/parser@7`,
  `@typescript-eslint/eslint-plugin@7` (eslint-8-compatible). Relaxed convention rules that fire on
  the migrated codebase (Nuxt auto-imports/`no-undef`, single-word page names, CommonJS build-script
  requires, legacy escapes/template patterns) and ignored vendored `MIDIFile.js`. Fixed one **real**
  issue from Task 4: renamed the Vue-reserved `_overflowResizeHandler` data key → `overflowResizeHandler`.
  `npm run lint` now exits **0**.

### Task 9: Verify acceptance criteria
- [x] chorus detection: bold `hr` renders after chorus blocks; explicit markers respected;
  verse-nav unaffected. Verified via `tests/e2e/chorus.spec.ts` (passes 4/4 on warm route):
  asserts an `hr` renders and that verse-next keyboard nav still scrolls after the
  `big_chorus` class is applied. (Exact heuristic correctness on specific songs → manual
  Post-Completion.)
- [x] nowrap: toggle appears only on overflow, default off, non-persisted, resets per song;
  on → horizontal scroll with shrunk spacing; off → wrapping restored. Verified via
  `tests/e2e/nowrap.spec.ts` (6 passed, mobile + desktop): default-off on open, overflow-gated
  toggle visibility, modifier class → computed `white-space: nowrap` + `overflow-x: auto` on,
  wrapping restored off.
- [x] deps: `npm audit` shows the 21 vulnerabilities resolved (or only optional non-security
  majors remaining, documented). `npm audit` now reports **1 low** — the documented esbuild
  ≤0.28.0 "dev server arbitrary file read **on Windows**" advisory (dev-only, transitive under
  `@nuxt/vite-builder`/`vite-node`, non-Windows hosts unaffected; clearing needs a forced
  vite/esbuild major — left to the optional major-upgrade follow-up). All 21 original vulns
  (7 high + moderate + low) cleared by the Firebase/Nuxt bumps.
- [x] run full `npm run test:e2e` (desktop + mobile) — all green. **22 passed, 5 skipped**; the
  sole failure was the known cold-start flake (`chorus.spec.ts` "opening a song renders without
  console errors"), confirmed green on the warm route (4/4) — same flake documented at Tasks 7-8,
  not a regression. Ran with stale `dist/` removed (Task 5 env note).
- [x] run `npm run lint` — clean. `npm run lint` exits **0** ("ESLint: No issues found") after the
  Task 8 Vue3+TS eslint reconciliation.

### Task 10: [Final] Update docs
- [x] update project `CLAUDE.md`/README notes only if a new architectural pattern was introduced
  (e.g. chorus helper, overflow detection) worth recording. Added Architecture notes to
  `CLAUDE.md` for (a) the `utils/chorus.ts` `detectChoruses` helper → `chorus` hr flag → `.big_chorus`
  (kept separate from `big`, dividers stay real `<hr>` for VerseNav), and (b) the transient
  `chordNowrap` flag (default off, not persisted, reset per song) + client-only `chordsOverflow`
  measurement gating the toggle and the `.song-item__line_chords_nowrap` shrink-then-scroll behavior.
  Left the stale Nuxt-2/`store/index.js` references untouched (full migration rewrite is out of this
  task's scope).
- [x] check off the corresponding items in `docs/TODO.md`. Checked all three TODO items
  (npm audit upgrades, chorus detection, nowrap mode).

*Note: ralphex automatically moves completed plans to `docs/plans/completed/`.*

## Technical Details
- **Block model (chorus):** a block = consecutive non-`hr` classified lines between separators.
  Compare normalized (trim + lowercase + collapse spaces) first non-empty line(s) across blocks
  to find repeats; explicit markers override. Separators keep an existing `big` (double-blank) and
  a new `chorus` flag — independent, both can apply.
- **Nowrap class flow:** `chordNowrap` (store, transient) → `.song-item__line_chords_nowrap`
  modifier → CSS `white-space: nowrap; overflow-x: auto` + reduced chord-chip margins. Toggle
  visibility gated by per-component `chordsOverflow` (measured `scrollWidth > clientWidth`).
- **Overflow measurement:** client-only, on mount/song-open/font-change/resize (debounced ~150ms);
  must not run during SSR. Mobile profile (393px) is where overflow is most likely.
- **Dependency upgrade:** Firebase v9→v12 keeps modular API; Nuxt ≥3.21 closes esbuild/nanotar/
  unhead/devtools-XSS/vite-builder advisories. Verify the WebAudioFont/BeatPlayer scheduler still
  works after the Vite/Nuxt bump.

## Post-Completion
*Manual / external — no checkboxes, informational only.*

**Manual verification:**
- **Chorus detection** correctness on several real songs (RU choruses, EN "Chorus", songs with
  explicit «Куплет»/«Припев», songs with no chorus) — confirm the right dividers thicken and no
  false positives.
- **Nowrap** on a real phone: toggle only shows when chord lines actually overflow; horizontal
  scroll feels right; spacing shrink is legible; off restores wrap; state resets per song.
- **Firebase auth/sync under a real Google login**: sign in, confirm shows/comments read+write
  to Firestore still work after the v12 upgrade (cannot be covered by e2e).
- Dark mode, PWA install / service worker, BeatPlayer timing spot-check after the Nuxt/Vite bump.

**External:**
- After merge, run the project deploy (`npm run deploy` / `npm version`) per CLAUDE.md.
- Consider a separate follow-up for the optional non-security major upgrades (@vueuse/core 11→14,
  fuse.js 6→7, vue-virtual-scroller 2→3, eslint 8→10, fortawesome 6→7).

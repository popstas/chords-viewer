# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Nuxt 2 SPA/PWA for viewing guitar chords (chords.popstas.ru). Static site, no server side: hosted on GitHub Pages, auth and per-user view stats via Google Firebase. UI is Element UI + Vue 2.

## Commands

- `npm install` — install dependencies (yarn also works)
- `npm run update-data` — download `chords.json` into project root (required before build/dev)
- `npm run dev` — dev server at http://localhost:3001 (HOST=0.0.0.0)
- `npm run generate` — static build to `dist/` (needs `NODE_OPTIONS=--openssl-legacy-provider`)
- `npm run deploy` — full deploy: update-data, build-beats, generate, force-push `dist/` to `gh-pages` branch (bash script, [scripts/deploy.sh](scripts/deploy.sh))
- `npm run build-beats` — rebuild `assets/beats.json` from MIDI files
- `npm run lint` — ESLint over .js/.vue
- `npm version` — release: changelog, GitHub release, deploy

No tests in this project.

## Architecture

- `store/index.js` — the core: all app state (active song, filters, transpose, settings persisted to localStorage, Firebase sync of shows/comments), song filtering logic, chord transpose maps (`chordNotesMap` is exported and imported by components).
- `pages/index.vue` — single main page; mounts `SongList`, `Toolbar`, floating panels.
- Song flow: `SongList` (virtual scroller) → `SongItem` (text, chords, transpose, embeds `BeatPlayer`) → `Chord` (fingering image on hover).
- Floating fixed panels: `ChordsFloating` (chords pinned at top while scrolling), `PlayerFloating` (bottom toolbar with prev/play/next, autoscroll, instrument), `Toolbar` (search/filters).
- `BeatPlayer.vue` — beat/accompaniment engine: plays drum MIDI loops from `assets/beats.json` and piano accompaniment generated from song chords via WebAudioFont. Audio is driven by a **look-ahead scheduler on the Web Audio clock** (`startScheduler`/`scheduler`/`advanceSong`: a `setTimeout` wakes every `schedulerIntervalMs` ≈ 25 ms and queues notes `scheduleAheadTime` ahead with absolute `when` from `AudioContext.currentTime`), NOT by `requestAnimationFrame` — this keeps timing stable under UI jank. A flat, `when`-sorted `schedule` array plus a `noteIndex` pointer (`buildSchedule`/`ensureSchedule`/`queueWindow`) avoids per-step O(n) note scanning. **UI progress is intentionally decoupled** into a separate RAF (`startProgressRaf`/`computeBeatProgress`/`updateProgress`), which commits `beatProgress`/`beatPlaying` to the store so rendering never perturbs audio timing; other components (e.g. `ChordsFloating` mobile metronome) read those. Live changes are applied on a 4-bar cycle boundary (`beatCycleDuration`) instead of restarting: instrument via `pianoInstrumentActive`/`pendingInstrument` (`scheduleInstrumentChange`/`applyPendingInstrument`), style/`chordBeats` via `pendingPianoRebuild` (`rebuildPiano`/`applyPendingPianoRebuild`). When changing this file, do not collapse the scheduler/progress split or read progress from `this.beatProgress` in the scheduler — both are deliberate (a backgrounded RAF must not stall audio).
- Mobile vs desktop is decided by `screen.width <= 600` checks and CSS `@media (max-width: 600px)`; mobile has different autoscroll handling and panels.
- `utils/chorus.ts` — pure helper `detectChoruses(blocks)` (plus exported marker regex/constants) that flags which text blocks are choruses, by repeating block starts and explicit «Куплет»/«Припев»/`Chorus`/`Verse` markers. `SongItem.vue` `textLines` groups classified lines into blocks, calls it, and sets a `chorus` flag on the `hr` that *follows* a chorus block → rendered as `.big_chorus` (independent of the double-blank `.big` flag). Keep the chorus flag separate from `big`, and keep chorus dividers as real `<hr>` elements so `VerseNav.vue` anchoring still works.
- **Chord nowrap mode** — `chordNowrap` is a *transient* store flag (default off, **not** in `persist.pick`, reset on song change) toggled from a button left of the beat toggle in `SongItem.vue`. The button only renders when a chord line overflows: `SongItem.vue` measures `scrollWidth > clientWidth` client-only (mount / song-open / font-change / debounced resize) into a `chordsOverflow` flag — never measure during SSR. On → `.song-item__line_chords_nowrap` shrinks inter-chord spacing first, then enables `overflow-x: auto` horizontal scroll.

## Notes

- `chords.json` in project root is required and git-ignored; build fails without it.
- Песни и интерфейс на русском; commit messages follow conventional commits (`fix:`, `feat:`, `refactor:`).
- Dev server port 3001; deployment is a local script, no CI.

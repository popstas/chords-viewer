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
- `BeatPlayer.vue` — metronome/beat engine: plays drum MIDI loops from `assets/beats.json` and piano accompaniment generated from song chords via WebAudioFont. Beat progress is committed to store (`beatProgress`, `beatPlaying`) so other components (e.g. `ChordsFloating` mobile metronome) can display it.
- Mobile vs desktop is decided by `screen.width <= 600` checks and CSS `@media (max-width: 600px)`; mobile has different autoscroll handling and panels.

## Notes

- `chords.json` in project root is required and git-ignored; build fails without it.
- Песни и интерфейс на русском; commit messages follow conventional commits (`fix:`, `feat:`, `refactor:`).
- Dev server port 3001; deployment is a local script, no CI.

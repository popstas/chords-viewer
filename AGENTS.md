# Overview
This project is a Nuxt 2 based PWA for viewing guitar chords.
It expects a `chords.json` file in the project root and uses Firebase for authentication and statistics.

## Directory Layout
- `assets/` – static assets such as beats and instrument files.
- `components/` – Vue components like song list, chord viewer and toolbar.
- `layouts/` – Nuxt layout templates.
- `pages/` – application pages (`index`, `login`, `profile`).
- `plugins/` – plugins loaded by Nuxt (Element UI, QR code, Yandex Metrika, etc.).
- `store/` – Vuex store managing app state, chords filtering and Firebase interaction.
- `scripts/` – node/ shell scripts for building beats and deployment.
- `static/` – files served as-is (favicon, PWA icons, etc.).

## Getting Started
1. Install dependencies with `npm install`.
2. Download chord data: `npm run update-data`.
3. Start development server: `npm run dev` (default port 3001).

See `CONTRIBUTING.md` for full build instructions.

## Helpful Files to Explore
- `store/index.js` – main application logic (filtering songs, storing settings).
- `nuxt.config.js` – Nuxt configuration (plugins, PWA settings).
- `README.md` – features list and overview.
- `scripts/` – automation scripts for beats and deployment.


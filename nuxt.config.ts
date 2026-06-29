import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@vite-pwa/nuxt',
  ],

  devtools: { enabled: true },

  // static assets (icons, CNAME, ...) live in static/ (Nuxt 2 convention),
  // Nuxt 3 defaults to public/ — point it back so they are served
  dir: { public: 'static' },

  css: [
    'element-plus/dist/index.css',
    'vue-virtual-scroller/dist/vue-virtual-scroller.css',
  ],

  plugins: [
    '@/plugins/element-plus',
    '@/plugins/vue-awesome',
    '@/plugins/vue-qr-generator',
    '@/plugins/vue-qrcode-reader',
    '@/plugins/vue-virtual-scroller',
    '@/plugins/yametrika',
    '~/plugins/localStorage',
    '~/plugins/shortkey',
  ],

  app: {
    head: {
      title: 'chords-viewer',
      meta: [
        { charset: 'utf-8' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      script: [
        {
          // SPA (ssr:false): index.html ships no resolved theme, so the PWA
          // titlebar would flash the manifest color, then jump to the real
          // theme once Vue mounts. Read the persisted darkMode (Pinia key
          // 'vuex') synchronously here and create the theme-color meta before
          // first paint. This script is the SOLE creator of the tag; the layout
          // keeps the same element in sync on toggle (see applyThemeColor), so
          // theme-color is managed manually, NOT via unhead, to avoid a second
          // tag and unhead's head-ordering quirks.
          tagPosition: 'head',
          children: [
            ';(function () {',
            '  try {',
            "    var dark; var raw = window.localStorage.getItem('vuex');",
            '    if (raw) { var s = JSON.parse(raw);',
            "      if (s && typeof s.darkMode === 'boolean') dark = s.darkMode; }",
            "    if (typeof dark !== 'boolean') {",
            "      dark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); }",
            "    var color = dark ? '#222933' : '#ffffff';",
            "    var meta = document.querySelector('meta[name=\"theme-color\"]');",
            '    if (!meta) {',
            "      meta = document.createElement('meta');",
            "      meta.setAttribute('name', 'theme-color');",
            '      document.head.appendChild(meta); }',
            "    meta.setAttribute('content', color);",
            '  } catch (e) {}',
            '})();',
          ].join('\n'),
        },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    manifest: {
      name: 'chords-viewer',
      short_name: 'Аккорды',
      description: 'Offline chords app',
      lang: 'ru',
      start_url: '/?standalone=true',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
      // app ships large vendor chunks (webaudiofont/firebase); precache them
      // so the app works fully offline
      maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
    },
    client: { installPrompt: true },
    // Dev SW is disabled: @vite-pwa/nuxt intermittently fails to generate
    // .nuxt/dev-sw-dist/sw.js, throwing an ENOENT overlay that blocks the page.
    // The production SW is still built by `npm run generate`.
    devOptions: { enabled: false, type: 'module', suppressWarnings: true },
  },

  nitro: {
    preset: 'static',
    // keep the generated site in dist/ so scripts/deploy.sh (cd dist) keeps working
    output: {
      publicDir: 'dist',
    },
  },

  compatibilityDate: '2025-09-13',

  typescript: {
    strict: false,
  },
});

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
    // lets us verify the manifest/SW in `npm run dev` without a full generate
    devOptions: { enabled: true, type: 'module', suppressWarnings: true },
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

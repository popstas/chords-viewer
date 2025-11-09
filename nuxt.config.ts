import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,

  modules: [],

  devtools: { enabled: true },

  css: [
    'vue-virtual-scroller/dist/vue-virtual-scroller.css',
  ],

  plugins: [
    '@/plugins/vue-awesome',
    '@/plugins/vue-qr-generator',
    '@/plugins/vue-qrcode-reader',
    // '@/plugins/vue-shortkey', // temporarily disabled (Vue 2 only). TODO: migrate to vue-shortkey3 or alternative
    '@/plugins/vue-virtual-scroller',
    '@/plugins/yametrika',
    '~/plugins/localStorage',
    '@/plugins/vuex-bridge.client',
  ],

  app: {
    head: {
      title: 'chords-viewer',
      meta: [
        { charset: 'utf-8' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Minimal Vite workaround for Windows virtual module paths
  vite: {
    plugins: [
      {
        name: 'windows-virtual-module-guard',
        enforce: 'pre',
        configResolved(resolved) {
          const plugins = (resolved as any).plugins || [];
          for (const p of plugins) {
            if (p && p.name === 'nuxt:components:imports') {
              const origInclude = p.transformInclude?.bind(p);
              p.transformInclude = (id: string) => {
                if (!id) return origInclude ? origInclude(id as any) : true;
                const s = String(id);
                // Skip Vite virtual module ids and Vue export helper on Windows
                if (
                  s.startsWith('\u0000') ||
                  s.startsWith('\0') ||
                  s.includes('plugin-vue:export-helper') ||
                  s.includes('vite/modulepreload-polyfill')
                ) {
                  return false;
                }
                return origInclude ? origInclude(id) : true;
              };
            }
          }
        }
      }
    ],
    build: {
      // Avoid injecting the modulepreload polyfill (appears as a Vite virtual module)
      modulePreload: { polyfill: false }
    }
  },
  nitro: {
    preset: 'static',
    compatibilityDate: '2025-09-13'
  },

  typescript: {
    strict: true
  },
}); 
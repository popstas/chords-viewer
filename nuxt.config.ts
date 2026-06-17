import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@vite-pwa/nuxt',
  ],

  devtools: { enabled: true },

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
    manifest: {
      name: 'chords-viewer',
      short_name: 'Аккорды',
      theme_color: '#333333',
    },
  },

  // Minimal Vite workaround for Windows virtual module paths (ported from v5)
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
                  s.charCodeAt(0) === 0 ||
                  s.includes('plugin-vue:export-helper') ||
                  s.includes('vite/modulepreload-polyfill')
                ) {
                  return false;
                }
                return origInclude ? origInclude(id) : true;
              };
            }
          }
        },
      },
    ],
    build: {
      // Avoid injecting the modulepreload polyfill (appears as a Vite virtual module)
      modulePreload: { polyfill: false },
    },
  },

  nitro: {
    preset: 'static',
    compatibilityDate: '2025-09-13',
  },

  typescript: {
    strict: false,
  },
});

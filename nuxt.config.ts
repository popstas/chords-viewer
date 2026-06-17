import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,

  modules: [],

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

  nitro: {
    preset: 'static',
  },

  compatibilityDate: '2025-09-13',

  typescript: {
    strict: false,
  },
});

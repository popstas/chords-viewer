import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,

  modules: [],

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

  nitro: {
    preset: 'static'
  },

  typescript: {
    strict: true
  },
}); 
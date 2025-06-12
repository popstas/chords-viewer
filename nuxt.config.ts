import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,
  // target: 'static', // Nuxt 3 uses nitro, static is default for ssr: false

  modules: [
    // '@nuxtjs/axios',
    // '@nuxtjs/pwa', // Nuxt 3 PWA module is not yet stable, see https://pwa.nuxtjs.org/
  ],

  css: [
    'element-plus/dist/index.css', // element-plus for Vue 3
    'vue-virtual-scroller/dist/vue-virtual-scroller.css',
  ],

  plugins: [
    '@/plugins/element-plus', // update plugin for element-plus
    '@/plugins/vue-awesome',
    '@/plugins/vue-qr-generator',
    '@/plugins/vue-qrcode-reader',
    '@/plugins/vue-shortkey',
    '@/plugins/vue-virtual-scroller',
    '@/plugins/yametrika',
    '~/plugins/localStorage',
  ],

  app: {
    head: {
      title: 'chords-viewer',
      meta: [
        { charset: 'utf-8' },
        // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // { name: 'description', content: 'View chords generated with popstas/chords-parser' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // PWA config needs to be migrated to Nuxt 3 PWA module if needed
  // pwa: {
  //   meta: {
  //     nativeUI: true,
  //   },
  //   manifest: {
  //     short_name: 'Аккорды',
  //   }
  // },

  // loading: { color: '#333333' }, // Use a custom loading component in Nuxt 3 if needed

  build: {
    // transpile: [/^vue-awesome/],
  },

  // Build extend and eslint-loader are not needed in Nuxt 3
}); 
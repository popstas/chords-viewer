module.exports = {
  ssr: false,
  target: 'static',
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],

  css: [
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/display.css'
  ],

  plugins: [
    { src: '@/plugins/element-ui', ssr: false },
    { src: '@/plugins/vue-awesome', ssr: false },
    { src: '@/plugins/vue-qr-generator', ssr: false },
    { src: '@/plugins/vue-qrcode-reader', ssr: false },
    { src: '@/plugins/vue-shortkey', ssr: false },
    { src: '@/plugins/yametrika', ssr: false },
    { src: '~/plugins/localStorage.js', ssr: false }
  ],

  /*
  ** Headers of the page
  */
  head: {
    title: 'chords-viewer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'View chords generated with popstas/chords-parser' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^vue-awesome/],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

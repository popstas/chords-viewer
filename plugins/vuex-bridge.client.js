import { defineNuxtPlugin } from 'nuxt/app'
import { createStore } from 'vuex'
import * as legacy from '~/store/index.js'

export default defineNuxtPlugin((nuxtApp) => {
  const store = createStore({
    state: legacy.state(),
    getters: legacy.getters,
    mutations: legacy.mutations,
    actions: legacy.actions,
    strict: legacy.strict,
  })
  nuxtApp.vueApp.use(store)
  nuxtApp.vueApp.config.globalProperties.$store = store
}) 
import { defineNuxtPlugin } from 'nuxt/app';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useAppStore } from '~/stores/app';

// Bootstraps Pinia (+ localStorage persistence) and exposes a thin Vuex-style
// `$store` accessor over the real Pinia store, so existing Options-API
// components keep working while state management is genuinely Pinia.
export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  nuxtApp.vueApp.use(pinia);

  const store = useAppStore(pinia);

  // commit names that don't map 1:1 to a state field
  const commitFieldMap: Record<string, string> = {
    setToolbarHidden: 'toolbarHidden',
    setFilteredSongs: 'filteredSongs',
    setShows: 'shows',
    setComments: 'comments',
    setUser: 'user',
  };

  const compat = {
    get state() {
      return store;
    },
    get getters() {
      return store;
    },
    commit(name: string, payload?: any) {
      const field = commitFieldMap[name] || name;
      (store as any)[field] = payload;
    },
    dispatch(name: string, ...args: any[]) {
      const action = (store as any)[name];
      if (typeof action === 'function') return action(...args);
      console.warn('[\$store.dispatch] unknown action:', name);
    },
  };

  nuxtApp.vueApp.config.globalProperties.$store = compat;
});

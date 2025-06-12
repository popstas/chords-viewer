import { defineNuxtPlugin } from 'nuxt/app';
import shortkey from 'vue-shortkey';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(shortkey);
}); 
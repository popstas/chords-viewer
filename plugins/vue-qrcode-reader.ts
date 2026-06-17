import { defineNuxtPlugin } from 'nuxt/app';
import { VueQrcodeReader } from 'vue-qrcode-reader';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueQrcodeReader);
});

import { defineNuxtPlugin } from 'nuxt/app';
import QrcodeVue from 'qrcode.vue';

export default defineNuxtPlugin((nuxtApp) => {
  // legacy template tag name kept so existing usages keep working
  nuxtApp.vueApp.component('qr-code', QrcodeVue);
  nuxtApp.vueApp.component('QrcodeVue', QrcodeVue);
});

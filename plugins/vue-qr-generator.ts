import { defineNuxtPlugin } from 'nuxt/app';
import { defineComponent, h } from 'vue';
import QrcodeVue from 'qrcode.vue';

// Legacy <qr-code :text="..." :size="..."> alias -> qrcode.vue (which uses `value`).
const QrCodeAlias = defineComponent({
  name: 'QrCodeAlias',
  props: {
    text: { type: String, default: '' },
    size: { type: [String, Number], default: 100 },
  },
  setup(props, { attrs }) {
    return () => h(QrcodeVue as any, { value: props.text, size: Number(props.size), ...attrs });
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('qr-code', QrCodeAlias);
  nuxtApp.vueApp.component('QrcodeVue', QrcodeVue);
});

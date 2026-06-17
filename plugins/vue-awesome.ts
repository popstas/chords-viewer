import { defineNuxtPlugin } from 'nuxt/app'
import { defineComponent, h } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library, findIconDefinition, IconName, IconPrefix, IconLookup, IconDefinition } from '@fortawesome/fontawesome-svg-core'

// solid icons used across the app
import {
  faUser,
  faCoffee,
  faQrcode,
  faChevronUp,
  faChevronDown,
  faBackward,
  faForward,
  faPause,
  faPlay,
  faDrum,
  faKeyboard,
  faLink,
  faShareNodes,
  faPenToSquare,
  faMicrophone,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons'

// import entire icon packs as a fallback to avoid missing icons
import { fas } from '@fortawesome/free-solid-svg-icons'
// brands
import { faGithub, fab } from '@fortawesome/free-brands-svg-icons'

library.add(
  // packs first so individual adds don't matter if omitted elsewhere
  fas,
  fab,
  faUser,
  faCoffee,
  faGithub,
  faCalendarDays,
  faQrcode,
  faChevronUp,
  faChevronDown,
  faBackward,
  faForward,
  faPause,
  faPlay,
  faDrum,
  faKeyboard,
  faLink,
  faShareNodes,
  faPenToSquare,
  faMicrophone
)

// Safety wrapper to avoid runtime crashes if an undefined icon slips through
const SafeFontAwesomeIcon = defineComponent({
  name: 'SafeFontAwesomeIcon',
  // reuse original component props definition for full compatibility
  props: (FontAwesomeIcon as any).props,
  setup(props, { attrs, slots }) {
    return () => {
      const safeProps = (props as any) || {};
      const inputIcon = (safeProps as any).icon ?? (attrs as any)?.icon;

      // Basic guard: no icon prop at all
      if (!inputIcon) {
        if (process.client) console.warn('[font-awesome-icon] missing icon prop', attrs);
        return null;
      }

      // Resolve/verify the icon exists in library to avoid runtime crash inside FA
      try {
        let lookup: IconLookup | undefined;
        if (Array.isArray(inputIcon)) {
          const [prefix, iconName] = inputIcon as [IconPrefix, IconName];
          lookup = { prefix, iconName };
        } else if (typeof inputIcon === 'string') {
          // default to solid if only name was provided
          lookup = { prefix: 'fas', iconName: inputIcon as IconName };
        } else if (typeof inputIcon === 'object' && 'iconName' in inputIcon && 'prefix' in inputIcon) {
          lookup = inputIcon as IconLookup;
        }

        if (lookup) {
          const def: IconDefinition | undefined = findIconDefinition(lookup as IconLookup);
          if (!def) {
            if (process.client) console.warn('[font-awesome-icon] icon not found in library', lookup);
            return null;
          }
          // In Vue 3, pass props directly and merge attrs
          const mergedProps = { ...(attrs as any), ...(safeProps as any), icon: def } as any;
          return h(FontAwesomeIcon as any, mergedProps, slots);
        }
      } catch (e) {
        if (process.client) console.warn('[font-awesome-icon] icon resolution failed', inputIcon, e);
        return null;
      }

      // If resolution failed, render nothing to avoid runtime crash
      return null;
    };
  }
});

// Legacy vue-awesome <icon name="play" /> alias -> font-awesome-icon.
// Maps the vue-awesome `name` prop to the FA `icon` prop (solid by default).
const IconAlias = defineComponent({
  name: 'IconAlias',
  props: {
    name: { type: String, default: '' },
    scale: { type: [String, Number], default: undefined },
    spin: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    return () => h(SafeFontAwesomeIcon as any, { icon: props.name, spin: props.spin, ...attrs });
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', SafeFontAwesomeIcon)
  // Also register PascalCase to cover either usage in templates
  nuxtApp.vueApp.component('FontAwesomeIcon', SafeFontAwesomeIcon)
  // Legacy vue-awesome tag used across templates
  nuxtApp.vueApp.component('icon', IconAlias)
})
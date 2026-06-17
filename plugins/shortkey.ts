import { defineNuxtPlugin } from 'nuxt/app';

// Lightweight replacement for vue-shortkey (Vue 2 only).
// Supports the directive forms used across the app:
//   v-shortkey="['space']"                         (single combo)
//   v-shortkey="{k:['k'], left:['arrowleft']}"     (named combos -> event.srcKey)
//   v-shortkey="{cUp:['ctrl','arrowup']}"          (with modifiers)
//   v-shortkey.avoid                               (suppress shortcuts while focused)
// On match it dispatches a native 'shortkey' CustomEvent on the element so
// existing @shortkey="..." listeners keep working, with event.srcKey set.

const MODS = ['ctrl', 'shift', 'alt', 'meta'];

type Combo = { srcKey: string | null; mods: string[]; key: string };
type Entry = { el: HTMLElement; combos: Combo[] };

const entries: Entry[] = [];
const avoidEls = new Set<HTMLElement>();

function normalizeKey(k: string): string {
  if (k === ' ' || k === 'spacebar') return 'space';
  return k.toLowerCase();
}

function parse(value: any): Combo[] {
  if (!value) return [];
  const toCombo = (srcKey: string | null, arr: string[]): Combo => {
    const norm = arr.map(k => k.toLowerCase());
    const mods = norm.filter(k => MODS.includes(k));
    const key = norm.filter(k => !MODS.includes(k))[0] || '';
    return { srcKey, mods, key };
  };
  if (Array.isArray(value)) return [toCombo(null, value)];
  return Object.keys(value).map(k => toCombo(k, value[k]));
}

function isAvoiding(): boolean {
  const a = document.activeElement as HTMLElement | null;
  if (!a) return false;
  if (avoidEls.has(a)) return true;
  const tag = a.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || (a as any).isContentEditable === true;
}

function onKeydown(e: KeyboardEvent) {
  if (isAvoiding()) return;
  const key = normalizeKey(e.key);
  const pressedMods = MODS.filter(m => (e as any)[m + 'Key']);

  for (const entry of entries) {
    for (const combo of entry.combos) {
      if (combo.key !== key) continue;
      // exact modifier match
      if (combo.mods.length !== pressedMods.length) continue;
      if (!combo.mods.every(m => pressedMods.includes(m))) continue;

      e.preventDefault();
      const evt: any = new CustomEvent('shortkey', { bubbles: false });
      evt.srcKey = combo.srcKey;
      entry.el.dispatchEvent(evt);
      return; // first match only (avoids double-firing duplicated shortcuts)
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    window.addEventListener('keydown', onKeydown);
  }

  nuxtApp.vueApp.directive('shortkey', {
    mounted(el: HTMLElement, binding) {
      if (binding.modifiers.avoid) {
        avoidEls.add(el);
        return;
      }
      entries.push({ el, combos: parse(binding.value) });
    },
    updated(el: HTMLElement, binding) {
      if (binding.modifiers.avoid) return;
      const entry = entries.find(en => en.el === el);
      if (entry) entry.combos = parse(binding.value);
    },
    unmounted(el: HTMLElement) {
      avoidEls.delete(el);
      const i = entries.findIndex(en => en.el === el);
      if (i !== -1) entries.splice(i, 1);
    },
  });
});

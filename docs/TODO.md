# TODO

## Переезд на Vue 3 / Nuxt 3 (re-port от `master`)

> Подробный план: `~/.claude/plans/vue3-migration-noble-creek.md`.
> **Решения:** не мёржим `v5` (отстаёт на 25 коммитов и тащит старый плеер), а делаем
> **re-port от свежего `master`** в новую ветку `vue3`; состояние переводим на **Pinia**;
> один большой PR в `master`; паритет проверяем **Playwright smoke E2E** + ручной прогон.
> `v5` используем только как референс готовых механических конверсий (nuxt.config с
> Windows-фиксами Vite, плагины, Firebase v9, Element Plus/fontawesome/qrcode).

Целевой стек: **Nuxt 3 + Vue 3 + TypeScript + Pinia**, Element UI → **Element Plus**,
`vue-awesome` → `@fortawesome/vue-fontawesome@3`, `vue-qr-generator` → `qrcode.vue`,
`vue-qrcode-reader@4`, `vue-virtual-scroller@2`, `vue-shortkey` → `@vueuse/core`,
`vuex-persistedstate` → `pinia-plugin-persistedstate`, `@nuxtjs/pwa` → `@vite-pwa/nuxt`,
Firebase v7 → v9 modular.

- [ ] **Фаза 0 — ветка + скаффолд.** Ветка `vue3` от `master`; заменить зависимости в
  `package.json` (база — `v5:package.json`, убрать `vuex`, оставить `pinia` +
  `pinia-plugin-persistedstate`); портировать `nuxt.config.ts` из `v5` (с Windows-фиксами Vite),
  Element Plus, PWA, список плагинов; `npm install`, проверить `npm run update-data`.
- [ ] **Фаза 1 — поднять на Nuxt 3.** Чтобы `npm run dev` (порт 3001) стартовал без ошибок в
  консоли. Плагины `plugins/*.js` → `defineNuxtPlugin`; `layouts/default.vue` (`<nuxt/>` →
  `<NuxtPage/>`, `head()` → `useHead()`, Firebase init + matchMedia dark-mode на v9);
  `this.$route/$router` → `useRoute()/useRouter()`; Element UI → Element Plus (проверить
  переименования пропсов/событий, `size="mini"` → `small`, `el-popover` `v-model:visible`).
- [ ] **Фаза 2 — стор на Pinia (самое рискованное).** `store/index.js` → Pinia-стор
  (`stores/app.ts`), сохранить ре-экспорт `transposeMap`/`chordNotesMap` из `utils/chords`.
  state/getters как есть (включая параметризованные геттеры); mutations+actions → actions;
  сохранить `filterSongs` (Fuse.js, жанры, префиксы `^letter`/`^artist`/`жанр:`/`next`, сорты),
  debounce + `isFirstFilter`, очередь, навигацию, транспонирование, Firebase-экшены на v9,
  webhook POST через `$fetch`. Персист тех же ~18 ключей через `pinia-plugin-persistedstate`
  с тем же ключом localStorage. Переписать ~60 обращений к `$store` в 13 компонентах; убрать
  прямую мутацию в `SongList.vue:151`.
- [ ] **Фаза 3 — порт остальных компонентов.** Иконки `<icon>` →
  `<font-awesome-icon>`; хоткеи на `@vueuse/core` (prev/next, space-автоскролл, транспонир.
  `ctrl+↑/↓`, beat-контролы `a/b/c/d`, PageUp/Down; не срабатывать в input/textarea);
  QR на `qrcode.vue` + `vue-qrcode-reader@4` (событие `@detect`); `BeatPlayer.vue` — только
  стор/Element Plus/иконки, **не** ломать split планировщик/progress-RAF (см. CLAUDE.md).
- [ ] **Фаза 4 — ленивая подгрузка списка на мобиле (главная сложность).** `SongList.vue` на
  `vue-virtual-scroller@2`: проверить `keyField`, `:min-item-size`, `:buffer` (50 при активной
  песне / 1000 иначе), `:size-dependencies`, `scrollToItem`. Сохранить мобильный автоскролл,
  scroll-into-view активной песни и восстановление `lastOffset`.
- [ ] **Фаза 5 — Playwright smoke E2E + проверка паритета.** Добавить `@playwright/test`,
  `playwright.config.ts` (baseURL 3001, `webServer` = `npm run dev`), скрипт `test:e2e`. Тесты:
  загрузка списка, поиск/фильтр (вкл. жанр), открытие песни + аккорды по ховеру, транспонир.,
  prev/next, beat (toggle drums → `beatPlaying`/progress), очередь (`next` + clear), мобильный
  виртуальный список. Ручной прогон через preview MCP: тайминг плеера, Firebase auth/sync (под
  логином), QR-камера, dark mode, PWA. Затем открыть PR `vue3` → `master`.

- [x] нужно восстановить PWA приложения, старый манифест здесь - https://chords.popstas.ru/_nuxt/manifest.578b98c8.json
  — manifest уже настроен в `nuxt.config.ts` (@vite-pwa/nuxt), совпадает со старым (name `chords-viewer`, short_name `Аккорды`); проверено: `/manifest.webmanifest` отдаётся, SW активен.
- [x] при открытии beats панель раскрывается и сразу закрывается. Только в мобильной версии.
  — на мобиле причина отдельная от 53/60: `showBeatControls` было локальным состоянием `SongItem`, а виртуальный скроллер (vue-virtual-scroller) пересоздаёт компонент при смене высоты → состояние терялось. Вынесено в стор (`stores/app.ts`, транзитивно), переживает recycle.
- [x] при клике на rever, выбор октав, стиля и т.д. песня закрывается. Скорее связано с прошлой задачей
  — общий корень 52/53/60: в `SongItem.vue` не был объявлен `emits`, из-за чего `@change` от вложенных el-radio/checkbox/select всплывал в `changeSong`. Добавлен `emits: ["change","active"]`.
- [x] селекторы выбора инструмента в тёмной теме белые, нужно поправить глобальные стили, чтобы были как у select artist по цветам
  — глобальный dark-оверрайд `.el-select__wrapper` вынесен в `layouts/default.vue`.
- [~] сделай npm audit, обнови зависимости
  — безопасных (in-range) обновлений нет: все версии запинены точно, `Wanted == Current`. См. новую задачу ниже по мажорным апгрейдам.
- [x] el-icon-copy-document - нет иконки — заменено на `<icon name="copy">` (FontAwesome).
- [x] строка "просмотров", "-", "+" - выровнять по центру по вертикали — `inline-flex; align-items:center`.
- [x] сделай одинаковый цвет в активной радиокнопке и в выборе алфавита и жанра — алфавит/жанр переведены на `var(--border-hover)`.
- [x] убери голосовой ввод из поиска — удалён SpeechRecognition из `SearchInput.vue`.
- [x] при изменении размера шрифта песня закрывается — тот же фикс `emits` (см. выше).
- [x] при клике на артиста в конце песни нужно закрыть песню и промотать в начало страницы — метод `selectArtist` (фильтр + закрыть + scrollTo(0,0)).

- [ ] **Закрыть npm audit (21 уязвимостей) мажорными апгрейдами.** Все фиксы требуют
  `npm audit fix --force` / breaking-мажоров: Firebase 9→12 (закрывает критическую
  protobufjs + high grpc-js/firestore), Nuxt 3.13→3.21+ (closes esbuild/nanotar/unhead/
  devtools XSS, vite-builder). Делать отдельной веткой с тестами Firebase auth/sync под
  логином и проверкой плеера/таймингов. Прочие мажоры (@vueuse/core 11→14, fuse.js 6→7,
  vue-virtual-scroller 2→3, eslint 8→10, fortawesome 6→7) — по желанию, не security.

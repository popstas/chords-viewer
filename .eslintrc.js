module.exports = {
  root: true,
  // MIDIFile.js is a vendored third-party MIDI parser — not our code to lint.
  ignorePatterns: ['MIDIFile.js'],
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  // vue-eslint-parser handles <template>; delegate <script lang="ts"> + .ts
  // files to the TypeScript parser.
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    // Vue 3 essential ruleset (least strict — error prevention only).
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    // TS handles undefined/unused vars; relax noisy rules for the existing codebase.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-empty': 'off',
    // Nuxt 3 auto-imports composables (useHead, etc.) — `no-undef` flags them
    // as undefined; TypeScript already checks real undefineds.
    'no-undef': 'off',
    // Nuxt pages/layouts are single-word by convention (index, login, default…).
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'off',
    // Plain Node build scripts (scripts/*.js) use CommonJS require().
    '@typescript-eslint/no-var-requires': 'off',
    // Legacy patterns carried over from the Vue 2 codebase.
    'no-useless-escape': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    // Pre-existing Vue-template patterns carried over from the Vue 2 codebase.
    'vue/no-useless-template-attributes': 'off',
    'vue/no-v-text-v-html-on-component': 'off'
  }
}

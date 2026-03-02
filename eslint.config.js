import pluginVue from 'eslint-plugin-vue'

// Nuxt auto-imported globals
const nuxtGlobals = {
  defineNuxtConfig: 'readonly',
  defineNuxtRouteMiddleware: 'readonly',
  definePageMeta: 'readonly',
  navigateTo: 'readonly',
  useAsyncData: 'readonly',
  useI18n: 'readonly',
  useLocalePath: 'readonly',
  useNuxtApp: 'readonly',
  useRoute: 'readonly',
  useRouter: 'readonly',
  useRuntimeConfig: 'readonly',
}

export default [
  // Vue 3 essential rules
  ...pluginVue.configs['flat/essential'],

  // Global ignores
  {
    ignores: [
      'capacitor/',
      'node_modules/',
      '.nuxt/',
      '.output/',
      'dist/',
    ],
  },

  // App source files
  {
    files: ['app/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...nuxtGlobals,
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        queueMicrotask: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
      },
    },
    rules: {
      // Quality rules
      curly: ['error', 'multi', 'consistent'],
      complexity: ['error', 10],
      'max-statements': ['error', 25],
      'max-params': ['error', 3],
      'max-nested-callbacks': ['error', 3],
      'max-depth': ['error', 4],
      'require-await': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-undef': 'error',
      'no-delete-var': 'error',
      'no-var': 'error',
      'no-duplicate-imports': ['error', { includeExports: true }],
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'prefer-const': 'error',
      camelcase: ['error', { properties: 'always' }],

      // Vue rules — allow multi-word component names for pages
      'vue/multi-word-component-names': 'off',
      'vue/require-toggle-inside-transition': 'off',
    },
  },
]

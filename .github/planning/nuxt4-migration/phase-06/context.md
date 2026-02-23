# Phase 06: Layouts, Middleware & Pages

## Purpose

Migrate all layouts, middleware, and page components from Vue 2 Options API to Vue 3 Composition API with `<script setup>`. Convert asyncData to useAsyncData, update template syntax, and wire up Pinia stores and composables.

## Shared Context

- All 42 .vue files use Options API — must convert to `<script setup>`
- `asyncData({ store, params })` → `useAsyncData()` with Pinia stores and `useRoute()`
- `<nuxt />` in layouts → `<slot />` (Nuxt 4 layouts use slots)
- `<nuxt-link>` → `<NuxtLink>` (auto-imported)
- `<nuxt-link tag="li">` (5 occurrences) → wrap `<NuxtLink>` inside `<li>` element
- `layout: 'bottom-screen'` in page options → `definePageMeta({ layout: 'bottom-screen' })`
- `beforeDestroy` → `onBeforeUnmount`
- `{{ value | filter }}` → `{{ filter(value) }}` — import filter functions from `~/utils/filters`
- `this.$store.commit/dispatch` → Pinia store methods
- `this.$root.$on/off/emit` → `useBus().on/off/emit`
- `this.$i18n.t()` / `this.$t()` → `const { t } = useI18n()` / `$t()` in templates (still works)
- `this.$localePath()` → `useLocalePath()` (auto-imported by @nuxtjs/i18n)
- `mapGetters(...)` → `storeToRefs(useXxxStore())`
- `process.client` / `process.server` → `import.meta.client` / `import.meta.server`
- Route params: `this.$route.params.conferenceCode` → `useRoute().params.conferenceCode`

## Key Files

| Category | Files | Count |
|----------|-------|-------|
| Layouts | `default.vue`, `bottom-screen.vue` | 2 |
| Middleware | `redirects.js` | 1 |
| Conference pages | `index.vue`, `about.vue`, `overview.vue`, `conferences.vue`, `languages.vue`, `fileView.vue` | 6 |
| Article page | `article/[tag].vue` | 1 |
| Meeting pages | `agenda.vue`, `calendar.vue`, `documents.vue`, `downloads.vue`, `meetings.vue`, `WeekSelect.vue` | 6 |
| Root pages | `index.vue`, `offline.vue` | 2 |
| Components | `article.vue`, `Loading.vue`, `Offline.vue`, `Spinner.vue`, `header/`, `navigation/` | ~9 |

## Constraints

- Pages must be processed AFTER layouts and middleware (pages depend on layout and middleware)
- Components referenced by pages should be migrated alongside or before the pages that use them
- Calendar components are handled separately in Phase 07
- Template filter usage must be converted in every file where used
- Event bus conversions ($root.$on/off/emit) must maintain same event names
- Keep `<style scoped>` sections — CSS doesn't need Composition API changes

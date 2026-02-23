# Phase 03: State Management (Vuex → Pinia)

## Purpose

Migrate all Vuex store modules to Pinia stores using `defineStore()`. Remove Vuex dependency entirely.

## Shared Context

- Vuex 3 used with `strict: false` in root store
- 6 store modules: `conferences`, `files`, `about`, `article`, `offLine`, `routes`
- Root `store/index.js` is minimal (just `strict: false`)
- Pinia stores use `defineStore()` with either options syntax or setup syntax
- **Setup syntax recommended** — closer to Composition API, easier to use composables inside
- Vuex `mutations` are eliminated — modify `state` directly in actions
- Vuex `mapGetters` → Pinia `storeToRefs()` for reactive destructuring
- Vuex `rootState.i18n` → `useI18n()` inside the store
- Vuex `this.$router` in actions → pass as parameter or use `useRouter()` (only works in setup context)
- Vuex `this.$axios` in actions → use `$fetch` or `ofetch` (migrated in Phase 04; use placeholder for now)
- Vuex `this.$localForage` in actions → import `useLocalForage()` composable (from Phase 02)
- `store.dispatch('module/action')` → `useModuleStore().action()`
- `store.commit('module/MUTATION')` → `useModuleStore().property = value` or store action
- `store.state.module.prop` → `useModuleStore().prop`

## Key Files

| File | Purpose | Pinia Equivalent |
|------|---------|-----------------|
| `store/index.js` | Root store (minimal) | DELETE — Pinia auto-registers |
| `store/offLine.js` | Online/offline state | `stores/offLine.js` |
| `store/routes.js` | Route tracking state | `stores/routes.js` |
| `store/conferences.js` | Conference data + API | `stores/conferences.js` |
| `store/files.js` | File download/storage | `stores/files.js` |
| `store/about.js` | About page articles | `stores/about.js` |
| `store/article.js` | General articles | `stores/article.js` |

## Constraints

- Pinia stores go in `app/stores/` (not `app/store/`) — Nuxt convention
- Each store must preserve the same public API (getters become computed, mutations become direct state changes)
- HTTP calls in stores use a temporary wrapper pending Phase 04 migration
- `@pinia/nuxt` module must be registered in `nuxt.config.ts`
- Old `store/` directory deleted after all stores migrated
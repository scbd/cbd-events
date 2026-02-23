# Task: Filters, icons & notification plugins

**ID:** p02-03
**Status:** pending
**Depends on:** p01-01
**Context size:** small
**Branch:** `p02-03-filters-icons-notifications`
**Target LOC:** ~120 (max 400)

## Goal

Rewrite the filters plugin as plain exported functions, migrate icon components to Nuxt 4 global registration, and convert the SweetAlert2 notification plugin.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-03-filters-icons-notifications`
3. Memory recall (async)

## Inputs

- Phase context: `phase-02/context.md`
- `plugins/filters.js` — defines lstring, timeDisplay, trimName, formatBytes
- `plugins/icons/index.js`, `plugins/icons/Icon.vue`, `plugins/icons/Icons.vue`
- `plugins/vue-notifications.js` — SweetAlert2 injection

## Steps

1. **Rewrite `app/plugins/filters.js`** as plain functions + plugin:
   - Export `lstring`, `timeDisplay`, `trimName`, `formatBytes`, `globalFilter` as named exports from `app/utils/filters.js`
   - Create `app/plugins/03.filters.js`:
     ```js
     import { defineNuxtPlugin } from '#app'
     import * as filters from '~/utils/filters'
     export default defineNuxtPlugin(() => {
       return { provide: { filters } }
     })
     ```
   - Template usage changes from `{{ val | lstring }}` to `{{ lstring(val) }}` (done in Phase 06)

2. **Migrate icon components**:
   - Move `plugins/icons/Icon.vue` and `Icons.vue` to `app/components/` (Nuxt 4 auto-imports)
   - Delete `plugins/icons/index.js` (was doing `Vue.component()` — no longer needed)
   - Verify `<Icon>` and `<Icons>` still work as global components via auto-import

3. **Rewrite `app/plugins/04.notifications.js`**:
   ```js
   import { defineNuxtPlugin } from '#app'
   import swal from 'sweetalert2'
   export default defineNuxtPlugin(() => {
     return { provide: { swal } }
   })
   ```

## Testing

- [ ] Unit test: each filter function produces correct output
- [ ] Unit test: lstring extracts from {en: 'x', fr: 'y'} based on locale param
- [ ] Unit test: formatBytes formats sizes correctly
- [ ] Verify Icon.vue and Icons.vue are auto-imported as global components

## Outputs

- `app/utils/filters.js` — pure function exports
- `app/plugins/03.filters.js` — provides `$filters`
- `app/components/Icon.vue` — moved from plugins/icons/
- `app/components/Icons.vue` — moved from plugins/icons/
- `app/plugins/04.notifications.js` — provides `$swal`
- `plugins/icons/index.js` — DELETED

## Done When

- [ ] Filter functions importable from `~/utils/filters`
- [ ] `$filters` available via `useNuxtApp()`
- [ ] Icon/Icons components globally available via auto-import
- [ ] `$swal` available via `useNuxtApp()`
- [ ] Old plugin files cleaned up

## Commits

Final commit message: `p02-03-filters-icons-notifications`

## Post-Commit Memory (async)

Record: Vue.filter → plain functions in utils/; Vue.component → auto-import; inject() → provide().

## Rollback

- Restore original plugin files from git, remove new files

## Handoff

Next: `phase-02/p02-04-platform-plugin.md`
State: Filters, icons, and notifications available as Nuxt 4 plugins. Template filter syntax not yet updated (Phase 06).

# Task: Replace axios + ionic-native with ofetch + native fetch

**ID:** p04-01
**Status:** pending
**Depends on:** p03-02
**Context size:** medium
**Branch:** `p04-01-http-migration`
**Target LOC:** ~150 (max 400)

## Goal

Replace the dual HTTP composable with a unified `$fetch`-based approach. Update all Pinia stores to use `$fetch` instead of axios placeholders.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p04-01-http-migration`
3. Memory recall (async)

## Inputs

- Phase context: `phase-04/context.md`
- `composables/http.js` — current dual strategy
- All Pinia stores that make HTTP calls: `stores/conferences.js`, `stores/about.js`, `stores/article.js`

## Steps

1. **Rewrite `app/composables/useHttp.js`** (simplified):
   ```js
   import { $fetch } from 'ofetch'

   export function useHttp() {
     async function get(url, options = {}) {
       return $fetch(url, { method: 'GET', ...options })
     }

     async function post(url, body, options = {}) {
       return $fetch(url, { method: 'POST', body, ...options })
     }

     return { get, post, $fetch }
   }

   // Direct export for non-composable usage in stores
   export const http = { get: (url, opts) => $fetch(url, { method: 'GET', ...opts }) }
   export default http
   ```

2. **Update `stores/conferences.js`**:
   - Replace axios calls with `$fetch`:
     ```js
     // Old: const { data } = await $axios.get(url, { params })
     // New: const data = await $fetch(url, { params })
     ```
   - Note: `$fetch` returns the data directly, not `{ data }` wrapper

3. **Update `stores/about.js` and `stores/article.js`**:
   - Same pattern: replace axios-style calls with `$fetch`

4. **Delete old `composables/http.js`**

5. **Remove dependencies from `package.json`**:
   - `@ionic-native/core`
   - `@ionic-native/http`
   - `@nuxtjs/axios`
   - `cordova-plugin-advanced-http` (from capacitor/package.json)

## Testing

- [ ] Unit test: useHttp().get() calls $fetch with correct params
- [ ] Unit test: mock $fetch, verify stores receive parsed JSON
- [ ] Unit test: error handling — 404, 500, network error

## Outputs

- `app/composables/useHttp.js` — unified HTTP composable
- Updated Pinia stores with `$fetch` calls
- `composables/http.js` — DELETED
- Removed: `@ionic-native/core`, `@ionic-native/http`, `@nuxtjs/axios`

## Done When

- [ ] All HTTP calls use `$fetch` or `useFetch()`
- [ ] No axios or @ionic-native/http imports remain
- [ ] Stores work with new HTTP layer
- [ ] Dependencies removed from package.json

## Commits

Final commit message: `p04-01-http-migration`

## Post-Commit Memory (async)

Record: Capacitor 6+ native fetch eliminates need for dual HTTP; $fetch returns data directly (no .data wrapper).

## Rollback

- Restore composables/http.js, revert store changes, restore deps

## Handoff

Next: `phase-04/p04-02-ota-updater.md`
State: HTTP layer unified. OTA updater still uses @ionic-native/http.

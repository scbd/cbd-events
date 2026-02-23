# Task: Router plugin migration

**ID:** p02-05
**Status:** pending
**Depends on:** p01-01
**Context size:** small
**Branch:** `p02-05-router-plugin`
**Target LOC:** ~60 (max 400)

## Goal

Rewrite the router plugin that syncs route state to the store, using Nuxt 4's router hooks and preparing for Pinia (wired in Phase 03).

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-05-router-plugin`
3. Memory recall (async)

## Inputs

- Phase context: `phase-02/context.md`
- `plugins/router.js` — current afterEach hook
- `store/routes.js` — Vuex routes module (state, mutations)

## Steps

1. **Create `app/plugins/05.router.js`**:
   ```js
   import { defineNuxtPlugin } from '#app'

   export default defineNuxtPlugin((nuxtApp) => {
     const router = nuxtApp.$router

     router.afterEach((to, from) => {
       // Will be wired to Pinia routes store in Phase 03
       // For now, store route info that other components need
       console.debug('[router plugin] navigated to:', to.path)
     })
   })
   ```

2. **Create `app/router.options.js`** (Nuxt 4 convention for router config):
   ```js
   export default {
     linkActiveClass: 'active-link'
   }
   ```
   This replaces `router: { linkActiveClass: 'active-link' }` from old nuxt.config.

3. **Delete old `plugins/router.js`**

4. **Note**: Full route-to-store sync will be completed in p03-01 when Pinia routes store is created. This task just sets up the plugin shell and router options.

## Testing

- [ ] Unit test: verify router.options.js exports correct linkActiveClass
- [ ] Manual verification: plugin loads without error

## Outputs

- `app/plugins/05.router.js` — router hook plugin (shell)
- `app/router.options.js` — router configuration
- `plugins/router.js` — DELETED

## Done When

- [ ] Router plugin registered and logs navigation
- [ ] `linkActiveClass: 'active-link'` configured via router.options.js
- [ ] Old plugin deleted

## Commits

Final commit message: `p02-05-router-plugin`

## Post-Commit Memory (async)

Record: router.options.js replaces nuxt.config router block; plugin shell ready for Pinia wiring.

## Rollback

- Restore router.js from git, delete new files

## Handoff

Next: `phase-03/p03-01-pinia-setup-simple-stores.md`
State: All plugins scaffolded. Router plugin needs Pinia wiring in Phase 03. Stores not yet migrated.

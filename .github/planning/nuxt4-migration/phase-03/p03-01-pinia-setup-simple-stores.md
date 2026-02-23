# Task: Pinia setup + offLine & routes stores

**ID:** p03-01
**Status:** pending
**Depends on:** p02-01
**Context size:** small
**Branch:** `p03-01-pinia-setup-simple-stores`
**Target LOC:** ~150 (max 400)

## Goal

Install and configure Pinia, then migrate the two simplest Vuex modules (`offLine` and `routes`) to demonstrate the pattern.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p03-01-pinia-setup-simple-stores`
3. Memory recall (async)

## Inputs

- Phase context: `phase-03/context.md`
- `store/offLine.js` — 2 state props, 2 mutations, 2 getters
- `store/routes.js` — 5 state props, 6 mutations, 2 getters

## Steps

1. **Register `@pinia/nuxt` in `nuxt.config.ts`**:
   ```ts
   modules: ['@pinia/nuxt', ...]
   ```

2. **Create `app/stores/offLine.js`**:
   ```js
   import { defineStore } from 'pinia'
   import { ref, computed } from 'vue'

   export const useOffLineStore = defineStore('offLine', () => {
     const isOffLine = ref(false)
     const isOnLine = computed(() => !isOffLine.value)

     function toggle(value) {
       isOffLine.value = value
     }

     return { isOffLine, isOnLine, toggle }
   })
   ```

3. **Create `app/stores/routes.js`**:
   ```js
   import { defineStore } from 'pinia'
   import { ref, computed } from 'vue'

   export const useRoutesStore = defineStore('routes', () => {
     const route = ref({})
     const prevRoute = ref({})
     const initialized = ref(false)
     const showMeetingNav = ref(false)
     const showNavs = ref(true)

     const conferenceCode = computed(() => route.value?.params?.conferenceCode || '')
     const meetingCode = computed(() => route.value?.params?.meetingCode || '')

     function setRoute(newRoute) {
       prevRoute.value = { ...route.value }
       route.value = newRoute
       if (!initialized.value) initialized.value = true
     }

     function setShowMeetingNav(value) { showMeetingNav.value = value }
     function setShowNavs(value) { showNavs.value = value }

     return {
       route, prevRoute, initialized, showMeetingNav, showNavs,
       conferenceCode, meetingCode,
       setRoute, setShowMeetingNav, setShowNavs
     }
   })
   ```

4. **Wire router plugin** (from p02-05) to routes store:
   Update `app/plugins/05.router.js`:
   ```js
   import { defineNuxtPlugin } from '#app'
   import { useRoutesStore } from '~/stores/routes'

   export default defineNuxtPlugin((nuxtApp) => {
     const router = nuxtApp.$router
     const routesStore = useRoutesStore()

     router.afterEach((to) => {
       routesStore.setRoute({
         name: to.name,
         path: to.path,
         params: { ...to.params },
         query: { ...to.query }
       })
     })
   })
   ```

5. **Delete old store files**: `store/offLine.js`, `store/routes.js`

## Testing

- [ ] Unit test: offLine store toggle sets isOffLine, isOnLine inverts
- [ ] Unit test: routes store setRoute updates route and prevRoute
- [ ] Unit test: routes store conferenceCode/meetingCode computed from route params

## Outputs

- `app/stores/offLine.js` — Pinia offLine store
- `app/stores/routes.js` — Pinia routes store
- `app/plugins/05.router.js` — updated with Pinia wiring
- `store/offLine.js`, `store/routes.js` — DELETED

## Done When

- [ ] `@pinia/nuxt` registered in nuxt.config.ts
- [ ] Both stores work with `useOffLineStore()` and `useRoutesStore()`
- [ ] Router plugin syncs navigation to routes store
- [ ] Old Vuex files deleted

## Commits

Final commit message: `p03-01-pinia-setup-simple-stores`

## Post-Commit Memory (async)

Record: Pinia setup syntax pattern; router afterEach wiring to store.

## Rollback

- Remove @pinia/nuxt from config, delete new store files, restore old files from git

## Handoff

Next: `phase-03/p03-02-conferences-store.md`
State: Pinia configured. Simple stores migrated. Router wired. Complex stores remain.
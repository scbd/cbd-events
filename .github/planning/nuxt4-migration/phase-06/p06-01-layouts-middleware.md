# Task: Layouts & middleware migration

**ID:** p06-01
**Status:** pending
**Depends on:** p02-02, p03-01
**Context size:** medium
**Branch:** `p06-01-layouts-middleware`
**Target LOC:** ~200 (max 400)

## Goal

Convert both layouts and the redirects middleware to Nuxt 4 patterns. Also migrate the header, SideMenu, navigation, Loading, Offline, and Spinner components that layouts depend on.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-01-layouts-middleware`
3. Memory recall (async)

## Inputs

- Phase context: `phase-06/context.md`
- `layouts/default.vue` — main layout with Header, Nav, Loading, OTA
- `layouts/bottom-screen.vue` — simple bottom-screen overlay layout
- `middleware/redirects.js` — auto-redirect to selected conference
- `components/header/header.vue`, `components/header/header-bottom-screen.vue`, `components/header/SideMenu.vue`
- `components/navigation/index.vue`
- `components/Loading.vue`, `components/Offline.vue`, `components/Spinner.vue`

## Steps

1. **Migrate `app/layouts/default.vue`**:
   - Convert to `<script setup>`
   - `<nuxt />` → `<slot />`
   - `this.$store.commit('offLine/TOGGLE')` → `useOffLineStore().toggle()`
   - `Capacitor.getPlatform()` → `usePlatform()`
   - `StatusBar` import stays (Capacitor native API)
   - OTA update on mount → `useOta()` composable call in `onMounted()`
   - Window online/offline listeners → `onMounted` / `onBeforeUnmount`

2. **Migrate `app/layouts/bottom-screen.vue`**:
   - Convert to `<script setup>`
   - `<nuxt />` → `<slot />`
   - Preserve transition wrapper

3. **Migrate `app/middleware/redirects.js`**:
   ```js
   export default defineNuxtRouteMiddleware(async (to) => {
     const conferencesStore = useConferencesStore()
     const hasRouteParams = Object.keys(to.params).length

     if (!conferencesStore.selected)
       await conferencesStore.get()

     const { code } = conferencesStore.selected || {}
     if (!hasRouteParams && code)
       return navigateTo(`/${code}`)
   })
   ```

4. **Migrate header components** to `<script setup>`:
   - `header.vue`: uses `this.$store`, `this.$root.$emit('side-menu')`, `$filters.lstring`, `$localePath`
   - `header-bottom-screen.vue`: uses `this.$root.$on('bottom-screen-done')`, `this.$router.back()`
   - `SideMenu.vue`: uses `this.$root.$on('side-menu')`, `$localePath`, `$i18n`

5. **Migrate `navigation/index.vue`**:
   - Convert `<nuxt-link tag="li">` (5 occurrences) to:
     ```vue
     <li class="nav-item" :class="{ active: isActive }">
       <NuxtLink :to="path" class="nav-link">...</NuxtLink>
     </li>
     ```
   - Replace `mapGetters` with `storeToRefs`

6. **Migrate utility components** (Loading, Offline, Spinner):
   - Simple components — mostly template-only or minimal logic
   - Convert any `this.` references to Composition API

## Testing

- [ ] Unit test: redirects middleware navigates to conference code when no params
- [ ] Unit test: redirects middleware does nothing when params present
- [ ] Verify layout slot renders correctly
- [ ] Verify navigation generates correct NuxtLink markup

## Outputs

- Updated layouts: `default.vue`, `bottom-screen.vue`
- Updated middleware: `redirects.js`
- Updated components: header/*, navigation/index.vue, Loading.vue, Offline.vue, Spinner.vue

## Done When

- [ ] Both layouts use `<slot />` instead of `<nuxt />`
- [ ] Middleware uses `defineNuxtRouteMiddleware` + `navigateTo`
- [ ] All components use `<script setup>`
- [ ] No `this.$store`, `this.$root.$on`, `mapGetters`, or Options API remains in these files
- [ ] `nuxt-link tag="li"` replaced with proper structure

## Commits

Final commit message: `p06-01-layouts-middleware`

## Post-Commit Memory (async)

Record: nuxt→slot in layouts; defineNuxtRouteMiddleware pattern; nuxt-link tag="li" replacement pattern.

## Rollback

- Restore all changed files from git

## Handoff

Next: `phase-06/p06-02-static-conference-pages.md`
State: Layouts, middleware, header, nav all migrated. Page components next.

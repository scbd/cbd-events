# Task: Static & conference info pages

**ID:** p06-02
**Status:** pending
**Depends on:** p06-01, p03-02
**Context size:** medium
**Branch:** `p06-02-static-conference-pages`
**Target LOC:** ~300 (max 400)

## Goal

Migrate the root pages and conference info pages to `<script setup>` with Composition API. These are the simpler pages with mostly display logic.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-02-static-conference-pages`
3. Memory recall (async)

## Inputs

- Phase context: `phase-06/context.md`
- Pages:
  - `pages/index.vue` — redirect-only root
  - `pages/offline.vue` — offline fallback
  - `pages/[conferenceCode]/index.vue` — conference landing
  - `pages/[conferenceCode]/about.vue` — about page
  - `pages/[conferenceCode]/overview.vue` — overview page
  - `pages/[conferenceCode]/conferences.vue` — conference list (bottom-screen layout)
  - `pages/[conferenceCode]/languages.vue` — language selector (bottom-screen layout)

## Steps

1. **Migrate `pages/index.vue`** (root redirect):
   - Minimal page — just redirects; may become empty with middleware handling it
   - Convert to `<script setup>` with `definePageMeta`

2. **Migrate `pages/offline.vue`**:
   - Simple display page, minimal logic
   - Convert to `<script setup>`

3. **Migrate `pages/[conferenceCode]/index.vue`** (conference landing):
   - `asyncData({ store, params })` → `useAsyncData` + Pinia stores
   - `mapGetters('conferences', [...])` → `storeToRefs(useConferencesStore())`
   - Template filters: `{{ title | lstring }}` → `{{ lstring(title) }}`
   - `this.$localePath` → `useLocalePath()`

4. **Migrate `pages/[conferenceCode]/about.vue`**:
   - `asyncData` fetches about articles
   - Uses about store and conferences store

5. **Migrate `pages/[conferenceCode]/overview.vue`**:
   - Similar pattern to about.vue
   - `asyncData` + store dispatch

6. **Migrate `pages/[conferenceCode]/conferences.vue`**:
   - `layout: 'bottom-screen'` → `definePageMeta({ layout: 'bottom-screen' })`
   - Uses `this.$root.$on/off('bottom-screen-done')` → `useBus().on/off`
   - Convert to `<script setup>`

7. **Migrate `pages/[conferenceCode]/languages.vue`**:
   - `layout: 'bottom-screen'` → `definePageMeta({ layout: 'bottom-screen' })`
   - Uses i18n for locale switching
   - `this.$i18n.setLocale()` → `const { setLocale } = useI18n()`

## Testing

- [ ] Unit test: conference index page loads store data via useAsyncData
- [ ] Unit test: about page dispatches about store action
- [ ] Unit test: conferences page uses bottom-screen layout meta
- [ ] Unit test: languages page calls setLocale correctly

## Outputs

- Migrated pages: index.vue, offline.vue, [conferenceCode]/index.vue, about.vue, overview.vue, conferences.vue, languages.vue

## Done When

- [ ] All 7 pages use `<script setup>`
- [ ] asyncData replaced with useAsyncData/useFetch
- [ ] Template filters converted to function calls
- [ ] Pages with bottom-screen layout use definePageMeta
- [ ] No Options API, no this.$ references

## Commits

Final commit message: `p06-02-static-conference-pages`

## Post-Commit Memory (async)

Record: asyncData→useAsyncData pattern; definePageMeta for layout; template filter conversion pattern.

## Rollback

- Restore all page files from git

## Handoff

Next: `phase-06/p06-03-article-fileview-pages.md`
State: Static/info pages done. Article, fileView, and meeting pages remain.

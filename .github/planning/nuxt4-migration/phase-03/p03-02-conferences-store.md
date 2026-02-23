# Task: Conferences store migration

**ID:** p03-02
**Status:** pending
**Depends on:** p03-01
**Context size:** large
**Branch:** `p03-02-conferences-store`
**Target LOC:** ~300 (max 400)

## Goal

Migrate the conferences Vuex module (326 lines, 4 state props, 5 mutations, 2 actions, 12 getters) to a Pinia store. This is the most complex store.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p03-02-conferences-store`
3. Memory recall (async)

## Inputs

- Phase context: `phase-03/context.md`
- `store/conferences.js` — full file (326 lines)
- `composables/query-filter.js` — used for building API queries
- `app/utils/api-normalize.js` — normalizeApiResponse, normalizeSolrResponse (moved from `modules/` in p01-02)

## Steps

1. **Analyze current store structure**:
   - State: `docs`, `selected`, `selectedMeeting`, `meetings`
   - Mutations: `SET_DOCS`, `SET_SELECTED`, `SET_SELECTED_MEETING`, `SET_MEETINGS`, `CLEAR_SELECTED`
   - Actions: `get` (load conferences from API), `getMeetings` (load meetings)
   - Getters: 12 computed getters deriving conference data (heroImage, dates, links, etc.)
   - Uses: `this.$router`, `this.$axios`, `rootState.i18n`

2. **Create `app/stores/conferences.js`** using setup syntax:
   - State → `ref()` variables
   - Mutations → direct assignments in actions
   - Actions → async functions
   - Getters → `computed()` properties
   - Replace `this.$router.currentRoute.params` → accept params as function arguments
   - Replace `this.$axios` → use `$fetch` / `ofetch` (or temporary placeholder until Phase 04)
   - Replace `rootState.i18n.locale` → `useI18n().locale.value`
   - Keep query building and API normalization logic intact (import from modules/)

3. **Preserve all 12 getters** as computed properties:
   - heroImage, bannerImage, conferenceId, logo, links, dates, venue, etc.
   - These are used across many components

4. **Migrate helper functions** (queryConferences, queryMeetings):
   - Move inside the store or keep as module-level functions
   - Replace `$axios.get()` with `$fetch()` call (temporary — will be fully migrated in Phase 04)

5. **Delete `store/conferences.js`**

## Testing

- [ ] Unit test: store initializes with empty state
- [ ] Unit test: mock API response, verify `get()` populates docs and selected
- [ ] Unit test: verify all 12 computed getters return correct values from mock data
- [ ] Unit test: getMeetings populates meetings array

## Outputs

- `app/stores/conferences.js` — Pinia conferences store
- `store/conferences.js` — DELETED

## Done When

- [ ] All state, actions, and getters migrated to Pinia
- [ ] No references to `this.$router`, `this.$axios`, or `rootState` inside store
- [ ] Helper functions use `$fetch` or parameterized HTTP calls
- [ ] Test coverage for all public API

## Commits

Final commit message: `p03-02-conferences-store`

## Post-Commit Memory (async)

Record: Complex store migration pattern; how to handle this.$router and this.$axios in Pinia.

## Rollback

- Restore `store/conferences.js` from git, delete new file

## Handoff

Next: `phase-03/p03-03-files-store.md`
State: Conferences store migrated. Files, about, article stores remain.
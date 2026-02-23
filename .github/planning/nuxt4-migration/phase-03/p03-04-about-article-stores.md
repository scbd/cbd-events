# Task: About & Article stores migration

**ID:** p03-04
**Status:** pending
**Depends on:** p03-01
**Context size:** small
**Branch:** `p03-04-about-article-stores`
**Target LOC:** ~200 (max 400)

## Goal

Migrate the about and article Vuex modules to Pinia stores, then delete the old Vuex store directory and root index.js.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p03-04-about-article-stores`
3. Memory recall (async)

## Inputs

- Phase context: `phase-03/context.md`
- `store/about.js` — 1 state prop, 1 mutation, 4 actions
- `store/article.js` — 1 state prop, 1 mutation, 4 actions
- `app/composables/use-local-forage.js` — from Phase 02

## Steps

1. **Create `app/stores/about.js`**:
   - State: `docs` ref
   - Actions: `get(code)`, `getFromApi(code)`, `getFromLocal(code)`, `saveToLocal(code, data)`
   - Uses localForage `about` store for offline caching
   - API calls via `$fetch` (placeholder until Phase 04)
   - Key pattern: articles keyed by conference code

2. **Create `app/stores/article.js`**:
   - State: `docs` ref
   - Actions: `get({ code, tag })`, `getFromApi({ code, tag })`, `getFromLocal({ code, tag })`, `saveToLocal({ code, tag, data })`
   - Uses localForage `article` store for offline caching
   - Key pattern: `${conferenceCode}-${tag}` composite key

3. **Both stores share similar pattern** — consider extracting a shared factory function:
   ```js
   function createCachedArticleStore(name, storeName, keyFn) { ... }
   ```
   But keep stores separate for clarity and maintainability.

4. **Delete old Vuex files**:
   - `store/about.js`
   - `store/article.js`
   - `store/index.js` (root Vuex store — no longer needed)
   - `store/conferences.js` (deleted in p03-02)
   - `store/files.js` (deleted in p03-03)
   - Delete `store/` directory entirely if empty

5. **Remove Vuex from `package.json`** — should already be gone from p01-01, verify

## Testing

- [ ] Unit test: about store get() fetches from API and caches in localForage
- [ ] Unit test: about store falls back to localForage when offline
- [ ] Unit test: article store uses composite key (code-tag)
- [ ] Unit test: both stores clear and save correctly

## Outputs

- `app/stores/about.js` — Pinia about store
- `app/stores/article.js` — Pinia article store
- `store/` directory — DELETED entirely

## Done When

- [ ] Both stores migrated to Pinia
- [ ] Use `useLocalForage()` for offline caching
- [ ] Old `store/` directory completely removed
- [ ] No Vuex references remain in codebase

## Commits

Final commit message: `p03-04-about-article-stores`

## Post-Commit Memory (async)

Record: About/article cached store pattern; composite key for articles; Vuex fully removed.

## Rollback

- Restore `store/` directory from git, delete new store files

## Handoff

Next: `phase-04/p04-01-http-migration.md`
State: All Vuex stores migrated to Pinia. Vuex removed. HTTP layer still uses axios/$fetch placeholder.
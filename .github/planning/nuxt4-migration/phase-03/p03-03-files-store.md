# Task: Files store migration

**ID:** p03-03
**Status:** pending
**Depends on:** p03-01, p02-01
**Context size:** medium
**Branch:** `p03-03-files-store`
**Target LOC:** ~200 (max 400)

## Goal

Migrate the files Vuex module to Pinia. This store manages file downloads, storage via localForage, and file-open state.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p03-03-files-store`
3. Memory recall (async)

## Inputs

- Phase context: `phase-03/context.md`
- `store/files.js` — current Vuex module
- `app/composables/useLocalForage.js` — from Phase 02

## Steps

1. **Analyze current store**:
   - State: `data` (array), `downloading` (object|null), `fileToOpen` (object|null)
   - Mutations: `SET_DATA`, `SET_DOWNLOADING`, `CLEAR_DOWNLOADING`, `SET_FILE_TO_OPEN`, `CLEAR_FILE_TO_OPEN`, `UPDATE_FILE`
   - Actions: `loadFromStorage`, `saveFile`, `removeFile`, `removeAllFiles`
   - Getters: `files`, `totalSize`, `isDownloading`, `fileToOpen`, `getFileByUrl`

2. **Create `app/stores/files.js`**:
   - Import `useLocalForage` for storage operations
   - State → `ref()` variables
   - Critical: Preserve localForage iterate pattern with curly brackets:
     ```js
     async function loadFromStorage() {
       const items = []
       const { files } = useLocalForage()
       await files.iterate((value) => { items.push(value) })  // curly brackets required!
       data.value = items
     }
     ```
   - Blob storage: metadata in `files` store, binary in `blobs` store (separate)
   - Replace `this.$localForage` → `useLocalForage()`

3. **Preserve getters as computed**:
   - `totalSize` — sum of all file sizes
   - `getFileByUrl` — getter function pattern: return a function from computed

4. **Delete `store/files.js`**

## Testing

- [ ] Unit test: loadFromStorage populates data from mocked localForage
- [ ] Unit test: saveFile stores metadata in files, blob in blobs
- [ ] Unit test: removeFile clears from both stores
- [ ] Unit test: totalSize computes correctly
- [ ] Unit test: iterate with curly brackets collects all items

## Outputs

- `app/stores/files.js` — Pinia files store
- `store/files.js` — DELETED

## Done When

- [ ] All state, actions, getters migrated
- [ ] Uses `useLocalForage()` instead of `this.$localForage`
- [ ] iterate() pattern uses curly brackets
- [ ] Blob/metadata separation preserved

## Commits

Final commit message: `p03-03-files-store`

## Post-Commit Memory (async)

Record: localForage integration in Pinia; iterate curly bracket pattern; blob/metadata separation.

## Rollback

- Restore `store/files.js`, delete new file

## Handoff

Next: `phase-03/p03-04-about-article-stores.md`
State: Files store migrated. About and article stores remain.
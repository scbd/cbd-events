# Task: documentDownloadMixin → useDocumentDownload composable

**ID:** p05-02
**Status:** pending
**Depends on:** p03-03, p04-01
**Context size:** large
**Branch:** `p05-02-document-download-composable`
**Target LOC:** ~250 (max 400)

## Goal

Convert the most complex mixin (`app/utils/documentDownloadMixin.js`, moved from `modules/` in p01-02) to a `useDocumentDownload()` composable. This handles iframe communication, file downloading, progress tracking, and native file opening.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p05-02-document-download-composable`
3. Memory recall (async)

## Inputs

- Phase context: `phase-05/context.md`
- `app/utils/documentDownloadMixin.js` — full mixin source
- `app/utils/CordovaFiles.js` — file opening logic (framework-agnostic)
- `stores/files.js` — Pinia files store
- `composables/useHttp.js` — HTTP composable

## Steps

1. **Analyze mixin surface area**:
   - `created`: sets up state variables
   - `mounted`: adds `window.addEventListener('message', ...)` for iframe postMessage
   - `beforeDestroy`: removes event listener, clears loading
   - Methods: `saveFiles`, `getFileName`, `createFileObj`, `closeDialog`, `getFileObjs`
   - Uses: `this.$refs.docsFrame`, `this.$store`, `this.$nuxt.$loading`, `this.$route.params`, `this.$swal`

2. **Create `app/composables/useDocumentDownload.js`**:
   ```js
   import { ref, onMounted, onBeforeUnmount } from 'vue'
   import { useRoute } from 'vue-router'
   import { useNuxtApp } from '#app'
   import { useFilesStore } from '~/stores/files'

   export function useDocumentDownload(iframeRef) {
     const route = useRoute()
     const filesStore = useFilesStore()
     const { $swal } = useNuxtApp()

     const isLoading = ref(false)

     function onMessage(event) {
       // Handle postMessage from docs iframe
       // Parse file URLs from message data
     }

     onMounted(() => {
       if (import.meta.client)
         window.addEventListener('message', onMessage)
     })

     onBeforeUnmount(() => {
       window.removeEventListener('message', onMessage)
     })

     async function saveFiles(files) { /* ... */ }
     function getFileName(url) { /* ... */ }
     function createFileObj(file) { /* ... */ }
     function closeDialog() { /* ... */ }
     async function getFileObjs() { /* ... */ }

     return {
       isLoading,
       saveFiles, getFileName, createFileObj, closeDialog, getFileObjs
     }
   }
   ```

3. **Key migrations**:
   - `this.$refs.docsFrame` → pass as `iframeRef` parameter (template ref)
   - `this.$nuxt.$loading.start/finish` → `useLoadingIndicator()` or custom `isLoading` ref
   - `this.$store.dispatch('files/saveFile')` → `filesStore.saveFile()`
   - `this.$route.params` → `useRoute().params`
   - `this.$swal` → `useNuxtApp().$swal`
   - `process.client` → `import.meta.client`
   - `this.$root.$emit()` → `useBus().emit()`

4. **Delete `app/utils/documentDownloadMixin.js`**

## Testing

- [ ] Unit test: onMessage handler parses file URLs from postMessage
- [ ] Unit test: saveFiles calls filesStore.saveFile for each file
- [ ] Unit test: getFileName extracts filename from URL
- [ ] Unit test: cleanup removes event listener on unmount

## Outputs

- `app/composables/useDocumentDownload.js` — document download composable
- `app/utils/documentDownloadMixin.js` — DELETED

## Done When

- [ ] All mixin methods converted to composable functions
- [ ] Lifecycle hooks use onMounted/onBeforeUnmount
- [ ] No Vue 2 patterns (this.$store, this.$refs, etc.)
- [ ] iframe ref passed as parameter
- [ ] Old mixin deleted

## Commits

Final commit message: `p05-02-document-download-composable`

## Post-Commit Memory (async)

Record: Complex mixin conversion pattern; iframe ref as param; window event listener cleanup; this.$nuxt.$loading → useLoadingIndicator or custom ref.

## Rollback

- Restore mixin from git, delete composable

## Handoff

Next: `phase-06/p06-01-layouts-middleware.md`
State: All mixins converted to composables. Ready for page/layout migration.

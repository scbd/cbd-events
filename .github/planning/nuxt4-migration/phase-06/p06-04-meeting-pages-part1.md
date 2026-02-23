# Task: Meeting pages (part 1): agenda & documents

**ID:** p06-04
**Status:** pending
**Depends on:** p06-01, p05-02
**Context size:** large
**Branch:** `p06-04-meeting-pages-part1`
**Target LOC:** ~300 (max 400)

## Goal

Migrate the agenda and documents pages — the most complex meeting pages that use the documentDownloadMixin (now useDocumentDownload composable) and iframe communication.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-04-meeting-pages-part1`
3. Memory recall (async)

## Inputs

- Phase context: `phase-06/context.md`
- `pages/[conferenceCode]/[meetingCode]/agenda.vue`
- `pages/[conferenceCode]/[meetingCode]/documents.vue`
- `composables/useDocumentDownload.js` — from Phase 05

## Steps

1. **Migrate `agenda.vue`**:
   - Convert to `<script setup>`
   - `mixins: [documentDownloadMixin]` → `const { saveFiles, getFileObjs, isLoading, ... } = useDocumentDownload(iframeRef)`
   - `this.$refs.docsFrame` → `const iframeRef = useTemplateRef('docsFrame')`
   - `asyncData` → `useAsyncData` with conferences store
   - Store access → Pinia stores
   - Template filters → function calls
   - `this.$root.$emit/on` → `useBus()`
   - `process.client` → `import.meta.client`

2. **Migrate `documents.vue`**:
   - Very similar pattern to agenda.vue
   - Same mixin usage → same composable
   - May have different asyncData logic for document listing
   - Convert all the same patterns as agenda.vue

3. **Key pattern for iframe ref passing**:
   ```vue
   <script setup>
   const docsFrame = useTemplateRef('docsFrame')
   const { saveFiles, isLoading } = useDocumentDownload(docsFrame)
   </script>

   <template>
     <iframe ref="docsFrame" :src="iframeSrc" />
   </template>
   ```

## Testing

- [ ] Unit test: agenda page loads with useAsyncData
- [ ] Unit test: documents page loads with useAsyncData
- [ ] Unit test: useDocumentDownload receives iframe ref correctly
- [ ] Unit test: template renders iframe with correct src

## Outputs

- Updated: `pages/[conferenceCode]/[meetingCode]/agenda.vue`, `documents.vue`

## Done When

- [ ] Both pages use `<script setup>`
- [ ] documentDownloadMixin replaced with useDocumentDownload composable
- [ ] iframe refs passed correctly
- [ ] asyncData → useAsyncData
- [ ] No Options API, no this.$ references

## Commits

Final commit message: `p06-04-meeting-pages-part1`

## Post-Commit Memory (async)

Record: Mixin→composable integration in pages; iframe ref passing pattern; useTemplateRef usage.

## Rollback

- Restore files from git

## Handoff

Next: `phase-06/p06-05-meeting-pages-part2.md`
State: Complex meeting pages done. Remaining meeting pages are simpler.

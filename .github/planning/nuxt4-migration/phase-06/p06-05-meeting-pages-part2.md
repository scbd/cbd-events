# Task: Meeting pages (part 2): downloads, meetings, calendar, WeekSelect

**ID:** p06-05
**Status:** pending
**Depends on:** p06-04
**Context size:** medium
**Branch:** `p06-05-meeting-pages-part2`
**Target LOC:** ~350 (max 400)

## Goal

Migrate the remaining meeting pages to `<script setup>`. These pages are less complex than agenda/documents but have their own patterns (file lists, meeting lists, calendar view, week selection).

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-05-meeting-pages-part2`
3. Memory recall (async)

## Inputs

- Phase context: `phase-06/context.md`
- `pages/[conferenceCode]/[meetingCode]/downloads.vue`
- `pages/[conferenceCode]/[meetingCode]/meetings.vue`
- `pages/[conferenceCode]/[meetingCode]/calendar.vue`
- `pages/[conferenceCode]/[meetingCode]/WeekSelect.vue`

## Steps

1. **Migrate `downloads.vue`**:
   - Has `filters: { trimName, timeDisplay, formatBytes, lstring }` option — remove, import from utils/filters
   - `{{ file.baseName | trimName }}` → `{{ trimName(file.baseName) }}`
   - `mapGetters('files', [...])` → `storeToRefs(useFilesStore())`
   - `asyncData` → `useAsyncData`
   - Convert to `<script setup>`

2. **Migrate `meetings.vue`**:
   - `layout: 'bottom-screen'` → `definePageMeta({ layout: 'bottom-screen' })`
   - `this.$root.$on('bottom-screen-done')` → `useBus()`
   - `asyncData` → `useAsyncData` + conferences store
   - Template filters → function calls

3. **Migrate `calendar.vue`**:
   - Uses `mapGetters` from conferences store
   - `asyncData` → `useAsyncData`
   - Integrates with Calendar component (Phase 07) — ensure props/events interface preserved
   - The Calendar component itself is migrated in Phase 07; this page just passes props to it

4. **Migrate `WeekSelect.vue`**:
   - `layout: 'bottom-screen'` → `definePageMeta({ layout: 'bottom-screen' })`
   - `this.$root.$on('bottom-screen-done')` → `useBus()`
   - Week selection logic → composition API

5. **Clean up Phase 06**: After all pages migrated:
   - Verify no imports of old `store/` directory remain
   - Verify no `mapGetters`, `mapState`, `mapActions` remain
   - Verify no `asyncData` option remains
   - Verify no `this.$` references remain (except `this.$refs` which Vue 3 still supports in Options API, but we're using script setup)

## Testing

- [ ] Unit test: downloads page renders file list with formatted values
- [ ] Unit test: meetings page dispatches store action
- [ ] Unit test: calendar page passes correct props to Calendar component
- [ ] Unit test: WeekSelect uses bottom-screen layout

## Outputs

- Updated: `downloads.vue`, `meetings.vue`, `calendar.vue`, `WeekSelect.vue`

## Done When

- [ ] All 4 pages use `<script setup>`
- [ ] No `filters: {}` option in any page
- [ ] All template `{{ x | filter }}` converted to `{{ filter(x) }}`
- [ ] No mapGetters/mapState/mapActions anywhere in codebase
- [ ] No asyncData option anywhere
- [ ] All pages with bottom-screen layout use definePageMeta

## Commits

Final commit message: `p06-05-meeting-pages-part2`

## Post-Commit Memory (async)

Record: filters option removal; all pages now use script setup; codebase-wide verification checklist for Vue 2 patterns.

## Rollback

- Restore files from git

## Handoff

Next: `phase-07/p07-01-calendar-core.md`
State: All layouts, middleware, and pages migrated. Calendar widget migration is next (isolated subsystem).

# Task: Article & fileView pages

**ID:** p06-03
**Status:** pending
**Depends on:** p06-01, p03-04, p05-01
**Context size:** medium
**Branch:** `p06-03-article-fileview-pages`
**Target LOC:** ~200 (max 400)

## Goal

Migrate the article tag page, fileView page, and the article component to `<script setup>`.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-03-article-fileview-pages`
3. Memory recall (async)

## Inputs

- Phase context: `phase-06/context.md`
- `pages/[conferenceCode]/article/[tag].vue` — article display by tag
- `pages/[conferenceCode]/fileView.vue` — file viewer page (bottom-screen layout)
- `components/article.vue` — shared article component (unusual: uses asyncData!)

## Steps

1. **Migrate `components/article.vue`**:
   - This component uses `asyncData` which is unusual for a component (only pages normally have it)
   - In Nuxt 4, use `useAsyncData` inside the component's `<script setup>`
   - Uses `this.$refs.article` for DOM manipulation (oembed processing)
   - Convert refs: `const articleRef = useTemplateRef('article')` or `ref(null)`
   - Convert store access to Pinia

2. **Migrate `pages/[conferenceCode]/article/[tag].vue`**:
   - `asyncData({ store, params })` → `useAsyncData` with article store
   - Dynamic route param: `params.tag` → `useRoute().params.tag`
   - Uses article store: `store.dispatch('article/get', { code, tag })`

3. **Migrate `pages/[conferenceCode]/fileView.vue`**:
   - `layout: 'bottom-screen'` → `definePageMeta({ layout: 'bottom-screen' })`
   - Uses `this.$root.$on('bottom-screen-done')` → `useBus()`
   - Uses files store for file display/opening
   - Uses `useCoverImage()` composable (from Phase 05)

## Testing

- [ ] Unit test: article component fetches data via useAsyncData
- [ ] Unit test: article [tag] page loads correct tag from route params
- [ ] Unit test: fileView uses bottom-screen layout meta

## Outputs

- Updated: `components/article.vue`, `pages/[conferenceCode]/article/[tag].vue`, `pages/[conferenceCode]/fileView.vue`

## Done When

- [ ] article component uses useAsyncData instead of asyncData option
- [ ] article [tag] page uses useAsyncData with article store
- [ ] fileView page converted to script setup
- [ ] All template filters converted
- [ ] No Options API remains

## Commits

Final commit message: `p06-03-article-fileview-pages`

## Post-Commit Memory (async)

Record: Component-level asyncData → useAsyncData pattern; useTemplateRef for DOM access.

## Rollback

- Restore files from git

## Handoff

Next: `phase-06/p06-04-meeting-pages-part1.md`
State: Article and fileView pages done. Meeting pages remain (most complex).

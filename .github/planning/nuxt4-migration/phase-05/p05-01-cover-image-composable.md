# Task: CoverImageMixin → useCoverImage composable

**ID:** p05-01
**Status:** pending
**Depends on:** p03-02
**Context size:** small
**Branch:** `p05-01-cover-image-composable`
**Target LOC:** ~60 (max 400)

## Goal

Convert `app/utils/CoverImageMixin.js` (moved from `modules/` in p01-02) to a `useCoverImage()` composable.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p05-01-cover-image-composable`
3. Memory recall (async)

## Inputs

- Phase context: `phase-05/context.md`
- `app/utils/CoverImageMixin.js` — computed: conference, getHeroImage, getImage, title
- `stores/conferences.js` — provides selected conference data

## Steps

1. **Create `app/composables/useCoverImage.js`**:
   ```js
   import { computed } from 'vue'
   import { useConferencesStore } from '~/stores/conferences'
   import { lstring } from '~/utils/filters'

   export function useCoverImage() {
     const conferencesStore = useConferencesStore()

     const conference = computed(() => conferencesStore.selected)
     const title = computed(() => lstring(conference.value?.title))

     const getHeroImage = computed(() => {
       const img = conference.value?.heroImage
       if (!img) return null
       return `${useRuntimeConfig().public.attachments}/${img}`
     })

     const getImage = computed(() => {
       const img = conference.value?.image
       if (!img) return null
       return `${useRuntimeConfig().public.attachments}/${img}`
     })

     return { conference, title, getHeroImage, getImage }
   }
   ```

2. **Delete `app/utils/CoverImageMixin.js`**

3. **Note**: Components using this mixin will be updated in Phase 06 when pages are migrated

## Testing

- [ ] Unit test: returns conference from store
- [ ] Unit test: title applies lstring filter
- [ ] Unit test: heroImage/image prepend attachments URL
- [ ] Unit test: returns null when no image

## Outputs

- `app/composables/useCoverImage.js` — cover image composable
- `app/utils/CoverImageMixin.js` — DELETED

## Done When

- [ ] `useCoverImage()` returns { conference, title, getHeroImage, getImage }
- [ ] Uses Pinia store instead of Vuex
- [ ] Uses imported lstring instead of this.$filters
- [ ] Old mixin deleted

## Commits

Final commit message: `p05-01-cover-image-composable`

## Post-Commit Memory (async)

Record: Mixin→composable pattern: computed properties become composable returns; this.$store → Pinia import.

## Rollback

- Restore mixin from git, delete composable

## Handoff

Next: `phase-05/p05-02-document-download-composable.md`
State: Cover image composable ready. Document download mixin still to migrate.

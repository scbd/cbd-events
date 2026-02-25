import { computed            } from 'vue'
import { useConferencesStore } from '~/stores/conferences'
import { lstring             } from '~/utils/filters'

/**
 * Composable replacing the Vue 2 cover-image-mixin.
 *
 * Provides reactive cover-image data derived from the selected conference
 * in the Pinia conferences store.
 */
export function useCoverImage() {
  const conferencesStore = useConferencesStore()

  /** Full selected conference object (or false when none selected) */
  const conference = computed(() => {
    try { return conferencesStore.selected }
    catch(e) { return {} }
  })

  /** apps.cbdEvents sub-object from the selected conference */
  const selectedApp = computed(() => {
    try { return conferencesStore.selectedApp }
    catch(e) { return {} }
  })

  /** Standard image URL stored on apps.cbdEvents */
  const getImage = computed(() => {
    try { return selectedApp.value?.image || false }
    catch(e) { return false }
  })

  /** Hero image URL, falling back to getImage when not present */
  const getHeroImage = computed(() => {
    try { return selectedApp.value?.heroImage || getImage.value }
    catch(e) { return getImage.value }
  })

  /** Localised conference title */
  const title = computed(() => {
    try { return lstring(selectedApp.value?.title) }
    catch(e) { return {} }
  })

  return { conference, getImage, getHeroImage, title }
}

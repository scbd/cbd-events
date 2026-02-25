import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import * as filters from '~/utils/filters'

export default defineNuxtPlugin((nuxtApp) => {
  // Keep module-level locale in sync with i18n for lstring()
  if (nuxtApp.$i18n) {
    filters.setLocale(nuxtApp.$i18n.locale.value)
    watch(nuxtApp.$i18n.locale, (val) => filters.setLocale(val))
  }

  return {
    provide: {
      filters
    }
  }
})

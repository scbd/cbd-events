import { defineNuxtPlugin } from '#app'
import localForageStores from '~/composables/use-local-forage'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      localForage: localForageStores,
    },
  }
})

import { defineNuxtPlugin } from '#app'

// Syncs router state — will be wired to Pinia routes store in Phase 03 (p03-01)
export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router

  router.afterEach((to) => {
    // TODO (p03-01): replace with Pinia routes store dispatch
    // const routesStore = useRoutesStore()
    // routesStore.setRoute({ name, path, params, fullPath, query })
    console.debug('[router plugin] navigated to:', to.path)
  })
})

// syncs router to store
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  
  // Note: This will need to be updated when migrating to Pinia
  // For now, keeping Vuex integration
  if (nuxtApp.$pinia || nuxtApp.vueApp.config.globalProperties.$pinia) {
    // Pinia version - will implement when converting stores
    console.warn('Router plugin: Pinia detected but store sync not yet implemented')
  } else {
    // Vuex version (legacy)
    router.afterEach((to) => {
      const { name, path, params, fullPath, query } = to
      const route = { name, path, params, fullPath, query }
      
      // This will work once Vuex is configured
      if (nuxtApp.$store) {
        const prevRoute = nuxtApp.$store.state.routes?.route
        if (!prevRoute) {
          nuxtApp.$store.commit('routes/SET_ROUTE', route)
        } else {
          nuxtApp.$store.commit('routes/SET_PREV_ROUTE', prevRoute)
          nuxtApp.$store.commit('routes/SET_ROUTE', route)
        }
      }
    })
  }
})
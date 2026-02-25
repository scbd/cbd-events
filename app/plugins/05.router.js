import { defineNuxtPlugin } from '#app'
import { useRoutesStore } from '~/stores/routes'

export default defineNuxtPlugin((nuxtApp) => {
  const router      = nuxtApp.$router
  const routesStore = useRoutesStore()

  router.afterEach((to) => {
    routesStore.setRoute({
      name  : to.name,
      path  : to.path,
      params: { ...to.params },
      query : { ...to.query },
    })
  })
})

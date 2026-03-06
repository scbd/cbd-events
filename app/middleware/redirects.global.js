import { useConferencesStore } from '~/stores/conferences'

export default defineNuxtRouteMiddleware(async (to) => {
  const conferencesStore = useConferencesStore()
  const hasRouteParams   = Object.keys(to.params).length

  if (!conferencesStore.selected)
    await conferencesStore.get()

  const { code } = conferencesStore.selected || {}

  if (!hasRouteParams && code)
    return navigateTo(`/${code}`)
})


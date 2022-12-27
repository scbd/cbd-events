export default async function ({ route, redirect, store }){
  const hasRouteParams     = Object.keys(route.params).length
  const isConferenceLoaded = store.state.conferences.selected

  if(isConferenceLoaded) await loadAbout(store)

  if(!isConferenceLoaded) {
    await store.dispatch('conferences/get')
    await loadAbout(store)
  }
  else store.dispatch('conferences/get')

  const { code } = store.state.conferences.selected
  const isAppFistLoad = !hasRouteParams && code

  if(isAppFistLoad) redirect(`/${code}`)
}

async function loadAbout(store){
  const { hasAbout, code } = store.state?.conferences?.selected || {}

  if(!hasAbout) return

  return store.dispatch('about/get', { code })
}


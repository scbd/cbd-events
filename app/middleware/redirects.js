export default async function ({ route, redirect, store }){
  const hasRouteParams     = Object.keys(route.params).length
  const isConferenceLoaded = store.state.conferences.selected

  if(!isConferenceLoaded) 
    await store.dispatch('conferences/get')
  
  await loadAbout(store)
  store.dispatch('conferences/get')

  const { code } = store.state.conferences.selected
  const isAppFirstLoad = !hasRouteParams && code

  if(isAppFirstLoad) redirect(`/${code}`)
}

async function loadAbout(store){
  const { hasAbout, code } = store.state?.conferences?.selected || {}

  if(!hasAbout) return

  store.dispatch('about/get', { code })

  const article = await store.dispatch('article/get', { code });

  return article;
}


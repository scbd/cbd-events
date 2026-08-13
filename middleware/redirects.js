export default async function ({ route, redirect, store }){
  const hasRouteParams     = Object.keys(route.params).length
  const isConferenceLoaded = store.state.conferences.selected

  if(!isConferenceLoaded)
    await store.dispatch('conferences/get').catch((e) => console.error('redirects: failed to load conferences', e))

  await loadAbout(store)
  store.dispatch('conferences/get').catch(() => {})

  const { code } = store.state.conferences.selected || {}
  const isAppFirstLoad = !hasRouteParams && code

  if(isAppFirstLoad) redirect(`/${code}`)
}

async function loadAbout(store){
  const { hasAbout, code } = store.state?.conferences?.selected || {}

  if(!hasAbout) return

  store.dispatch('about/get', { code }).catch(() => {})

  const article = await store.dispatch('article/get', { code }).catch(() => undefined);

  return article;
}


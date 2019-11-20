export default async function ({ route, redirect, store }){
  const hasRouteParams = Object.keys(route.params).length
  const isConferenceLoaded = store.state.conferences.selected

  if(!isConferenceLoaded)
    await store.dispatch('conferences/get')

  const { code } = store.state.conferences.selected
  const isAppFistLoad = !hasRouteParams && code

  if(isAppFistLoad) redirect(`/${code}`)
}

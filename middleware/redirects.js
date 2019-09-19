export default async function ({ route, redirect, store }){
  try{
    const { name } = route
    const hasRouteParams = Object.keys(route.params).length
    const isConferenceLoaded = store.state.conferences.selected

    if(name.includes('offline')) return

    if(!isConferenceLoaded)
      await store.dispatch('conferences/get')

    const { code } = store.state.conferences.selected
    const isAppFistLoad = !hasRouteParams && code

    if(isAppFistLoad) redirect(`/${code}`)
  }
  catch(e){ redirect('/offline') }
}

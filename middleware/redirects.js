export default async function ({ route, redirect, store }){
  //get conferences if we do not have
  if(!store.state.conferences.selected)
    await store.dispatch('conferences/get')

  // this is a hack to fix bug from nuxt-i18n
  // the bug is load in default switch locale then switch back default routes are lost warning
  // reactive values on side menu do not change when locale changes
  // this work around fixes
  if(!store.state.conferences.selected || !store.state.conferences.selectedMeeting) return
  
  const conferenceCode = store.state.conferences.selected.code

  if(!route.name && !Object.keys(route.params).length)
    if(!store.state.i18n.initalized)
      redirect(`/${conferenceCode}`)
}

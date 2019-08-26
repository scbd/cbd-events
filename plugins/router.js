// syncs router to store
export default  ({ app, store }) => {
  const prevRoute = store.state.routes.route

  app.router.afterEach((to) => {
    // eslint-disable-next-line
    const route = { name, path, params, fullPath, query } = to
    
    if(!prevRoute){
      store.commit('routes/SET_ROUTE', route)
    }
    else{
      store.commit('routes/SET_PREV_ROUTE', prevRoute)
      store.commit('routes/SET_ROUTE', route)
    }
  })
}

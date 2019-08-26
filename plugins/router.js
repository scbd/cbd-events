// syncs router to store
export default  ({ app, store }) => {
  const prevRoute = store.state.routes.route

  app.router.afterEach((to) => {
    // eslint-disable-next-line
    const { name, path, params, fullPath, query } = to
    const route = { name, path, params, fullPath, query }
    
    if(!prevRoute){
      store.commit('routes/SET_ROUTE', route)
    }
    else{
      store.commit('routes/SET_PREV_ROUTE', prevRoute)
      store.commit('routes/SET_ROUTE', route)
    }
  })
}

// syncs router to store
export default async ({ app, store }) => {
  app.router.afterEach((to, from) => {
    if(store.state.routes.route)
      store.commit('routes/SET_ROUTE',{name:to.name, path:to.path, params:to.params, fullPath:to.fullPath, guery:to.query })
    else{
      let prev =  store.state.routes.route
      store.commit('routes/SET_PREV_ROUTE',prev)
      store.commit('routes/SET_ROUTE',{name:to.name, path:to.path, params:to.params, fullPath:to.fullPath, guery:to.query })
    }
  })
}

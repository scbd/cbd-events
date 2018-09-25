// syncs router to store
export default async ({ app, store }) => {
  app.router.afterEach((to, from) => {
    if(store.state.routes.route)
      store.commit('routes/SET_ROUTE',to)
    else{
      store.commit('routes/SET_PREV_ROUTE',from)
      store.commit('routes/SET_ROUTE',to)
    }
  })
}

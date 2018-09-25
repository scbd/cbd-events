
export const state  = () =>({
  route: '',
  prevRoute: ''
})

export const mutations = {
  'SET_ROUTE':setRouteMutation,
  'SET_PREV_ROUTE':setPrevRouteMutation
}

function setRouteMutation (state,payLoad){
  state.prevRoute = state.route || state.prevRoute
  state.route = payLoad
}
function setPrevRouteMutation (state,payLoad){
  state.prevRoute = payLoad
}


export const state  = () =>({
  route: '',
  prevRoute: '',
  initialized:false,
  showMeetingNav:false
})

export const mutations = {
  'SET_ROUTE':setRouteMutation,
  'SET_PREV_ROUTE':setPrevRouteMutation,
  'I18N_INIT':setInit,
  'SET_SHOW_MEETING_NAV':setShowMeetingNav
}

function setRouteMutation (state,payLoad){
  state.prevRoute = state.route || state.prevRoute
  state.route = payLoad
}
function setPrevRouteMutation (state,payLoad){
  state.prevRoute = payLoad
}
function setInit(state,payLoad=true){
  state.initialized = payLoad
}
function setShowMeetingNav(state,payLoad=true){
  state.showMeetingNav = payLoad
}


export const state  = () => ({
  route         : '',
  prevRoute     : '',
  initialized   : false,
  showMeetingNav: false,
  showNavs      : true
})

export const mutations = {
  SET_ROUTE           : setRouteMutation,
  SET_PREV_ROUTE      : setPrevRouteMutation,
  I18N_INIT           : setInit,
  SET_SHOW_MEETING_NAV: setShowMeetingNav,
  SET_SHOW_NAVS       : setShowNavs,
  TOGGLE_SHOW_NAVS    : toggleShowNavs
}

function setRouteMutation (state, payLoad){
  state.prevRoute = state.route || state.prevRoute
  state.route = payLoad
}
function setPrevRouteMutation (state, payLoad){
  state.prevRoute = payLoad
}
function setInit(state, payLoad=true){
  state.initialized = payLoad
}
function setShowMeetingNav(state, payLoad=true){
  state.showMeetingNav = payLoad
}
function setShowNavs(state, payLoad=true){
  state.showNavs = payLoad
}
function toggleShowNavs(state){
  state.showNavs = !state.showNavs
}


export const state  = () => ({
  route         : '',
  prevRoute     : '',
  initialized   : false,
  showMeetingNav: false,
  showNavs      : true,
  showSettings  : false
})

export const mutations = {
  SET_ROUTE           : setRouteMutation,
  SET_PREV_ROUTE      : setPrevRouteMutation,
  I18N_INIT           : setInit,
  SET_SHOW_MEETING_NAV: setShowMeetingNav,
  SET_SHOW_NAVS       : setShowNavs,
  TOGGLE_MEETINGS     : toggleMeetings
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
function toggleMeetings(state){
  state.showMeetings = !state.showMeetings
}
// function toggleSettings(state){
//   state.showSettings = !state.showSettings
// }

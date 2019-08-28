
export const state  = () => ({
  isOffLine: false,
  isOnLine : true
})

export const mutations = {
  SET   : setMutation,
  TOGGLE: toggleMutation
}

function setMutation (state, onLine){
  state.isOnLine = onLine
  state.isOffLine = !onLine
}
function toggleMutation (state){
  state.isOnLine = !state.isOnLine
  state.isOffLine = !state.isOffLine
}

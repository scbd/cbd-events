
export const state  = () => ({
  isOffLine: false,
  isOnLine : true
})

export const mutations = {
  SET   : setMutation,
  TOGGLE: toggleMutation
}

export const getters = { isOffLine, isOnLine }

function isOffLine(state){ return state.isOffLine }
function isOnLine(state){ return state.isOnLine }

function setMutation (state, onLine){
  state.isOnLine = onLine
  state.isOffLine = !onLine
}
function toggleMutation (state){
  state.isOnLine = !state.isOnLine
  state.isOffLine = !state.isOffLine
}

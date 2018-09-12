// ============================================================
//
// ============================================================
// initial state
export const state  = () =>({
  route: {
    '/': {
      securityRoles: ['admin', 'root', 'user']
    }

  }
})

// getters
export const getters = {
  routeRoles: routeRoleGetter
}

// ============================================================
//
// ============================================================
function routeRoleGetter (state, getters, rootState) {
  if (rootState.route && state.route[rootState.route.path]) { return state.route[rootState.route.path].securityRoles } else { return false }
}

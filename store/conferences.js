import Vue    from 'vue'
// import api    from '~/modules/api'

//============================================================
//
//============================================================
async function getConferences({state,getters,commit,rootState},data){

    let response='';
    let queryParameters = {
                            f: {"code":1,"Title":1,"MajorEventIDs":1,"StartDate":1,"EndDate":1,"timezone":1,"schedule":1,"venueId":1,"seTiers":1},
                            q: {"timezone":{"$exists":true},"venueId":{"$exists":true}},
                            s: {"StartDate":-1}
                          }

    response = await this.$axios.$get('/api/v2016/conferences', {'params': queryParameters})

    // if(response.status != 200)
    //   responseHandeler (commit, response)

    commit('setConferences',response)

    if(!state.selected)
      if(this.$router.currentRoute.params.conference)
        commit('setSelected',getters.byCode(this.$router.currentRoute.params.conference))
      else
        commit('setSelected',response[0])
}


//============================================================
//
//============================================================
const getByCode = (state) => (code) =>{
  if(!state.docs || !state.docs.length) return false
    return state.docs.find(conf => conf.code===code)
}

//============================================================
//
//============================================================
function setConferencesMutation (state,payLoad){

    state.docs = payLoad
}
//============================================================
//
//============================================================
function setSelectedMutation (state,payLoad){

    state.selected = payLoad
}

export const state  = () =>({
  docs: [],
  selected:false
})

export const actions = {
  get: getConferences
}

export const getters = {
  byCode:getByCode
}

export const mutations = {
  setSelected: setSelectedMutation,
  setConferences:setConferencesMutation
}

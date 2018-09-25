import Vue    from 'vue'
import {normalizeApiResponse}    from '~/modules/apiNormalize'

//============================================================
//
//============================================================
async function getConferences({state,getters,commit,rootState},data){

    if(state.setSelected) return state.docs

    let response='';
    let queryParameters = {
                            f: {"code":1,"Title":1,"MajorEventIDs":1,"StartDate":1,"EndDate":1,"timezone":1,"schedule":1,"venueId":1,"seTiers":1,'Description':1,'conference.image':1,'conference.heroImage':1,'conference.events':1},
                            q: {"timezone":{"$exists":true},"venueId":{"$exists":true}},
                            s: {"StartDate":-1}
                          }


    response = await this.$axios.$get('/api/v2016/conferences', {'params': queryParameters})

    // if(response.status != 200)
    //   responseHandeler (commit, response)
    response = normalizeApiResponse(response, rootState.i18n.locale)
    commit('setConferences',response)

    if(!state.selected)
      if(this.$router.currentRoute.params.conference)
        await commit('setSelected',getters.byCode(this.$router.currentRoute.params.conference))
      else
        await commit('setSelected',response[0])

    await commit('setMeetings',meetings(state.selected))

console.log('meetings(state.selected)',meetings(state.selected))
    return response
}

const getByCode = (state) => (code) =>{
  if(!state.docs || !state.docs.length) return false
    return state.docs.find(conf => conf.code===code)
}

const getMeetings = (state) => () =>{
  let meetings = []
  let events = state.selected.conference.events || []

  for (let i = 0; i < events.length; i++)
    meetings = meetings.concat(events[i].menus||[])

  return meetings
}

function meetings (selected) {
  let meetings = []
  let events = selected.conference.events || []

  for (let i = 0; i < events.length; i++)
    meetings = meetings.concat(events[i].menus||[])

  return meetings
}

function setConferencesMutation (state,payLoad){
    state.docs = payLoad
}

function setSelectedMeetingMutation (state,payLoad){

  state.selectedMeeting = payLoad
}
function setSelectedMutation (state,payLoad){

  state.selected = payLoad
}
function setMeetingsMutation (state,payLoad){

  state.meetings = payLoad
}
export const state  = () =>({
  docs: [],
  selected:false,
  selectedMeeting:false,
  meetings:[]
})

export const actions = {
  get: getConferences
}

export const getters = {
  byCode:getByCode,
  getMeetings:getMeetings
}

export const mutations = {
  setSelected: setSelectedMutation,
  setSelectedMeeting: setSelectedMeetingMutation,
  setConferences:setConferencesMutation,
  setMeetings:setMeetingsMutation,
}

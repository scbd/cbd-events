import Vue    from 'vue'
import {normalizeApiResponse}    from '~/modules/apiNormalize'


async function getConferences({state,dispatch,commit,rootState},data){

    if(state.setSelected) return state.docs

    
    commit('SET_MEETINGS',response)
    if(!state.selected)
      if(this.$router.currentRoute.params.conference)
        commit('setSelected',getters.byCode(this.$router.currentRoute.params.conference))
      else
        commit('setSelected',getActive(response))

    await dispatch('getMeetings', state.selected)

    return response
}

async function getAgenda({state,commit,rootState}){
  let response = '';
  let queryParameters = {
                          f: {"agenda":1},
                          q: {'_id':{$oid:state.selectedMeeting.id}}
                        }

  response = await this.$axios.$get('/api/v2016/meetings', {'params': queryParameters})
  state.selectedMeeting.agenda = response[0].agenda
}

function getMeetings({state,commit,rootState}){
   let meetingCode = rootState.routes.route.params.meetingCode

  commit('setMeetings',meetings(state.selected))
  if(!state.selectedMeeting){
    let selected = state.meetings.find(meeting => meeting.code===meetingCode)
    commit('setSelectedMeeting',selected || state.meetings[0])
  }
  // for (let i = 0; i < .length; i++) {
  //   array[i]
  // }
  return state.meetings
}

const getByCode = (state) => (code) =>{
  if(!state.docs || !state.docs.length) return false
    return state.docs.find(conf => conf.code===code)
}

// const getMeetings = (state) => () =>{
//   let meetings = []
//   let events = state.selected.conference.events || []
//
//   for (let i = 0; i < events.length; i++)
//     meetings = meetings.concat(events[i].menus||[])
//
//   return meetings
// }

function hasMeetings (docs) {
  for (let i = 0; i < docs.length; i++) {
    if(!docs[i].conference) continue
    let meetings = []
    //
    let events = docs[i].conference.events || []

    for (let j = 0; j < events.length; j++)
      if(events[j] && events[j].menus)
        meetings = meetings.concat([events[j]])

    docs[i].hasMeetings = !!meetings.length
  }
  return docs
}

function meetings (selected) {
  let meetings = []
  if(!selected.conference) return meetings
  let events = selected.conference.events || []

  for (let i = 0; i < events.length; i++)
    meetings = meetings.concat(events[i].menus||[])

  return meetings
}


function setSelectedMutation (state,payLoad){
  state.selected = payLoad
}

export const state  = () =>({
  docs: [],
  selected:false,
  selectedMeeting:false,
})

export const actions = {
  get: getMeetings
}

export const getters = {
  byCode:getByCode
}

export const mutations = {
  setSelected: setSelectedMutation,
  setMeetings:setMeetingsMutation,
}

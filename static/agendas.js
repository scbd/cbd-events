import Vue    from 'vue'
import {normalizeApiResponse}    from '~/modules/apiNormalize'


async function getConferences({state,dispatch,commit,rootState},data){

    if(state.setSelected) return state.docs

    let response='';
    let queryParameters = {
                            f: {"code":1,"Title":1,"MajorEventIDs":1,"StartDate":1,"EndDate":1,"timezone":1,"schedule":1,"venueId":1,"seTiers":1,'Description':1,'conference.image':1,'conference.heroImage':1,'conference.CBDMeet':1,'conference.events':1,'schedule':1},
                            q: {"timezone":{"$exists":true},"venueId":{"$exists":true}},
                            s: {"StartDate":-1}
                          }

    response = await this.$axios.$get('/api/v2016/conferences', {'params': queryParameters})

    // if(response.status != 200)
    //   responseHandeler (commit, response)
    response = normalizeApiResponse(response, rootState.i18n.locale)
    response = hasMeetings(response )
    
    commit('setConferences',response)
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

function getActive (conferences){
  return conferences.find((c)=>c.active) || conferences[0]
}

function setConferencesMutation (state,payLoad){
    state.docs = payLoad
}

function setSelectedMeetingMutation (state,payLoad){
  state.selectedMeeting = payLoad
}

function setSelectedMutation (state,payLoad){
  state.selectedMeeting = false
  state.meetings = []
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
  get: getConferences,
  getMeetings: getMeetings,
  getAgenda: getAgenda
}

export const getters = {
  byCode:getByCode
}

export const mutations = {
  setSelected: setSelectedMutation,
  setSelectedMeeting: setSelectedMeetingMutation,
  setConferences:setConferencesMutation,
  setMeetings:setMeetingsMutation,
}

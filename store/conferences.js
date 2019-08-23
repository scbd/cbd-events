import   Vue                    from 'vue'
import { normalizeApiResponse } from '~/modules/apiNormalize'



function queryConferences($axios, { locale='en' }) {

  let queryParameters = {
                          f: { 'code':1 ,'Title':1, 'MajorEventIDs':1, 'StartDate':1, 'EndDate':1, 'timezone':1, 'Description':1, 'apps.cbdEvents':1, 'conference':1 },
                          q: { 'apps.cbdEvents':{ '$exists':true } },
                          s: { 'StartDate':-1 }
                        }

  return  $axios.$get(`${process.env.API}/api/v2016/conferences`, { 'params': queryParameters })
          .then(response => normalizeApiResponse(response, locale))
          .then(response => hasMeetings(response))
}

function initSelectedConference({ state, commit }, {conference}, response){
  if(!state.selected)
    if(conference)
      commit('setSelected',byCode(state)(conference))
    else
      commit('setSelected',getActive(response))
}

async function getConferences({ state, dispatch, commit, rootState },data){

    if(state.selected) return state.docs

    let response = await queryConferences(this.$axios, rootState.i18n)

    commit('setConferences', response)

    initSelectedConference({ state, commit }, this.$router.currentRoute.params, response)

    await dispatch('getMeetings', state.selected)

    return response
}

async function getMeetings({ state, commit, rootState }){

  commit('setMeetings', await queryMeetings(this.$axios, state.selected, rootState.i18n))

  let { meetingCode } = rootState.routes.route.params
  initSelectedMeeting({ state, commit }, meetingCode)

  return state.meetings
}

function initSelectedMeeting({ state, commit }, meetingCode) {
  if(!state.selectedMeeting && Array.isArray(state.meetings)){
    let selected = state.meetings.find(meeting => meeting.code===meetingCode)
    commit('setSelectedMeeting',selected || state.meetings[0])
  }
}

function queryMeetings ($axios, selected, locale='en') {

  let { conference, majorEventIDs, apps } = selected
  let { useMenus } = apps.cbdEvents

  if(useMenus && !conference.menus ) return []
  if(!useMenus && !majorEventIDs) return []

  let queryParameters = useMenus? generateParamsByMenu(conference.menus) : generateParamsById(majorEventIDs)

  return $axios.$get(`${ process.env.API }/api/v2016/meetings`, { params:queryParameters })
          .then(response => { if(!Array.isArray(response)) return [response]})
          .then(response => normalizeApiResponse(response, locale))
          .then(response => {
            if(!useMenus) return response
            
            for (let i = 0; i < response.length; i++) {
              let { code } = response[i]
              let menuMatch = conference.menus.find( menu => menu.code === code)
              if(menuMatch)
                response[i] = Object.assign({},response[i], menuMatch)
            }
            return response
          })

}

const MEETING_QUERY_PARAMS = {
                            f : { 'EVT_CD':1, 'title':1, 'EVT_UN_CD':1, links:1, 'EVT_INFO_PART_URL':1, insession:1, agenda:1 },
                            fo: 1
                          };

function generateParamsById(majorEventIDs){
  let oids = []
  for (let i = 0; i < majorEventIDs.length; i++) 
    oids.push({ '$oid':majorEventIDs[i] })
  
  return Object.assign({}, { q:{ '_id':{ $in:oids } } }, MEETING_QUERY_PARAMS)
}

function generateParamsByMenu(menus){
  let menusCopy = JSON.parse(JSON.stringify(menus))
  menusCopy = flatten(menusCopy)
  
  let codes = menusCopy.map(m => m.code)

    
  return Object.assign({}, { q:{ 'code':{ $in:codes} } }, MEETING_QUERY_PARAMS)
}

function flattenMenus(items) {
  const flat = []

  items.forEach(item => {
                          if (Array.isArray(item.menus))
                            flat.push(...flatten(item.menus))
                          else 
                            flat.push(item)
                          
                        })

  return flat
}

function getLegacyMeetingsIDs (selected) {
  let meetings = []
  if(!selected.conference) return meetings
  let events = selected.conference.events || []

  for (let i = 0; i < events.length; i++)
      meetings = meetings.concat(events[i].menus||[])
  
  return meetings.filter(meet=> meet.id).map(m => m.id)
}

const byCode = (state) => (code) =>{
  if(!state.docs || !state.docs.length) return false
    return state.docs.find(conf => conf.code===code)
}

//checks is conference has major meetings defined by  majorEventIDs by default or conference.menus
function hasMeetings (docs) {
  
  for (let i = 0; i < docs.length; i++) {
    
    let { conference, majorEventIDs, apps } = docs[i]
    let { useMenus } = apps.cbdEvents
    let menus = conference.menus || conference.events.filter((e) => e.menus)

    if(useMenus && !menus) continue 

    if(!useMenus && !majorEventIDs) continue 

    let meetings =  useMenus? menus : majorEventIDs

    docs[i].hasMeetings = !!meetings.length
  }
  return docs
}

function getActive (conferences){ return conferences.find((c)=>c.active) || conferences[0] }

function setSelected (state, payLoad){
  state.selectedMeeting = false
  state.meetings = []
  state.selected = payLoad
}

function setConferences     (state, payLoad){ state.docs = payLoad }
function setSelectedMeeting (state, payLoad){ state.selectedMeeting = payLoad }
function setMeetings        (state, payLoad){ state.meetings = payLoad }


export const state     = () => ({ docs: [], selected:false, selectedMeeting:false, meetings:[] })
export const actions   = { get: getConferences, getMeetings}
export const getters   = { byCode }
export const mutations = { setSelected, setSelectedMeeting, setConferences, setMeetings }
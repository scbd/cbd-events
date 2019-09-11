import { normalizeApiResponse } from '~/modules/apiNormalize'
import { DateTime             } from 'luxon'

// ACTIONS
async function getConferences({ state, dispatch, commit, rootState }){
  if(state.selected) return state.docs

  const { $axios         } = this
  const { conferenceCode } = this.$router.currentRoute.params
  const   response         = await queryConferences(this.$axios, rootState.i18n)

  commit('setConferences', response)
  
  await initSelectedConference({ $axios, state, commit }, { conferenceCode, response })

  await dispatch('getMeetings')

  return response
}

async function getMeetings({ state, commit, rootState }){
  const meetings = await queryMeetings(this.$axios, state.selected, rootState.i18n)

  commit('setMeetings', meetings)

  const { meetingCode } = rootState.routes.route.params

  initSelectedMeeting({ state, commit }, meetingCode)

  return state.meetings
}


//GETTERS
const byCode = (state) => (code) => {
  if(!state.docs || !state.docs.length) return false
  return state.docs.find(conf => conf.code===code)
}

const selectedApp = (state) => {
  try{ return state.selected.apps.cbdEvents }
  catch(e){ return {} }
}

const meetingCode = (state) => {
  try{ return state.selectedMeeting.evtCd }
  catch(e){ return {} }
}

const startDate = (state) => {
  const { startDate, endDate } = state.selected

  const start         = DateTime.fromISO(startDate).startOf('day')
  const end           = DateTime.fromISO(endDate).endOf('day')
  const now           = DateTime.local().startOf('day')

  if(now < start) return start.toISODate()
  if(now > end)   return start.toISODate()

  return now.toUTC().toISODate()
}

function conference (state){
  try{ return state.selected }
  catch(e){ return {} }
}
function conferenceId (state){
  try{ return state.selected.id }
  catch(e){ return {} }
}
function meeting (state){
  try{ return state.selectedMeeting }
  catch(e){ return {} }
}

function agendaItems (state){
  try{ return state.selectedMeeting.agenda.items }
  catch(e){ return [] }
}

function agendaPrefix (state){
  try{ return state.selectedMeeting.agenda.prefix }
  catch(e){ return {} }
}

function agenda (state){
  try{ return state.selectedMeeting.agenda }
  catch(e){ return {} }
}

const forceDate = () => (datetime) => {
  if(isValidDate(datetime)) return `&datetime=${datetime}`
  return ''
}

function isInSession(state){
  return function(datetime){
    try{
      const { startDate, endDate, timezone }  = state.selected

      
      const cStart          = DateTime.fromISO(startDate)
      const cEnd            = DateTime.fromISO(endDate)
      const now             = DateTime.local().setZone(timezone)

      console.log(datetime)
      if((cStart <= now && now <= cEnd) || isValidDate(datetime))
        return true
    
      return false
    }
    catch(e){ return false }
  }
}

//MUTATIONS
function setSelected (state, payLoad){
  state.selectedMeeting = false
  state.meetings = []
  state.selected = { ...{}, ...payLoad }
}

function setConferences     (state, payLoad = []){ state.docs = payLoad }
function setSelectedMeeting (state, payLoad = {}){ state.selectedMeeting = payLoad }
function setMeetings        (state, payLoad = {}){ state.meetings = payLoad }

export const state     = () => ({ docs: [], selected: false, selectedMeeting: false, meetings: [] })
export const actions   = { get: getConferences, getMeetings }
export const getters   = { conference, meeting, byCode, selectedApp, meetingCode, startDate, isInSession, forceDate, agendaItems, agenda, agendaPrefix, conferenceId }
export const mutations = { setSelected, setSelectedMeeting, setConferences, setMeetings }


function isValidDate(date){ return !isNaN(new Date(date).getTime()) }
function getActive (conferences){ return conferences.find((c) => c.active) || conferences[0] }

function queryConferences($axios, { locale='en' }){
  const queryParameters = {
    //title: 1, timezone: 1, Description: 1,
    f: {  code: 1,  MajorEventIDs: 1, StartDate: 1, EndDate: 1,  'apps.cbdEvents': 1, conference: 1, schedule: 1, timezone: 1  },
    q: { 'apps.cbdEvents': { $exists: true } },
    s: { StartDate: -1 }
  }

  return  $axios.$get(`${process.env.API}/api/v2016/conferences`, { params: queryParameters })
    .then(response => normalizeApiResponse(response, locale))
    .then(response => hasMeetings(response))
}

async function loadBlobs($axios, conference){
  const { cbdEvents }             = conference.apps
  const { heroImage, image }      = cbdEvents

  cbdEvents.heroImageBlob = await getBlob($axios, heroImage)
  cbdEvents.imageBlob     = await getBlob($axios, image)

  return conference
}


async function initSelectedConference({ $axios, state, commit }, { conferenceCode, response }){
  if(state.selected) return
  let conference

  if(conferenceCode)
    conference = byCode(state)(conferenceCode)
  else
    conference = getActive(response)

  conference = await loadBlobs($axios, conference)

  commit('setSelected', conference)
}

function getBlob($axios, url){
  if(!url) return undefined

  const restParams = { method: 'get', url, responseType: 'blob' }

  return $axios(restParams).then((res) => res.data)
}

function hasNoMenus({ apps, conference, majorEventIDs }){
  const { useMenus } = apps.cbdEvents
  const menus        = extractMenus(conference)

  if(useMenus && !menus) return true

  if(!useMenus && !majorEventIDs) true
}

function extractMenus(conference){
  return conference.menus || conference.events.filter((e) => e.menus) || []
}

function extractMeetingsFromMenus({ apps, conference, majorEventIDs }){
  const { useMenus } = apps.cbdEvents
  const menus        = extractMenus(conference)
  const meetings     = useMenus? menus : majorEventIDs

  return meetings
}

//checks is conference has major meetings defined by  majorEventIDs by default or conference.menus
function hasMeetings (docs){
  for (let i = 0; i < docs.length; i++){
    if(hasNoMenus(docs[i])) continue

    const meetings = extractMeetingsFromMenus(docs[i])

    docs[i].hasMeetings = !!meetings.length
  }

  return docs
}

function flattenMenus(items){
  const flat = []

  items.forEach(item => {
    if (Array.isArray(item.menus))
      flat.push(...flattenMenus(item.menus))
    else
      flat.push(item)
  })

  return flat
}

const MEETING_QUERY_PARAMS = {
  f: { EVT_CD: 1, title: 1, EVT_UN_CD: 1, links: 1, EVT_INFO_PART_URL: 1, insession: 1, agenda: 1 }
}

function generateParamsById(majorEventIDs){
  const oids = []

  for (let i = 0; i < majorEventIDs.length; i++)
    oids.push({ $oid: majorEventIDs[i] })
  
  return Object.assign({}, { q: { _id: { $in: oids } } }, MEETING_QUERY_PARAMS)
}

function generateParamsByMenu(menus){
  let menusCopy = JSON.parse(JSON.stringify(menus))

  menusCopy = flattenMenus(menusCopy)
  
  const codes = menusCopy.map(m => m.code)

    
  return Object.assign({}, { q: { code: { $in: codes } } }, MEETING_QUERY_PARAMS)
}

function dataExists({ conference, majorEventIDs }, useMenus=false){
  if(useMenus && !conference.menus) return false
  if(!useMenus && !majorEventIDs)   return false

  return true
}


//MEETINGS
function queryMeetings ($axios, selected, locale='en'){
  const { conference, majorEventIDs, apps } = selected
  const { useMenus }                        = apps.cbdEvents


  if(!dataExists(selected, useMenus)) return []

  const queryParameters = useMenus? generateParamsByMenu(conference.menus) : generateParamsById(majorEventIDs)

 
  return $axios.$get(`${ process.env.API }/api/v2016/meetings`, { params: queryParameters })
    .then(response => {
      console.log('~~~~response', response)
      if(!Array.isArray(response)) response = [ response ]
      return normalizeApiResponse(response, locale)
    })
    .then(response => {
      if(!useMenus) return response
            
      for (let i = 0; i < response.length; i++){
        const { code }  = response[i]
        const menuMatch = conference.menus.find(menu => menu.code === code)

        if(menuMatch)
          response[i] = Object.assign({}, response[i], menuMatch)
      }
      return response
    })
}

function initSelectedMeeting({ state, commit }, meetingCode){
  if(state.selectedMeeting) return

  const selected = state.meetings.find(meeting => meeting.code===meetingCode)

  commit('setSelectedMeeting', selected || state.meetings[0])
}
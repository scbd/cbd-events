import { normalizeApiResponse } from '~/modules/apiNormalize'

function queryConferences($axios, { locale='en' }){
  const queryParameters = {
    //title: 1, timezone: 1, Description: 1,
    f: {  code: 1,  MajorEventIDs: 1, StartDate: 1, EndDate: 1,  'apps.cbdEvents': 1, conference: 1, schedule: 1 },
    q: { 'apps.cbdEvents': { $exists: true } },
    s: { StartDate: -1 }
  }

  return  $axios.$get(`${process.env.API}/api/v2016/conferences`, { params: queryParameters })
    .then(response => normalizeApiResponse(response, locale))
    .then(response => hasMeetings(response))
}

async function loadBlobs($axios, conference){
  const { coverImage, image } = conference
  const   coverImageBlob      = await getBlob($axios, coverImage)
  const   imageBlob           = await getBlob($axios, image)

  return { coverImageBlob, imageBlob, ...conference }
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
  commit('setMeetings', await queryMeetings(this.$axios, state.selected, rootState.i18n))

  const { meetingCode } = rootState.routes.route.params

  initSelectedMeeting({ state, commit }, meetingCode)

  return state.meetings
}

function initSelectedMeeting({ state, commit }, meetingCode){
  if(state.selectedMeeting || Array.isArray(state.meetings)) return

  const selected = state.meetings.find(meeting => meeting.code===meetingCode)

  commit('setSelectedMeeting', selected || state.meetings[0])
}

function queryMeetings ($axios, selected, locale='en'){
  const { conference, majorEventIDs, apps } = selected
  const { useMenus }                        = apps.cbdEvents

  if(!dataExists(selected, useMenus)) return []

  const queryParameters = useMenus? generateParamsByMenu(conference.menus) : generateParamsById(majorEventIDs)

  return $axios.$get(`${ process.env.API }/api/v2016/meetings`, { params: queryParameters })
    .then(response => {
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

function dataExists({ conference, majorEventIDs }, useMenus){
  if(useMenus && !conference.menus) return false
  if(!useMenus && !majorEventIDs)   return false

  return true
}

const MEETING_QUERY_PARAMS = {
  f : { EVT_CD: 1, title: 1, EVT_UN_CD: 1, links: 1, EVT_INFO_PART_URL: 1, insession: 1, agenda: 1 },
  fo: 1
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

const byCode = (state) => (code) => {
  if(!state.docs || !state.docs.length) return false
  return state.docs.find(conf => conf.code===code)
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

function extractMenus(conference){
  return conference.menus || conference.events.filter((e) => e.menus) || []
}

function extractMeetingsFromMenus({ apps, conference, majorEventIDs }){
  const { useMenus } = apps.cbdEvents
  const menus        = extractMenus(conference)
  const meetings     = useMenus? menus : majorEventIDs

  return meetings
}

function hasNoMenus({ apps, conference, majorEventIDs }){
  const { useMenus } = apps.cbdEvents
  const menus        = extractMenus(conference)

  if(useMenus && !menus) return true

  if(!useMenus && !majorEventIDs) true
}

function getActive (conferences){ return conferences.find((c) => c.active) || conferences[0] }

function setSelected (state, payLoad){
  state.selectedMeeting = false
  state.meetings = []
  state.selected = payLoad
}

function setConferences     (state, payLoad){ state.docs = payLoad }
function setSelectedMeeting (state, payLoad){ state.selectedMeeting = payLoad }
function setMeetings        (state, payLoad){ state.meetings = payLoad }

function getBlob($axios, url){
  if(!url) return undefined

  const restParams = { method: 'get', url, responseType: 'blob' }

  return $axios(restParams).then((res) => {
    console.log(`${url}---`, res.data)
    return res.data
  })
}

export const state     = () => ({ docs: [], selected: false, selectedMeeting: false, meetings: [] })
export const actions   = { get: getConferences, getMeetings }
export const getters   = { byCode }
export const mutations = { setSelected, setSelectedMeeting, setConferences, setMeetings }
import { defineStore    } from 'pinia'
import { ref, computed  } from 'vue'
import { useNuxtApp     } from '#app'
import { DateTime       } from 'luxon'
import   useHttp          from '~/composables/http'
import   queryFilter      from '~/composables/query-filter'
import { normalizeApiResponse } from '~/utils/api-normalize'
import { useRoutesStore } from '~/stores/routes'

// ---------------------------------------------------------------------------
// Module-level helpers (pure — no this, no store refs)
// ---------------------------------------------------------------------------

function isValidDate(date){ return !isNaN(new Date(date).getTime()) }
function getActive(conferences){ return conferences.find((c) => c.active) || conferences[0] }

function flattenMenus(items){
  const flat = []

  items.forEach(item => {
    if(Array.isArray(item.menus))
      flat.push(...flattenMenus(item.menus))
    else
      flat.push(item)
  })

  return flat
}

function extractMenus(conference){
  return conference.menus || conference?.events?.filter((e) => e.menus) || []
}

function hasNoMenus({ apps, conference, majorEventIds }){
  const { useMenus } = apps.cbdEvents
  const menus        = extractMenus(conference)

  if(useMenus  && !menus)          return true
  if(!useMenus && !majorEventIds)  return true

  return false
}

function extractMeetingsFromMenus({ apps, conference, majorEventIds }){
  const { useMenus } = apps.cbdEvents
  const menus        = extractMenus(conference)

  return useMenus ? menus : majorEventIds
}

function hasMeetings(docs){
  for(let i = 0; i < docs.length; i++){
    if(hasNoMenus(docs[i])) continue

    const meetings    = extractMeetingsFromMenus(docs[i]) || []

    docs[i].hasMeetings = !!meetings.length
  }

  return docs
}

const MEETING_QUERY_PARAMS = {
  f: { EVT_CD: 1, title: 1, EVT_UN_CD: 1, links: 1, EVT_INFO_PART_URL: 1, insession: 1, agenda: 1 }
}

function generateParamsById(majorEventIds = []){
  const oids = majorEventIds.map(id => ({ $oid: id }))

  return Object.assign({}, { q: { _id: { $in: oids } } }, MEETING_QUERY_PARAMS)
}

function generateParamsByMenu(menus){
  const menusCopy = JSON.parse(JSON.stringify(menus))
  const flat      = flattenMenus(menusCopy)
  const codes     = flat.map(m => m.code)

  return Object.assign({}, { q: { code: { $in: codes } } }, MEETING_QUERY_PARAMS)
}

function dataExists({ conference, majorEventIds }, useMenus = false){
  if(useMenus  && !conference.menus) return false
  if(!useMenus && !majorEventIds)    return false

  return true
}

// ---------------------------------------------------------------------------
// HTTP helpers — accept $axios explicitly so they are testable
// ---------------------------------------------------------------------------

function getBlob(url, $axios){
  if(!url) return undefined

  return useHttp({ method: 'get', url, responseType: 'blob' }, $axios)
}

async function loadBlobs(conference, $axios){
  if(!conference?.apps)          conference.apps           = { cbdEvents: {} }
  if(!conference.apps.cbdEvents) conference.apps.cbdEvents = {}

  const { cbdEvents }        = conference.apps
  const { heroImage, image } = cbdEvents

  cbdEvents.heroImageBlob = await getBlob(heroImage, $axios)
  cbdEvents.imageBlob     = await getBlob(image, $axios)

  return conference
}

function queryConferences($axios, locale = 'en'){
  const params = queryFilter({
    q: { 'apps.cbdEvents': { $exists: true } },
    s: { StartDate: -1 }
  })
  const url = `${process.env.NUXT_ENV_API}/api/v2016/conferences`

  return useHttp({ url, method: 'get', responseType: 'json', params }, $axios)
    .then(data => normalizeApiResponse(data, locale))
    .then(data => hasMeetings(data))
}

function queryMeetings($axios, selected, locale = 'en'){
  const { conference, majorEventIds, apps } = selected
  const { useMenus }                        = apps.cbdEvents

  if(!dataExists(selected, useMenus)) return []

  const url    = `${process.env.NUXT_ENV_API}/api/v2016/meetings`
  const params = queryFilter(useMenus ? generateParamsByMenu(conference.menus) : generateParamsById(majorEventIds))

  return useHttp({ url, method: 'get', responseType: 'json', params }, $axios)
    .then(data => {
      if(!Array.isArray(data)) data = [ data ]

      return normalizeApiResponse(data, locale)
    })
    .then(response => {
      if(!useMenus) return response

      for(let i = 0; i < response.length; i++){
        const { code }  = response[i]
        const menuMatch = conference.menus.find(menu => menu.code === code)

        if(menuMatch)
          response[i] = Object.assign({}, response[i], menuMatch)
      }

      return response
    })
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useConferencesStore = defineStore('conferences', () => {
  // State
  const docs             = ref([])
  const selected         = ref(false)
  const selectedMeeting  = ref(false)
  const meetings         = ref([])

  // ---------------------------------------------------------------------------
  // Computed getters
  // ---------------------------------------------------------------------------

  const conference = computed(() => {
    try{ return selected.value }
    catch(e){ return {} }
  })

  const meeting = computed(() => {
    try{ return selectedMeeting.value }
    catch(e){ return {} }
  })

  const selectedApp = computed(() => {
    try{ return selected.value.apps.cbdEvents }
    catch(e){ return {} }
  })

  const conferenceId = computed(() => {
    try{ return selected.value.id }
    catch(e){ return {} }
  })

  const meetingCode = computed(() => {
    try{
      if(!selectedMeeting.value) return {}
      return selectedMeeting.value.evtCd
    }
    catch(e){ return {} }
  })

  const startDate = computed(() => {
    try{
      if(!selected.value) return null

      const { startDate: sd, endDate: ed } = selected.value

      const start = DateTime.fromISO(sd).startOf('day')
      const end   = DateTime.fromISO(ed).endOf('day')
      const now   = DateTime.local().startOf('day')

      if(now < start) return start.toISODate()
      if(now > end)   return start.toISODate()

      return now.toUTC().toISODate()
    }
    catch(e){ return null }
  })

  const showCalendar = computed(() => {
    try{
      const { hideCalendar } = selected.value?.apps?.cbdEvents

      return !hideCalendar
    }
    catch(e){
      console.error(e)

      return true // default show
    }
  })

  const conferenceCal = computed(() => {
    try{ return selected.value.apps.conferenceCal }
    catch(e){ return undefined }
  })

  const agendaItems = computed(() => {
    try{ return selectedMeeting.value.agenda.items }
    catch(e){ return [] }
  })

  const agendaPrefix = computed(() => {
    try{ return selectedMeeting.value.agenda.prefix }
    catch(e){ return {} }
  })

  const agenda = computed(() => {
    try{ return selectedMeeting.value.agenda }
    catch(e){ return {} }
  })

  // Parameterised helpers returned as functions (mirrors original getter factories)

  function byCode(code){
    if(!docs.value || !docs.value.length) return false

    return docs.value.find(conf => conf.code === code) || false
  }

  function isInSession(datetime){
    try{
      if(!selected.value) return false

      const { startDate: sd, endDate: ed, timezone, active } = selected.value

      if(active) return true

      const cStart = DateTime.fromISO(sd)
      const cEnd   = DateTime.fromISO(ed)
      const now    = DateTime.local().setZone(timezone)

      if((cStart <= now && now <= cEnd) || isValidDate(datetime))
        return true

      return false
    }
    catch(e){ return false }
  }

  function forceDate(datetime){
    if(isValidDate(datetime)) return `&datetime=${datetime}`

    return ''
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async function get(conferenceCode){
    if(selected.value) return docs.value

    const { $axios, $i18n } = useNuxtApp()
    const locale            = $i18n?.locale?.value ?? 'en'

    const response = await queryConferences($axios, locale)

    docs.value = response

    // Initialise selected conference
    let conf = conferenceCode ? byCode(conferenceCode) : getActive(response)

    conf          = await loadBlobs(conf, $axios)
    selected.value = conf

    await getMeetings()

    return response
  }

  async function getMeetings(){
    if(!selected.value) return []

    const { $axios, $i18n } = useNuxtApp()
    const locale            = $i18n?.locale?.value ?? 'en'
    const routesStore       = useRoutesStore()
    const mc                = routesStore.meetingCode

    const result  = await queryMeetings($axios, selected.value, locale)

    meetings.value = result

    // Initialise selected meeting
    if(!selectedMeeting.value){
      const found = mc ? meetings.value.find(m => m.code === mc) : undefined

      selectedMeeting.value = found || meetings.value[0] || false
    }

    return meetings.value
  }

  function setSelected(conf){
    selectedMeeting.value = false
    meetings.value        = []
    selected.value        = conf ? { ...conf } : false
  }

  function setSelectedMeeting(m = {}){
    selectedMeeting.value = m
  }

  function clearAll(){
    selectedMeeting.value = false
    meetings.value        = []
    docs.value            = []
    selected.value        = false
  }

  return {
    // State
    docs, selected, selectedMeeting, meetings,
    // Getters
    conference, meeting, selectedApp, conferenceId, meetingCode, startDate,
    showCalendar, conferenceCal, agendaItems, agendaPrefix, agenda,
    // Function-returning helpers
    byCode, isInSession, forceDate,
    // Actions
    get, getMeetings, setSelected, setSelectedMeeting, clearAll
  }
})

<template>
  <CalendarWidget
    :options="{ queryFn: getEvents, conference: conference, height: '80vh' }"
  />
</template>

<script setup>
import { storeToRefs         } from 'pinia'
import { $fetch              } from 'ofetch'
import { useConferencesStore } from '~/stores/conferences'
import { useRoutesStore      } from '~/stores/routes'
import { sanitizeIndexResult } from '~/utils/api-normalize'
import   CalendarWidget        from '~/components/calendar/src/components/index.vue'

const config           = useRuntimeConfig()
const { locale }       = useI18n()
const conferencesStore = useConferencesStore()
const routesStore      = useRoutesStore()

const { conference } = storeToRefs(conferencesStore)

routesStore.setShowMeetingNav(false)

function genFields(query) {
  const loc             = (query.locale || '').toUpperCase() || 'EN'
  const fields          = 'identifier_s,conference_s,timezone_s,start_dt,end_dt,'
  const itemFields      = 'itemShowFiles_ss,itemFiles_ss,itemText_ss,item_ss,itemMeeting_ss,stream_ss,'
  const organizerFields = 'organizers_ss,organizer_s,organizerEmail_s,'
  const locationFields  = 'roomTitle_s,roomLocation_s,roomLocalName_s,'
  const localizedFields = `description_${loc}_t,title_${loc}_t,`
  const metaFields      = 'createdBy_s,createdByEmail_s,createdDate_dt,modifiedBy_s,modifiedByEmail_s,updatedDate_dt'

  return fields + itemFields + organizerFields + locationFields + localizedFields + metaFields
}

function genQuery(query) {
  const { start, end, selectedStream, keyWordFilter, selectedProgramme } = query
  const { start: startOverride, end: endOverride } = conference.value?.apps?.cbdEvents || {}
  const { startDate, endDate, id }                  = conference.value

  let qStart = `+AND+(start_s:[ ${startOverride || startDate} TO *])`
  let qEnd   = `+AND+(end_s:[ * TO ${endOverride || endDate}])`
  let q      = `schema_s:reservation+AND+conference_s:${id}`

  if (start) qStart = `+AND+(start_s:[ ${start} TO *])`
  if (end)   qEnd   = `+AND+(end_s:[ * TO ${end}])`

  q += qStart + qEnd

  if (selectedStream)    q += `+AND+(stream_ss:${selectedStream})`
  if (selectedProgramme) q += `+AND+(thematicAreas_ss:${selectedProgramme})`
  if (keyWordFilter)     q += `+AND+(text_${locale.value.toUpperCase()}_txt:"${keyWordFilter}*")`

  return q
}

function getQueryUrl(query) {
  const endPoint = `${config.public.api}/api/v2013/index/select`
  const f        = genFields(query)
  const q        = genQuery(query)

  return encodeURI(`${endPoint}?fl=${f}&q=${q}&sort=start_dt+DESC&start=0&wt=json&rows=5000`)
}

async function getEvents(query) {
  routesStore.setShowMeetingNav(false)
  try {
    if (!query.conference) query.conference = conference.value.id

    const events = {}
    const url    = getQueryUrl(query)
    const data   = await $fetch(url)

    events.raw = sanitizeIndexResult(data.response.docs)

    return events
  } catch(e) {
    console.error('Calendar.getEvents', e.message)
    console.error(e)
  }
}
</script>

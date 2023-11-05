<template>
  <Calendar
    :options="{ queryFn:getEvents, conference:conference, height:'80vh' }"
  />
</template>

<script>
import useHttp from '~/composables/http';
import { mapGetters          } from 'vuex'
import { sanitizeIndexResult } from '~/modules/apiNormalize'
import   Calendar              from '~/components/Calender/src/components/'

export default {
  name      : 'Calender',
  components: { Calendar },
  methods   : { getEvents, genQuery, getQueryUrl },
  computed  : { ...gettersMap() },
  asyncData
}

function gettersMap(){
  return mapGetters({
    meeting     : 'conferences/meeting',
    conference  : 'conferences/conference',
    conferenceId: 'conferences/conferenceId'
  })
}

function asyncData ({ store }){
  store.commit('routes/SET_SHOW_MEETING_NAV', false)
  return { }
}

function genFields(query){
  const locale          = query.locale.toUpperCase()|| 'EN'
  const fields          = 'identifier_s,conference_s,timezone_s,start_dt,end_dt,'
  const itemFields      = 'itemShowFiles_ss,itemFiles_ss,itemText_ss,item_ss,itemMeeting_ss,stream_ss,'
  const organizerFields = 'organizers_ss,organizer_s,organizerEmail_s,'
  const locationFields  = 'roomTitle_s,roomLocation_s,roomLocalName_s,'
  const localizedFields = `description_${locale}_t,title_${locale}_t,`
  const metaFields      = 'createdBy_s,createdByEmail_s,createdDate_dt,modifiedBy_s,modifiedByEmail_s,updatedDate_dt'

  return fields + itemFields + organizerFields + locationFields + localizedFields + metaFields
}

async function getEvents(query){
  this.$store.commit('routes/SET_SHOW_MEETING_NAV', false)
  try{
  if(!query.conference) query.conference = this.conference.id
  
  const events   = {}
  const url      = this.getQueryUrl(query)
  const docs     = await useHttp( { url, method: 'get', responseType: 'json' }).then((data) => data.response.docs)

  events.raw     = sanitizeIndexResult(docs)

  return events
  }catch(e){
    console.error('Calender.getEvents', e.message)
    console.error(e.message)
    console.error(e)
  }
}

function getQueryUrl(query){
  const endPoint = `${process.env.NUXT_ENV_API}/api/v2013/index/select`
  const f        = genFields(query)
  const q        = this.genQuery(query)

  return encodeURI(`${endPoint}?fl=${f}&q=${q}&sort=start_dt+DESC&start=0&wt=json&rows=5000`)
}


function genQuery(query){

  const { start, end, selectedStream, keyWordFilter, selectedProgramme } = query
  const { start: startOverride, end:endOverride } = this.conference?.apps?.cbdEvents || {}
  const { startDate, endDate, id                    } = this.conference
  const { locale } = this.$i18n

  const qStartDate = startOverride || startDate
  const qEndDate   = endOverride   || endDate

  let qStart = `+AND+(start_s:[ ${qStartDate} TO *])`
  let qEnd   = `+AND+(end_s:[ * TO ${qEndDate}])`

  let q      = `schema_s:reservation+AND+conference_s:${id}`
  
  // if user passes start end over write default
  if(start) qStart = `+AND+(start_s:[ ${start} TO *])`
  if(end)   qEnd   = `+AND+(end_s:[ * TO ${end}])`
  
  q += qStart + qEnd

  if(selectedStream)    q += `+AND+(stream_ss:${selectedStream})`
  if(selectedProgramme) q += `+AND+(thematicAreas_ss:${selectedProgramme})`
  if(keyWordFilter)     q += `+AND+(text_${locale.toUpperCase()}_txt:"${keyWordFilter}*")`

  return q
}
</script>

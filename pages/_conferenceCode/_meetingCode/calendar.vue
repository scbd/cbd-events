<template>
  <Calendar
    class="cal"
    :options="{ queryFn:getEvents, conference:conference, locale:$i18n.locale,height:'100vh' }"
  />
</template>

<script>
import { DateTime } from 'luxon'
import Calendar     from '~/components/Calender/src/components/index.vue'

export default {
  name      : 'Calender',
  components: { Calendar },
  methods   : { getEvents, genQuery, getConference, getQueryUrl },
  asyncData
}

function asyncData ({ store }){
  store.commit('routes/SET_SHOW_MEETING_NAV', false)

  return { conference: store.state.conferences.selected }
}

function getConference (){ return this.$store.state.conferences.selected }

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
  if(!query.conference) query.conference = this.conference._id
  
  const events   = {}
  const queryUrl = getQueryUrl(query)
  const response = await this.$axios.get(queryUrl)

  events.raw   = sanitizeIndexResult(response.data.response.docs)
  events.days  = mapByDay(events.raw)
  events.weeks = mapByWeek(events.days)

  return events
}

function getQueryUrl(query){
  const endPoint = `${process.env.API}/api/v2013/index/select`
  const f        = genFields(query)
  const q        = this.genQuery(query)

  return`${endPoint}?fl=${f}&q=${q}&sort=start_dt+DESC&start=0&wt=json&rows=300`
}

function sanitizeIndexResult(docs){
  for (let i = 0; i < docs.length; i++)
    // eslint-disable-next-line
    for (const j in docs[i]) {
      const skip              = !~j.indexOf('_')
      const sanitizedPropName = j.slice(0, j.indexOf('_'))

      if(!skip) continue
      docs[i][sanitizedPropName] = docs[i][j]
    }
    
  return docs
}

function mapByDay(docs){
  const days = {}

  for (let i = docs.length-1; i >=0; i--){
    const dayStart = DateTime.fromISO(docs[i].start).startOf('day')
    const dayEnd = DateTime.fromISO(docs[i].start).endOf('day')
    const start = DateTime.fromISO(docs[i].start)

    // eslint-disable-next-line
    if(!days.hasOwnProperty(dayStart.toUTC().toISODate())) days[dayStart.toUTC().toISODate()]=[]

    if(start>=dayStart && start<=dayEnd)
      days[dayStart.toUTC().toISODate()].push(docs[i])
  }
  return days
}

function mapByWeek(days){
  const weeks = {}
  // eslint-disable-next-line
  for (const day in days){
    const week  = DateTime.fromISO(day).toUTC().year+'-'+DateTime.fromISO(day).toUTC().weekNumber

    // eslint-disable-next-line
    if(!weeks.hasOwnProperty(week)) weeks[week]={}
    weeks[week][day]=days[day]
  }
  const weekArr = Object.values(weeks)

  //link listafy
  for (let i = 0; i < weekArr.length; i++){
    if(i>0)
      weekArr[i].next = weekArr[i-1]
    if(i<weekArr.length-1)
      weekArr[i].prev = weekArr[i+1]
  }

  return weeks
}

function genQuery(query){
  let q = 'schema_s:reservation'

  if(query.conference){
    q += `+AND+conference_s:${query.conference}`
    if(!query.start)
      q += `+AND+(start_s:[ ${this.conference.StartDate} TO *])`
        
    if(!query.end)
      q += `+AND+(end_s:[ * TO ${this.conference.EndDate}])`
  }

  if(query.start)
    q += `+AND+(start_s:[ ${query.start} TO *])`

  if(query.end)
    q += `+AND+(end_s:[ * TO ${query.end}])`

  if(query.selectedStream)
    q += `+AND+(stream_ss:${query.selectedStream})`
  if(query.selectedProgramme)
    q += `+AND+(thematicAreas_ss:${query.selectedProgramme})`
  if(query.keyWordFilter)
    q += `+AND+(text_${this.$i18n.locale.toUpperCase()}_txt:"${query.keyWordFilter}*")`
  return q
}
</script>

<style>
  .cal{ margin-bottom: 50px; }
</style>
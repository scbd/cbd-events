<template>
  <div >
    <Calendar :options="{queryFn:getEvents,conference:conference}"/>
  </div>
</template>

<script>
  import {DateTime}   from 'luxon'
  import Calendar     from '@scbd/eco-molecule-cal'
  import pageMixin    from '~/modules/pageMixin'

  import '@scbd/eco-molecule-cal/dist/vue/Cal.css'
  import '@scbd/ecosystem-icons/all/all.css'

  export default {
    name:   'calender',
    mixins: [pageMixin],
    components:{Calendar},
    async asyncData ({store}) {
      store.commit('routes/SET_SHOW_MEETING_NAV',false)
      let conference = store.state.conferences.selected
      return {
        conference:conference
      }
    },

    methods:{
      getEvents:getEvents,
      genQuery:genQuery,
      getConference:()=>this.conference
    }
  }


  function genFields(query){
    return `conference_s,timezone_s,itemShowFiles_ss,itemFiles_ss,itemText_ss,item_ss,itemMeeting_ss,stream_ss,organizers_ss,organizer_s,organizerEmail_s,roomTitle_s,roomLocation_s,roomLocalName_s,description_${query.locale.toUpperCase()|| 'EN'}_t,title_${query.locale.toUpperCase() || 'EN'}_t,start_dt,end_dt,identifier_s,createdBy_s,createdByEmail_s,createdDate_dt,modifiedBy_s,modifiedByEmail_s,updatedDate_dt`
  }


    async function getEvents(query){
      if(!query.conference) {
        query.conference = this.conference._id
      }

      let events = {}
      let endPoint = `/api/v2013/index/select`
      let path = `${endPoint}?fl=${genFields(query)}&q=${this.genQuery(query)}&sort=start_dt+DESC&start=0&wt=json&rows=300`
      let response = await this.$axios.get(path)

      events.raw  = sanitizeIndexResult(response.data.response.docs)
      events.days = mapByDay(events.raw)
      events.weeks = mapByWeek(events.days)

      return events
    }
    function sanitizeIndexResult(docs){

      for (var i = 0; i < docs.length; i++) {

        for (let variable in docs[i]) {
          if(~variable.indexOf('_')){
            let sanitizedPropName = variable.slice(0,variable.indexOf('_'))
            docs[i][sanitizedPropName] = docs[i][variable]
          }
        }
      }
      return docs
    }
    function mapByDay(docs){
      let days = {}

      for (var i = docs.length-1; i >=0; i--) {
        let dayStart = DateTime.fromISO(docs[i].start).startOf('day')
        let dayEnd = DateTime.fromISO(docs[i].start).endOf('day')
        let start = DateTime.fromISO(docs[i].start)
        if(!days.hasOwnProperty(dayStart.toUTC().toISODate())) days[dayStart.toUTC().toISODate()]=[]

        if(start>=dayStart && start<=dayEnd)
          days[dayStart.toUTC().toISODate()].push(docs[i])
      }
      return days
    }

    function mapByWeek(days){
      let weeks = {}

      for (var day in days) {
        let week  = DateTime.fromISO(day).toUTC().year+'-'+DateTime.fromISO(day).toUTC().weekNumber
        if(!weeks.hasOwnProperty(week)) weeks[week]={}
        weeks[week][day]=days[day]
      }
      let weekArr = Object.values(weeks)
      //link listafy
      for (let i = 0; i < weekArr.length; i++) {
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
        if(!query.start){
          q += `+AND+(start_s:[ ${this.conference.StartDate} TO *])`
        }
        if(!query.end){
          q += `+AND+(end_s:[ * TO ${this.conference.EndDate}])`
        }
      }

      if(query.start)//2018-05-14T00:00:00.000Z
        q += `+AND+(start_s:[ ${query.start} TO *])`

      if(query.end)//2018-05-14T00:00:00.000Z
        q += `+AND+(end_s:[ * TO ${query.end}])`

        // keyWordFilter:this.keyWordFilter,
        // selectedAgendaItem:(this.selectedAgendaItem===this.$t('agendaItem'))? this.selectedAgendaItem:'',
        // selectedProgramme:this.selectedProgramme,
        // selectedStream:this.selectedStream
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

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.right{
  border-left: 1px solid black;
}
</style>

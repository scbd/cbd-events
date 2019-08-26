<template>
  <div
    :class="{'not-in-session':!isInSession}"
    class="main"
  >
    <h4
      v-if="!isInSession"
      class="text-center"
    >
      Provisional Agenda
    </h4>
    <hr>
    <section
      v-for=" (item, index) in inSessionAgendaItems"
      :key="index"
    >
      <div class="agenda item ">
        <span
          class="label agenda"
          :class="{[agenda.prefix]:agenda.prefix}"
        >
          {{ agenda.prefix }} {{ item.item }}
        </span>
        <span>{{ item.shortTitle || item.title }}</span>
      </div>
      <hr>
    </section>
    <Offline v-if="isInSession && offLine" />
    <iframe
      ref="docsFrame"
      v-if="isInSession && !offLine"
      class="docs-frame"
      :src="`${iFrameHost}/conferences/${conferenceCode}/schedules?viewOnly=true&${forceDate}`"
    />
  </div>
</template>

<script>
import   documentDownloadMixin   from '~/modules/documentDownloadMixin'
import   Offline                 from '~/components/Offline'
import { DateTime              } from 'luxon'
  
export default {
  mixins    : [documentDownloadMixin],
  components: { Offline },
  computed  : { isInSession, forceDate, offLine, inSessionAgendaItems },
  created, asyncData
}

function asyncData ({ store, params, query }){
  if(!isInSessionServer(store, query))
    store.commit('routes/SET_SHOW_MEETING_NAV', { gendasOnly: true })
  else
    store.commit('routes/SET_SHOW_MEETING_NAV', false)

  return {
    conferenceCode: params.conferenceCode,
    iFrameHost    : process.env.IFRAME_HOST,
    conference    : store.state.conferences.selected,
    agenda        : store.state.conferences.selectedMeeting.agenda
  }
}

function created(){
  if(!this.isInSession)
    this.$store.commit('routes/SET_SHOW_MEETING_NAV', { agendasOnly: true })
}

function inSessionAgendaItems (){
  if(!this.isInSession) return []
  const { agenda } = this

  return agenda.items
}

function offLine(){ return this.$store.state.offLine.isOffLine }

function isInSessionServer(store, { datetime }){
  const conference = store.state.conferences.selected
  const start = DateTime.fromISO(conference.schedule.start)
  const end = DateTime.fromISO(conference.schedule.start)
  const now = DateTime.local().setZone(conference.timezone)

  if((start <= now && now <= end) || isValidDate(datetime)){
    store.commit('routes/SET_SHOW_MEETING_NAV', false)
    return true
  }
  return false
}
  
function forceDate(){
  if(isValidDate(this.$route.query.datetime))
    return `&datetime=${this.$route.query.datetime}`
  return ''
}

function isValidDate(date){ return !isNaN(new Date(date).getTime()) }

function isInSession(){
  const { conference } = this
  const { start, end } = conference.schedule
  const cStart          = DateTime.fromISO(start)
  const cEnd            = DateTime.fromISO(end)
  const now             = DateTime.local().setZone(conference.timezone)

  if((cStart <= now && now <= cEnd) || isValidDate(this.$route.query.datetime)){
    this.$store.commit('routes/SET_SHOW_MEETING_NAV', false)
    return true
  }
  return false
}
</script>

<style >
  .main {padding-top:.1em;}
  .main.not-in-session {padding-top:2em;}
  .agenda.item { padding: 1em 1em 1em 1em;}
  .label.agenda      { background: #777; display: inline-block; min-width: 45px;    }
  .label.agenda.CBD  { background: #009B48; }
  .label.agenda.CP   { background: #A05800; }
  .label.agenda.NP   { background: #0086B7; }
  .label { display: inline; padding: .2em .6em .2em .6em; font-size: 75%; font-weight: 700; line-height: 1; color: #fff; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: .25em; }
  .docs-frame{ width:100%; height:90vh; border: none; }
</style>

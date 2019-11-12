<template>
  <div :class="{'not-in-session':!isInSession}" class="main" >
    <h4 v-if="!isInSession" class="text-center mt-3" >
      Provisional Agenda
    </h4>
    <hr v-if="!isInSession(datetime)">
    <section  v-if="!isInSession(datetime)">
      <div class="agenda item " v-for=" (item, index) in agendaItems" :key="index">
        <span class="label agenda" :class="{[agendaPrefix]:agendaPrefix}" >
          {{ agendaPrefix }} {{ item.item }}
        </span>
        <h6 v-if="!agendaItems || !agendaItems.length"> Unavailable, will be posted shortly.</h6>
        <span>{{ item.shortTitle || item.title }}</span>
      </div>
      <hr>
    </section>
    <Offline v-if="isInSession(datetime) && offLine" />
    <iframe
      ref="docsFrame"
      v-if="isInSession(datetime) && !offLine"
      class="docs-frame"
      :src="`${iFrameHost}/conferences/${conferenceCode}/schedules?viewOnly=true&${forceDate(datetime)}`"
    />
  </div>
</template>

<script>
import   documentDownloadMixin   from '~/modules/documentDownloadMixin'
import   Offline                 from '~/components/Offline'
import { mapGetters            } from 'vuex'

export default {
  mixins    : [ documentDownloadMixin ],
  components: { Offline },
  computed  : { ...gettersMap() },
  created, asyncData
}

function asyncData ({  params, query }){
  const { conferenceCode } = params
  const { datetime }       = query

  return {
    conferenceCode,
    datetime,
    iFrameHost: process.env.NUXT_ENV_IFRAME_HOST
  }
}

function gettersMap(){
  return mapGetters({
    isInSession : 'conferences/isInSession',
    offLine     : 'offLine/isOffLine',
    forceDate   : 'conferences/forceDate',
    agendaItems : 'conferences/agendaItems',
    agendaPrefix: 'conferences/agendaPrefix'
  })
}

function created(){
  if(!this.isInSession(this.datetime))
    this.$store.commit('routes/SET_SHOW_MEETING_NAV', { agendasOnly: true })
  else
    this.$store.commit('routes/SET_SHOW_MEETING_NAV', false)
}
</script>

<style >
  .main {padding-top:.1em;}
  .main.not-in-session {padding-top:2em;}
  .agenda.item { padding: .5em 1em .5em 1em;}
  .label.agenda      { background: #777; display: inline-block; min-width: 45px;    }
  .label.agenda.CBD  { background: #009B48; }
  .label.agenda.CP   { background: #A05800; }
  .label.agenda.NP   { background: #0086B7; }
  .label { display: inline; padding: .2em .6em .2em .6em; font-size: 75%; font-weight: 700; line-height: 1; color: #fff; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: .25em; }
  .docs-frame{ width:100%; height:87vh; border: none; }
</style>

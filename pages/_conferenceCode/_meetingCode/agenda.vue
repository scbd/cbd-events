<template>
  <div class="main" :class="{'not-in-session':!isInSession}">
    <h4 v-if="!isInSession" class="text-center">Provisional Agenda</h4>
    <hr/>
    <section v-if="!isInSession" v-for=" (item,index) in agenda.items" :key="index">
    <div class="agenda item " >
      <span class="label agenda"  :class="{[agenda.prefix]:agenda.prefix}">{{agenda.prefix}} {{item.item}}</span> 
      <span>{{item.shortTitle || item.title}}</span>
    </div>
    <hr/>
  </section>
 
  <iframe v-if="isInSession" class="docs-frame" :src="`${iFrameHost}/conferences/${conferenceCode}/schedules?viewOnly=true`"></iframe>
  </div>
</template>

<script>
  import {DateTime} from 'luxon'
  export default {
    async asyncData ({store,params}) {

      if(!this.isInSession)
        store.commit('routes/SET_SHOW_MEETING_NAV',{agendasOnly:true})
      else
        store.commit('routes/SET_SHOW_MEETING_NAV',{agendasOnly:false})
      
      // await store.dispatch('conferences/getAgenda')

      return {
        conferenceCode:params.conferenceCode,
        iFrameHost:process.env.IFRAME_HOST,
        conference:store.state.conferences.selected,
        agenda:store.state.conferences.selectedMeeting.agenda
      }
    },
    computed:{
      isInSession:isInSession
    },
    created(){
      if(!this.isInSession)
        this.$store.commit('routes/SET_SHOW_MEETING_NAV',{agendasOnly:true})      
    }
  }//export
  
  function isInSession() {
    let conference = this.conference
    let start = DateTime.fromISO(conference.schedule.start)
    let end = DateTime.fromISO(conference.schedule.start)    
    let now = DateTime.local().setZone(conference.timezone)

    if(start <= now && now <= end){
        this.$store.commit('routes/SET_SHOW_MEETING_NAV',false)
        return true
    }
    return false
  }
</script>

<style >
.main {padding-top:.1em;}
.main.not-in-session {padding-top:1em;}
.agenda.item { padding: 1em 1em 1em 1em;}
.label.agenda      { background: #777; display: inline-block; min-width: 45px;    }
.label.agenda.CBD  { background: #009B48; }
.label.agenda.CP   { background: #A05800; }
.label.agenda.NP   { background: #0086B7; }
.label {
    display: inline;
    padding: .2em .6em .2em .6em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
}
  .docs-frame{
    width:100%;
    height:90vh;
    border: none;
  }
</style>

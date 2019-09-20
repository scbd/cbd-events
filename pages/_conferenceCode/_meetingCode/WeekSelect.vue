<template>
  <section>
    <Header :title="title" />
    <div class="page container-fluid">
      <div class="row">
        <div
          class="block gradient col-12"
          @click="changeMeeting(meeting)"
          v-for="(meeting,index) in visibleMeetings"
          :key="index"
        >
          <div>
            <h4>{{ meeting.evtCd}}</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from '~/components/header/header-bottom-screen'

export default {
  name      : 'Meetings',
  layout    : 'bottom-screen',
  components: { Header },
  methods   : { hasAgenda, done, changeMeeting },
  computed  : { agendasOnly, visibleMeetings },
  asyncData, mounted
}

function asyncData ({ app, store }){
  const title = app.i18n.t('meetings')
  const { meetings } = store.state.conferences

  return  { title, meetings }
}

function mounted(){ this.$root.$on('bottom-screen-done', done) }

function visibleMeetings(){
  const { meetings } = this

  if(!meetings) return []

  return meetings.filter(m => (this.hasAgenda(m) ||(!this.agendasOnly && m.id)))
}

function agendasOnly(){
  try{
    const { showMeetingNav } = this.$store.state.routes

    return showMeetingNav.agendasOnly
  }
  catch(e){ return false }
}

function hasAgenda({ agenda }){ return this.agendasOnly && agenda }
function done(){ this.$router.go(-1) }
  
function changeMeeting(meeting){
  const { name }           = this.$store.state.routes.prevRoute
  const { conferenceCode } = this.$route.params
  const   params           = { conferenceCode, meetingCode: meeting.evtCd }

  this.$store.commit('conferences/setSelectedMeeting', meeting)
  this.$router.push({ name, params })
}
</script>

<style scoped>
  .page{ margin-top:50px; height:100vh; }
  .block > img { align-self: center; width: 100%; }
  .block > div { vertical-align: top; }
  .block h5 { font-weight: 500; }
  /* For browsers that do not support gradients */
  .gradient {
              background-color:rgba(0,0,0,0.40);
              background: rgba(0,0,0,0.40);
              background: -webkit-linear-gradient(left top, rgba(0,0,0,0.40), #2c3e50);
              /* For Safari 5.1 to 6.0 */
              background: -o-linear-gradient(bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* For Opera 11.1 to 12.0 */
              background: -moz-linear-gradient(bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* For Firefox 3.6 to 15 */
              background: linear-gradient(to bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* Standard syntax (must be last) */
            }
  .block {
            background-color: rgba(0,0,0,0.40);
            text-align: center;
            color:white;
            margin: 1em 0 1em 0;
            cursor: pointer;
            padding: 1em;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
          }
</style>
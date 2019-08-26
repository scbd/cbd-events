<template>
  <section>
    <Header :title="title" />
    <div class="page container-fluid">
      <div class="row">
        <div
          @click="changeConference(conference)"
          :class="{block:!getHeroImage(conference),hero:getHeroImage(conference)}"
          v-for="conference in conferencesWithMeetings"
          :key="conference._id"
        >
          <img
            crossorigin="anonymous"
            v-if="getHeroImage(conference)"
            :src="getHeroImage(conference) || defaultImage"
            :alt="`${conference.title} logo`"
          >
          <img
            crossorigin="anonymous"
            v-if="!getHeroImage(conference)"
            :src="getImage(conference) || defaultImage"
            :alt="`${conference.title} logo`"
          >
          <div v-if="!getHeroImage(conference)">
            <h4>{{ conference.title | lstring }}</h4>
            <p>{{ conference.description | lstring }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from '~/components/header/header-bottom-screen'

export default {
  name      : 'Conferences',
  layout    : ' bottom-screen',
  components: { Header },
  methods   : { done, getImage, getHeroImage, changeConference },
  computed  : { conferencesWithMeetings },
  asyncData,
  mounted
}

function asyncData ({ app, store }){
  return {
    title       : app.i18n.t('conferences'),
    conferences : store.state.conferences.docs,
    defaultImage: '/images/cbd-logo-en.svg'
  }
}

function conferencesWithMeetings (){
  const { conferences } = this

  if(!conferences) return []

  return conferences.filter(c => c.hasMeetings)
}

function mounted(){ this.$root.$on('bottom-screen-done', done) }

function done(){ this.$router.go(-1) }

function changeConference(conference){
  const { code }   = conference
  const { locale } = this.$store.state.i18n
  const  name      = `conferenceCode___${locale}`
  const  params    = { conferenceCode: code }

  this.$store.commit('conferences/setSelected', conference)
  this.$router.replace({ name, params })
}

function getImage(conference){
  if(!conference.conference || !conference.conference.image) return false
  return conference.conference.image
}

function getHeroImage(conference){
  if(!conference.conference || !conference.conference.heroImage) return false
  return conference.conference.heroImage
}
</script>

<style scoped>
  .page         { margin-top:50px; height:100vh; }
  .hero > img   { align-self: start; width:95vw; }
  .block > img  { align-self: center; width: 100%; }
  .block > div  { vertical-align: top; }
  .block h5     { font-weight: 500; }
  .hero         { cursor: pointer;
                  width: 100vw;
                  padding: 1em;
                  border-top: 1px solid #ccc;
                  border-bottom: 1px solid #ccc;
                  box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
                }
  .block        { cursor: pointer;
                  display: grid;
                  grid-template-columns: 100px auto;
                  grid-template-rows: auto;
                  grid-column-gap: 1em;
                  padding: 1em;
                  border-top: 1px solid #ccc;
                  border-bottom: 1px solid #ccc;
                  box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
                }
</style>

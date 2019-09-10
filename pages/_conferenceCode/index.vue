<template>
  <div class="container-fluid home">
    <div class="row">
      <div class="col-12">
        <img crossorigin="anonymous" class="hero" v-if="getHeroImage" :src="getHeroImage" :alt="`${conference.title | lstring} logo`" >
      </div>
      <div class="col-6" >
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-about', params: { conferenceCode } })">
          <Icon name="info-circle"  in-text="true"/> About
        </nuxt-link>
      </div>
      <div class="col-6">
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-overview', params: { conferenceCode } })">
          <Icon name="calendar"  in-text="true"/> Overview
        </nuxt-link>
      </div>
      <div class="col-6">
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name: 'conferenceCode-meetingCode-agenda', params: { conferenceCode, meetingCode } })">
          <Icon name="clock-o"  in-text="true"/> Agenda
        </nuxt-link>
      </div>
      <div class="col-6" v-if="hasDownloads">
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-meetingCode-downloads', params: { conferenceCode, meetingCode } })">
          <Icon name="document-download"  in-text="true"/> Downloads
        </nuxt-link>
      </div>
      <div class="col-6">
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-meetingCode-documents',params: { conferenceCode, meetingCode } })">
          <Icon name="docs"  in-text="true"/> Documents
        </nuxt-link>
      </div>
      <div class="col-6">
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-meetingCode-calendar',params: { conferenceCode, meetingCode }, query: { selected: startDate } })">
          <Icon name="calendar-o"  in-text="true"/> Calendar
        </nuxt-link>
      </div>
      <div class="col-6">
        <div  class="btn btn-secondary btn-index" >
          <Icon name="cog"  in-text="true"/> Settings
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { lstring  }   from '~/plugins/filters'

export default {
  name    : 'index',
  methods : { lstring },
  computed: { conference, getHeroImage,
    ...gettersMap() },
  asyncData
}
function asyncData ({ store, params }){
  const { conferenceCode } = params

  store.commit('routes/SET_SHOW_MEETING_NAV', false)

  return { conferenceCode }
}

function gettersMap(){
  return mapGetters({
    meetingCode : 'conferences/meetingCode',
    hasDownloads: 'files/hasDownloads',
    startDate   : 'conferences/startDate'
  })
}

function getHeroImage(){
  try{
    let blob = this.conference.heroImageBlob || this.conference.imageBlob

    if(blob) blob = URL.createObjectURL(blob)
    return   blob || false
  }
  catch(e){ return false }
}

function conference(){
  try{
    const   selectedApp                       = this.$store.getters['conferences/selectedApp']
    const { title, imageBlob, heroImageBlob } = selectedApp

    return  { title, imageBlob, heroImageBlob }
  }
  catch(e){ return {} }
}
</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
  .btn-index { width:100%; background-color: rgb(1, 70, 58); text-align: left; font-size: 1em; text-align: center; margin-bottom: 1em;}
</style>

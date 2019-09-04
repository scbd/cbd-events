<template>
  <div class="container-fluid home">
    <div class="row">
      <div class="col-12">
        <img crossorigin="anonymous" class="hero" v-if="getHeroImage" :src="getHeroImage" :alt="`${title | lstring} logo`" >
      </div>
      <div class="col-6" >
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-info', params: { conferenceCode } })">
          <Icon name="info-circle"  in-text="true"/> Info
        </nuxt-link>
      </div>
      <div class="col-6">
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-info', params: { conferenceCode } })">
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
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-meetingCode-calendar',params: { conferenceCode, meetingCode }, query: { selected: getCalStartDate() } })">
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
import   CoverImageMixin   from '~/modules/CoverImageMixin'
import { DateTime        } from 'luxon'
import { lstring         } from '~/plugins/filters'

export default {
  name    : 'index',
  mixins  : [ CoverImageMixin ],
  methods : { lstring, getCalStartDate },
  computed: { hasDownloads },
  asyncData
}
  
function asyncData ({ store, params }){
  const { conferenceCode } = params
  const   meetingCode      = 'xxx'

  store.commit('routes/SET_SHOW_MEETING_NAV', false)

  return { conferenceCode, meetingCode  }
}

function hasDownloads(){
  return this.$store.getters.hasDownloads
}

function getCalStartDate(){
  const { startDate } = this.$store.state.conferences.selected
  const start         = DateTime.fromISO(startDate).startOf('day')
  const now           = DateTime.local().startOf('day')

  if(now<start) return start.toISODate()

  return now.toUTC().toISODate()
}
</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
  .btn-index { width:100%; background-color: rgb(1, 70, 58); text-align: left; font-size: 1em; text-align: center; margin-bottom: 1em;}
</style>

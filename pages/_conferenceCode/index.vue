<template>
  <div class="container-fluid home">
    <div class="row">
      <div class="col-12  mb-3">
        <img  class="hero" v-if="getHeroImage" :src="getHeroImage" :alt="`${conference.title | lstring} logo`" >
      </div>
      <div v-if="showAbout" class="col-6" >
        <nuxt-link  class="btn btn-secondary btn-index" :to="localePath({ name:'conferenceCode-about', params: { conferenceCode } })">
          <Icon name="info-circle"  in-text="true"/> About
        </nuxt-link>
      </div>
      <div v-if="conferenceCal" class="col-6">
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
      <div v-on:click="toggleSettings" class="col-6">
        <div  class="btn btn-secondary btn-index" >
          <Icon name="cog"  in-text="true"/> Settings
        </div>
      </div>

      <div class="col-12">
        <ArticleHome :content="content" :blob="blob" :title="title"/>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'                    ;
import { lstring    } from '~/plugins/filters'       ;
import   ArticleHome      from '~/components/article.vue';

export default {
  name    : 'index',
  components: { ArticleHome },
  methods : { lstring, toggleSettings },
  computed: { conference, getHeroImage, ...gettersMap(), showAbout },
  asyncData
}

async function asyncData ({ store, params }){
  const { conferenceCode } = params

  const aboutExists = await store.dispatch('about/get')

  store.commit('routes/SET_SHOW_MEETING_NAV', false)


  let  { content, blob, title } = await store.dispatch('article/get') || {} ;

  if(blob)
    blob = URL.createObjectURL(blob)

  return { conferenceCode, aboutExists, content, blob, title }
}

function gettersMap(){
  return mapGetters({
    meetingCode  : 'conferences/meetingCode',
    hasDownloads : 'files/hasDownloads',
    startDate    : 'conferences/startDate',
    conferenceCal: 'conferences/conferenceCal',
    cbdEvents    : [ 'conferences/selectedApp' ]
  })
}

function toggleSettings(){
  this.$root.$emit('toggleSetting')
}

function getHeroImage(){
  try{
    let blob = this.conference.heroImageBlob || this.conference.imageBlob

    return   blob? URL.createObjectURL(blob) :  'https://attachments.cbd.int/cbd-logo-en.svg'
  }
  catch(e){ return false }
}

function conference(){
  try{
    const { title, imageBlob, heroImageBlob, heroImage, image, hasAbout } = this.cbdEvents

    return  { title, imageBlob, heroImageBlob, heroImage, image, hasAbout }
  }
  catch(e){ return {} }
}

function showAbout(){
  const { hasAbout } = this.conference || {}

  return hasAbout || this.aboutExists
}
</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  {   display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 80%; max-height: 50vh;}
  .btn-index { width:100%; background-color: rgb(1, 70, 58); text-align: left; font-size: 1em; text-align: center; margin-bottom: 1em;}
</style>

<template>
  <div class="container-fluid home">
    {{getHeroImage}}
    <img crossorigin="anonymous" class="hero" v-if="getHeroImage" :src="getHeroImage" :alt="`${conference.title | lstring} logo`" >
  </div>
</template>

<script>
export default {
  name    : 'index',
  computed: { conference, getHeroImage, getImage },
  asyncData
}
  
function asyncData ({ store, params }){
  const { conferenceCode } = params

  store.commit('routes/SET_SHOW_MEETING_NAV', false)

  return { conferenceCode }
}

function conference(){
  console.log(this.$store.state.conferences.selected)
  try{ return this.$store.state.conferences.selected.app.cbdEvents }
  catch(e){ return {} }
}

function getImage(){
  try{ return this.conference.apps.cbdEvents.image }
  catch(e){ return false }
}

function getHeroImage(){
  console.log('rrrr', this.conference)
  try {
    const { cbdEvents } = this.$store.state.conferences.selected.apps

    return cbdEvents.heroImage || this.getImage
  }
  catch(e){ return this.getImage }
}
</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
</style>

<template>
  <div class="container-fluid home">
    <img crossorigin="anonymous" class="hero" v-if="getHeroImage(conference)" :src="getHeroImage(conference)" :alt="`${conference.apps.cbdEvents | lstring} logo`" >


  </div>
</template>

<script>


export default {
  name    : 'index',
  methods : { getHeroImage },
  computed: { conference },
  asyncData
}
  
function asyncData ({ store, params }){
  const { conferenceCode } = params

  store.commit('routes/SET_SHOW_MEETING_NAV', false)

  return { conferenceCode }
}

function conference(){
  try{ return this.$store.state.conferences?.selected }
  catch(e){ return {} }
}

function getImage({ apps }){
  try{
    const { cbdEvents } = apps

    return cbdEvents.image
  }
  catch(e){ return false }
}

function getHeroImage({ apps }){
  const { cbdEvents } = apps

  if(!cbdEvents || !cbdEvents.heroImage) return getImage({ apps })
  return cbdEvents.heroImage
}
</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
</style>

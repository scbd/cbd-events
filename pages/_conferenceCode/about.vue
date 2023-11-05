<template>
  <div v-if="title" class="container-fluid home">
    <div class="row">
      <div class="col-12">
        <img class="hero" v-if="blob" :src="blob" :alt="`${title | this.$filters.lstring} logo`" >
      </div>
      <div class="col-12">
        <span v-html="this.$options.filters.lstring(content)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'info',
  asyncData
}
  
async function asyncData ({ store, params }){
  const { conferenceCode } = params
  
  store.commit('routes/SET_SHOW_MEETING_NAV', false)
  //eslint-disable-next-line
  let { content, blob, title } = await store.dispatch('about/get', { code: conferenceCode})

  if(blob)
    blob = URL.createObjectURL(blob)

  return { content, blob, title }
}
</script>
<style>
h1{
  font-size: 1.75rem;
  margin: 1rem 0 1rem 0;
}
h2{
  font-size: 1.4rem;
  margin: .5rem 0 .5rem 0;
}
</style>
<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
</style>

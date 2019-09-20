<template>
  <div class="container-fluid home">
    <div class="row">
      <div class="col-12">
        <img crossorigin="anonymous" class="hero" v-if="blob" :src="blob" :alt="`${title | this.$filters.lstring} logo`" >
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
  
async function asyncData ({ store }){
  store.commit('routes/SET_SHOW_MEETING_NAV', false)
  //eslint-disable-next-line
  let { content, blob, title } = await store.dispatch('about/get')

  blob = URL.createObjectURL(blob)
  return { content, blob, title }
}
</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
</style>

<template>
    <div v-if="title" class="container-fluid home">
        <Article :content="content" :blob="blob" :title="title"/>
    </div>
  </template>
  
  <script>
  import   Article from '~/components/article.vue';

  export default {
    name: 'tag',
    components: { Article },
    asyncData
  }
    
  async function asyncData ({ store, params }){
    const { conferenceCode, tag } = params
    
    store.commit('routes/SET_SHOW_MEETING_NAV', false)
  
    let { content, blob, title } = (await store.dispatch('article/get', { code: conferenceCode, tag})) || {}
  
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
  
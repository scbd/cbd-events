<template>
  <div v-if="title" class="container-fluid home">
    <Article :content="content" :blob="blob" :title="title"/>
  </div>
</template>

<script>
import Article from '~/components/article.vue';

export default {
  name: 'info',
  components: { Article },
  asyncData
}
  
async function asyncData ({ store, params }){
  const { conferenceCode } = params
  
  store.commit('routes/SET_SHOW_MEETING_NAV', false)

  let { content, blob, title } = await store.dispatch('about/get', { code: conferenceCode})

  if(blob)
    blob = URL.createObjectURL(blob)

  return { content, blob, title }
}
</script>


<template>
  <div class="container-fluid home">
    <div class="row">
      <div class="col-12">
        <img crossorigin="anonymous" class="hero" v-if="getHeroImage" :src="getHeroImage" :alt="`${title | this.$filters.lstring} logo`" >
      </div>
      <div class="col-12">
        <span v-html="this.$options.filters.lstring(content)" />
      </div>
    </div>
  </div>
</template>

<script>
import   CoverImageMixin   from '~/modules/CoverImageMixin'

export default {
  name   : 'info',
  mixins : [ CoverImageMixin ],
  methods: { getQuery },
  asyncData
}
  
async function asyncData ({ app, store, params }){
  store.commit('routes/SET_SHOW_MEETING_NAV', false)

  const { content } = (await loadArticle(app.$axios, store.state.conferences.selected.code))[0]
  const { conferenceCode } = params

  return { conferenceCode, content }
}


function loadArticle($axios, code){
  return $axios.$get(`${process.env.API}/api/v2017/articles`, { params: getQuery(code) })
}

function getQuery(code){
  const ag   = []
  const tags = []

  tags[0] = encodeURIComponent('cbd-events')
  tags[1] = encodeURIComponent(code)

  const match = { 'adminTags.title.en': { $all: tags } }

  ag.push({ $match: match })
  ag.push({ $project: { title: 1, summary: 1, content: 1, coverImage: 1 } })
  ag.push({ $sort: { 'meta.updatedOn': -1 } })
  ag.push({ $limit: 1 })

  return { ag: JSON.stringify(ag) }
}

</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
</style>

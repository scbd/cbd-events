<template>
  <div class='container-fluid home'>
    <img class='hero' v-if='getHeroImage(conference)' :src='getHeroImage(conference)' :alt='`${conference.title[$i18n.locale]} logo`'/>
    <span v-html="this.$options.filters.lstring(article.content)"></span>
  </div>
</template>

<script>
  export default {
    components: {},
    async asyncData ({app , store}) {
      let article = (await loadArticle(app.$axios,store.state.conferences.selected.code))[0]
      let conference = store.state.conferences.selected
      return {
        conference:conference,
        article:article,
        title:article.title,
        image:conference.conference.heroImage || conference.conference.image
      }
    },
    methods: {
      getHeroImage:getHeroImage,
      loadArticle:loadArticle,
      getQuery:getQuery
    },
    created () {

      let from = this.$store.state.routes.prevRoute
      let locale = this.$store.state.i18n.locale

      if(from.fullPath === '/' && this.$route.name === `conferenceCode___${locale}` && !this.$store.state.routes.initalized){
        this.$store.commit('routes/I18N_INIT', true)
        let pathName = this.$route.name.replace(`___${this.$store.state.i18n.locale}`,`___${this.$store.state.i18n.prevLocale}`)
        this.$router.replace({ name:pathName , params: this.$route.params })
      }
    }
  }
  function getHeroImage(){
    let conference = this.$store.state.conferences.selected
    if(!conference.conference || !conference.conference.heroImage) return false
    return conference.conference.heroImage
  }

  function loadArticle($axios,code){
    return $axios.$get('/api/v2017/articles', { params: getQuery(code)})
  }

  function getQuery(code){
    let ag   = []
    let tags = []

    tags[0] = encodeURIComponent('cbd-events')
    tags[1] = encodeURIComponent(code)

    let match = { 'adminTags.title.en' : { $all: tags}}

    ag.push({'$match'   : match })
    ag.push({'$project' : { title:1, summary:1, content:1, coverImage:1}})
    ag.push({'$sort'    : { 'meta.updatedOn':-1}})
    ag.push({'$limit'   : 1 })

    return {ag:JSON.stringify(ag)}
  }
</script>

<style scoped>
.home{
  padding-bottom: 3em;
}
  .hero  {
    align-self: start;
    width:95vw;
  }
</style>

<template>
  <div class='container-fluid home'>
    <img crossorigin="anonymous" class='hero' v-if='getHeroImage(conference)' :src='getHeroImage(conference)' :alt='`${conference.title[$i18n.locale]} logo`'/>
    <span v-html="this.$options.filters.lstring(article.content)"></span>
    <h3>Overview</h3>
    <overview :code="conferenceCode" :options="{target:'_blank'}"/>
  </div>
</template>

<script>
  import overview from '~/components/conference-cal/src/components/ConferenceCal.vue'

  export default {
    components: {overview},
    async asyncData ({app , store, params}) {
      store.commit('routes/SET_SHOW_MEETING_NAV',false)
      let article = (await loadArticle(app.$axios,store.state.conferences.selected.code))[0]
      let conference = store.state.conferences.selected.conference.cbdMeet
      return {
        conferenceCode:params.conferenceCode,
        conference:conference,
        article:article,
        title:article.title
      }
    },
    methods: {
      getHeroImage:getHeroImage,
      loadArticle:loadArticle,
      getQuery:getQuery,
      languageInit:languageInit
    }
  }
  
  function getHeroImage(){
    if(!this.conference || !this.conference.heroImage) return false
    if(process.env.PROXY_ENABLED)
      return this.conference.heroImage.replace(process.env.ATTACHMENTS,'/images')
    return this.conference.heroImage
  }

  function loadArticle($axios,code){
    return $axios.$get(`${process.env.API}/api/v2017/articles`, { params: getQuery(code)})
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
  // hack for spa language route transitions/
  function languageInit(){
    let from = this.$store.state.routes.prevRoute
    let locale = this.$store.state.i18n.locale
    let prev = this.$store.state.i18n.prevLocale

    if(from.fullPath === `/${this.$route.params.conferenceCode}` && this.$route.name === `conferenceCode___${locale}` && !this.$store.state.routes.initalized){  
      this.$store.commit('routes/I18N_INIT', true)
      let pathName = this.$route.name.replace(`___${this.$store.state.i18n.locale}`,`___${this.$store.state.i18n.prevLocale}`)

      this.switchLocalePath(prev)
      this.$store.commit('i18n/I18N_SET_LOCALE',prev)
      this.$i18n.locale = prev
      this.$forceUpdate()

      this.$router.replace({ name:pathName , params: this.$route.params })
    }
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

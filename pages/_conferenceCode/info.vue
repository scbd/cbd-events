<template>
  <div class="container-fluid home">
    <img crossorigin="anonymous" class="hero" v-if="getHeroImage(conference)" :src="getHeroImage(conference)" :alt="`${conference.title[$i18n.locale]} logo`" >
    <span v-html="this.$options.filters.lstring(article.content)" />
    <h3 >Overview</h3>

    <overview
      :code="conferenceCode"
      :options="{target:'_blank'}"
    />
  </div>
</template>

<script>
import overview from '@scbd/conference-cal/dist/src/index'

export default {
  name      : 'index',
  components: { overview },
  methods   : { getHeroImage, loadArticle, getQuery, languageInit, getLanguageInitParams, isLanguageInitilized },
  asyncData
}
  
async function asyncData ({ app, store, params }){
  store.commit('routes/SET_SHOW_MEETING_NAV', false)
  const article = (await loadArticle(app.$axios, store.state.conferences.selected.code))[0]
  const conference = store.state.conferences.selected.conference.cbdMeet

  return {
    conferenceCode: params.conferenceCode,
    conference,
    article,
    title         : article.title
  }
}

function getHeroImage(){
  if(!this.conference || !this.conference.heroImage) return false
  if(process.env.PROXY_ENABLED)
    return this.conference.heroImage.replace(process.env.ATTACHMENTS, '/images')
  return this.conference.heroImage
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
// hack for spa language route transitions/
function languageInit(){
  if(!this.isLanguageInitilized()) return

  const { locale, prevLocale } = this.getLanguageInitParams()
  const pathName               = this.$route.name.replace(`___${locale}`, `___${prevLocale}`)

  this.$i18n.locale = prevLocale
  this.$store.commit('routes/I18N_INIT', true)
  this.$store.commit('i18n/I18N_SET_LOCALE', prevLocale)
  
  this.switchLocalePath(prevLocale)
  this.$forceUpdate()

  this.$router.replace({ name: pathName, params: this.$route.params })
}

function isLanguageInitilized(){
  const { prevRoute, initalized, locale, prevLocale, conferenceCode } = this.getLanguageInitParams()

  const wasPrevRouteHomeRoute = (prevRoute.fullPath === `/${conferenceCode}`)
  const wasPrevLocaleSame     = (locale === prevLocale)
  //(this.$route.name === `conferenceCode___${locale}`)

  if(wasPrevRouteHomeRoute && wasPrevLocaleSame && !initalized)
    return false
  return true
}

function getLanguageInitParams(){
  const { prevRoute, initalized } = this.$store.state.routes
  const { locale, prevLocale }    = this.$store.state.i18n
  const   conferenceCode          = this.$route.params

  return { prevRoute, initalized, locale, prevLocale, conferenceCode }
}
</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
</style>

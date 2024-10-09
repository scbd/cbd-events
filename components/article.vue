<template>
    <div class="row" v-if="title" >
        <div v-if="blob" class="col-12">
          <img class="hero"  :src="blob" :alt="`${title | this.$filters.lstring} logo`" style="width:100%;">
        </div>
        <div class="col-12">
          <div class="ck-content">
            <div ref="article" v-html="this.$options.filters.lstring(this.content)" />
          </div>
        </div>
    </div>
</template>
<script>
  import useHttp from '~/composables/http';

  export default {
    name   : 'ArticleHome',
    props  : ['title', 'content', 'blob', 'tag'],
    methods: {getOembedHtml, isYoutube, getYoutubeHtml },
    mounted,
    asyncData 
  }

  async function asyncData ({ store, params }){
    const { conferenceCode, tag:pa } = params
    const   aboutExists      = await store.dispatch('about/get')

    store.commit('routes/SET_SHOW_MEETING_NAV', false)

    let  { content, blob, title } = await store.dispatch('article/get', { force:true, code: conferenceCode, tag:'cbd-events-home' }) || {} ;

    if(blob) blob = URL.createObjectURL(blob);

    return { conferenceCode, aboutExists, content, blob, title }
  }

  async function mounted(){
    const oembeds = this.$refs.article.querySelectorAll( 'oembed[url]' );

    if(oembeds.length)
      for (const el of oembeds) {
        const rawUrl = el.getAttribute('url');
        const url    = encodeURI(rawUrl);
        const params = { url };

        await this.getOembedHtml(el, params, rawUrl);
      }
  }

  function getOembedHtml(el, params, rawUrl){
    const url = `${process.env.NUXT_ENV_API}/api/v2020/oembed`;

      return useHttp({ url, method: 'get', responseType: 'json', params }, this.$axios)
                .then((r) => {
                  const  embedHtml = `<div class="ck-media__wrapper text-center">${r?.html}</div>`;

                  
                  if(!this.isYoutube(rawUrl)) el.insertAdjacentHTML("afterend", embedHtml);

                  else this.getYoutubeHtml(el, r);
                })
  }

  function getYoutubeHtml(el, ombedData){
    const ombedHtml = ombedData.html;
    const pattern   = /src="https:\/\/www.youtube.com\/embed\/([^?]+)\?feature=oembed"/;
    const matches   = ombedHtml.match(pattern);
    const match     = matches? matches[1] : null;

    if(!match) return '';

    const html = `<div class="ck-media__wrapper text-center"><iframe  class="youtube-video"  src="https://www.youtube.com/embed/${match}?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" title="${ombedData.title}"></iframe></div>`

    el.insertAdjacentHTML("afterend", html);
  }

  function isYoutube(url){
    const regx = /^https?:\/\/(?:www\.)?(youtube\.com|youtu.be).*$/i

    return regx.test(url)
  }
</script>
<style>
  h1{
    font-size: 1.5rem;
    margin: 1rem 0 1rem 0;
  }
  h2{
    font-size: 1.2rem;
    margin: .5rem 0 .5rem 0;
  }
</style>
<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  { align-self: start; width:95vw; }
  .youtube-video {
      aspect-ratio: 16 / 9;
      width: 100%;
  }
</style>
  
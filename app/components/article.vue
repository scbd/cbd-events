<template>
  <div class="row" v-if="title">
    <div v-if="blob" class="col-12">
      <img class="hero" :src="blob" :alt="`${lstring(title)} logo`" style="width:100%;">
    </div>
    <div class="col-12">
      <div class="ck-content">
        <div ref="articleRef" v-html="lstring(content)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { $fetch         } from 'ofetch'
import { lstring        } from '~/utils/filters'

const props = defineProps(['title', 'content', 'blob', 'tag'])

const { public: { api } } = useRuntimeConfig()
const articleRef = ref(null)

onMounted(async () => {
  if (!articleRef.value) return

  const oembeds = articleRef.value.querySelectorAll('oembed[url]')

  if (oembeds.length)
    for (const el of oembeds) {
      const rawUrl = el.getAttribute('url')
      await getOembedHtml(el, { url: encodeURI(rawUrl) }, rawUrl, api)
    }
})

async function getOembedHtml(el, params, rawUrl, api) {
  const url = `${api}/api/v2020/oembed`

  const r = await $fetch(url, { query: params }).catch(() => null)

  if (!r) return

  const embedHtml = `<div class="ck-media__wrapper text-center">${r?.html}</div>`

  if (!isYoutube(rawUrl)) el.insertAdjacentHTML('afterend', embedHtml)
  else getYoutubeHtml(el, r)
}

function getYoutubeHtml(el, ombedData) {
  const ombedHtml = ombedData.html
  const pattern   = /src="https:\/\/www.youtube.com\/embed\/([^?]+)\?feature=oembed"/
  const matches   = ombedHtml.match(pattern)
  const match     = matches ? matches[1] : null

  if (!match) return

  const html = `<div class="ck-media__wrapper text-center"><iframe class="youtube-video" src="https://www.youtube.com/embed/${match}?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" title="${ombedData.title}"></iframe></div>`

  el.insertAdjacentHTML('afterend', html)
}

function isYoutube(url) {
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
  
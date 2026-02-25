import { defineStore } from 'pinia'
import { ref         } from 'vue'
import { useNuxtApp  } from '#app'
import   useHttp       from '~/composables/http'
import { useLocalForage } from '~/composables/use-local-forage'

// ---------------------------------------------------------------------------
// Module-level pure helpers
// ---------------------------------------------------------------------------

function buildQuery(code) {
  const ag   = []
  const tags = [encodeURIComponent('cbd-events'), encodeURIComponent(code)]

  ag.push({ $match  : { adminTags: { $all: tags } } })
  ag.push({ $project: { title: 1, summary: 1, content: 1, coverImage: 1 } })
  ag.push({ $sort   : { 'meta.updatedOn': -1 } })
  ag.push({ $limit  : 1 })

  return { ag: JSON.stringify(ag) }
}

async function fetchBlob(coverImage, $axios) {
  const url = coverImage?.url

  if (!url) return undefined

  return useHttp({ method: 'get', url, responseType: 'blob' }, $axios)
}

async function fetchFromApi(code, $axios) {
  try {
    const url        = `${process.env.NUXT_ENV_API}/api/v2017/articles`
    const restParams = { url, method: 'get', responseType: 'json', params: buildQuery(code) }
    const data       = await useHttp(restParams, $axios)

    return data?.[0]
  }
  catch (e) {
    console.error(e)
    return undefined
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAboutStore = defineStore('about', () => {
  const docs = ref({})

  // ── private helpers ────────────────────────────────────────────────────

  async function _existsLocal(code) {
    const lf      = useLocalForage()
    const article = await lf.about.getItem(code)

    if (!article) return undefined

    docs.value[code] = article

    return article
  }

  async function _exists(code) {
    if (docs.value[code]) return docs.value[code]

    return _existsLocal(code)
  }

  async function _save(code, article) {
    docs.value[code] = article
    await useLocalForage().about.setItem(code, article)
  }

  async function _fetchAndSave(code) {
    const { $axios } = useNuxtApp()
    const article    = await fetchFromApi(code, $axios)

    if (!article) return undefined

    article.blob = await fetchBlob(article.coverImage || {}, $axios)

    await _save(code, article)

    return article
  }

  // ── public actions ─────────────────────────────────────────────────────

  async function get(code, force = false) {
    if (!code) return undefined

    const cached = await _exists(code)

    if (cached && !force) {
      // reload latest in background (mirrors original Vuex behaviour)
      get(code, true).catch(() => {})
      return cached
    }

    return _fetchAndSave(code)
  }

  return { docs, get }
})

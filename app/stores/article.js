import { defineStore } from 'pinia'
import { ref         } from 'vue'
import { useNuxtApp  } from '#app'
import   useHttp       from '~/composables/http'
import { useLocalForage } from '~/composables/use-local-forage'

// ---------------------------------------------------------------------------
// Module-level pure helpers
// ---------------------------------------------------------------------------

function buildQuery(code, tag) {
  const ag   = []
  const tags = [
    encodeURIComponent(tag || 'cbd-events-home'),
    encodeURIComponent(code),
  ]

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

async function fetchFromApi(code, tag, $axios) {
  try {
    const url        = `${process.env.NUXT_ENV_API}/api/v2017/articles`
    const restParams = { url, method: 'get', responseType: 'json', params: buildQuery(code, tag) }
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

export const useArticleStore = defineStore('article', () => {
  const docs = ref({})

  // ── private helpers ────────────────────────────────────────────────────

  async function _existsLocal(code, tag) {
    const key     = `${code}-${tag}`
    const lf      = useLocalForage()
    const article = await lf.article.getItem(key)

    if (!article) return undefined

    docs.value[key] = article

    return article
  }

  async function _exists(code, tag) {
    const key = `${code}-${tag}`

    if (docs.value[key]) return docs.value[key]

    return _existsLocal(code, tag)
  }

  async function _save(code, tag, article) {
    const key = `${code}-${tag}`

    docs.value[key] = article
    await useLocalForage().article.setItem(key, article)
  }

  async function _fetchAndSave(code, tag) {
    const { $axios } = useNuxtApp()
    const article    = await fetchFromApi(code, tag, $axios)

    if (!article) return undefined

    article.blob = await fetchBlob(article.coverImage || {}, $axios)

    await _save(code, tag, article)

    return article
  }

  // ── public actions ─────────────────────────────────────────────────────

  async function get({ code, tag } = {}, force = false) {
    if (!code) return undefined

    const cached = await _exists(code, tag)

    if (cached && !force) {
      // reload latest in background (mirrors original Vuex behaviour)
      get({ code, tag }, true).catch(() => {})
      return cached
    }

    return _fetchAndSave(code, tag)
  }

  return { docs, get }
})

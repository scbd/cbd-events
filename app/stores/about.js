import { defineStore } from 'pinia'
import { ref         } from 'vue'
import { $fetch      } from 'ofetch'
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

function fetchBlob(coverImage) {
  const url = coverImage?.url

  if (!url) return undefined

  return $fetch(url, { responseType: 'blob' })
}

async function fetchFromApi(code, api) {
  try {
    const url    = `${api}/api/v2017/articles`
    const params = buildQuery(code)
    const data   = await $fetch(url, { query: params })

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

    return await _existsLocal(code)
  }

  async function _save(code, article) {
    docs.value[code] = article
    await useLocalForage().about.setItem(code, article)
  }

  async function _fetchAndSave(code) {
    const { public: { api } } = useRuntimeConfig()
    const article = await fetchFromApi(code, api)

    if (!article) return undefined

    article.blob = await fetchBlob(article.coverImage || {})

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

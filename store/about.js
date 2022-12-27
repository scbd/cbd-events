import { HTTP } from '@ionic-native/http'

export const state     = () => ({ docs: {} })
export const actions   = { get, exists, existsLocal, save }
export const getters   = {  }
export const mutations = { set }

async function get({ dispatch }, { force, code } = {}){
  const { conferenceCode } = this.$router.currentRoute.params
  const   exists           = await dispatch('exists')
  const cCode = conferenceCode || code

  if(!cCode) return undefined

  if(exists && !force){
    dispatch('get', { force: true }) // reload latest
    return exists
  }

  const  article = await loadArticle(cCode)
  
  if(!article) return undefined

  dispatch('save', { conferenceCode:cCode, article })
  article.blob = await getBlob(article.coverImage || {})
  return article
}


function exists ({ state, dispatch }){
  const { docs           } = state
  const { conferenceCode } = this.$router.currentRoute.params

  if(docs[conferenceCode]) return docs[conferenceCode]

  return dispatch('existsLocal')
}

async function existsLocal ({ commit  }){
  const { conferenceCode } = this.$router.currentRoute.params
  const   article          = await this.$localForage.about.getItem(conferenceCode)

  if(!article) return undefined

  commit('set', { article, conferenceCode })

  return article
}

function set(state, { conferenceCode, article }){ state.docs[conferenceCode] = article }

function getBlob({ url }){
  if(!url) return undefined

  const restParams = { method: 'get', url, responseType: 'blob' }

  return HTTP.sendRequest(url,restParams).then((res) => res.data)
}


function loadArticle(conferenceCode){
  try{
    const restParams = { method: 'get',  responseType: 'json', params: getQuery(conferenceCode) }

    return HTTP.sendRequest(`${process.env.NUXT_ENV_API}/api/v2017/articles`, restParams)
      .then(({ data }) => data[0])
  }
  catch(e){
    console.error(e)
    return undefined
  }
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

function save({ commit }, { article, conferenceCode }){
  commit('set', { article, conferenceCode })
  this.$localForage.about.setItem(conferenceCode, article)
}
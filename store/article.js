import useHttp from '~/composables/http';

export const state     = () => ({ docs: {} })
export const actions   = { get, exists, existsLocal, save }
export const getters   = {  }
export const mutations = { set }

async function get({ dispatch }, { force, code } = {}){
  const { conferenceCode } = this.$router.currentRoute.params
  const   exists           = await dispatch('exists')
  const   cCode            = conferenceCode || code

  if(!cCode) return undefined

  if(exists && !force){
    dispatch('get', { force: true }) // reload latest

    return exists
  }

  const  article = await loadArticle(cCode, this.$axios)
  
  if(!article) return undefined

  article.blob = await getBlob(article.coverImage || {}, this.$axios)

  await dispatch('save', { conferenceCode:cCode, article })
  
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
  const   article          = await this.$localForage.article.getItem(conferenceCode)

  if(!article) return undefined

  commit('set', { article, conferenceCode })

  return article
}

function set(state, { conferenceCode, article }){ state.docs[conferenceCode] = article }

function getBlob({ url }, $axios){
  if(!url) return undefined

  const restParams = { method: 'get', url, responseType: 'blob' }

  return useHttp(restParams, $axios)
}


function loadArticle(conferenceCode, $axios){
  try{
    const url = `${process.env.NUXT_ENV_API}/api/v2017/articles`;
    const restParams = {url,  method: 'get',  responseType: 'json', params: getQuery(conferenceCode) }

    return useHttp(restParams, $axios)
      .then((data) => data[0])
  }
  catch(e){
    console.error(e)
    return undefined
  }
}

function getQuery(code){
  const ag   = []
  const tags = []

  tags[0] = encodeURIComponent('cbd-events-home')
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
  this.$localForage.article.setItem(conferenceCode, article)
}
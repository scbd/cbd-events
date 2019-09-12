export const state     = () => ({ docs: {} })
export const actions   = { get, exists, existsLocal, save }
export const getters   = {  }
export const mutations = { set }

async function get({ dispatch }, force){
  const { conferenceCode } = this.$router.currentRoute.params
  const   exists           = await dispatch('exists')

  if(exists && !force){
    dispatch('get', true) // reload latest
    return exists
  }

  const  article = await loadArticle(this.$axios, conferenceCode)
  
  if(!article) return undefined

  dispatch('save', { conferenceCode, article })
  article.blob = await getBlob(this, article.coverImage)
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

function getBlob({ $axios }, { url }){
  if(!url) return undefined

  const restParams = { method: 'get', url, responseType: 'blob' }

  return $axios(restParams).then((res) => res.data)
}


function loadArticle($axios, conferenceCode){
  try{
    return $axios.$get(`${process.env.API}/api/v2017/articles`, { params: getQuery(conferenceCode) })
      .then((r) => r[0])
  }
  catch(e){
    console.log('err', e)
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
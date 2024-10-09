import useHttp from '~/composables/http';
import consola from 'consola';
export const state     = () => ({ docs: {} })
export const actions   = { get, exists, existsLocal, save }
export const getters   = {  }
export const mutations = { set }

async function get({ dispatch }, { force, code, tag:passedTag } = {}){
  const { conferenceCode, tag:paramTag } = this.$router.currentRoute.params

  const   cCode            = code || conferenceCode;
  const   tag              = passedTag || paramTag;

  if(!cCode) return undefined
  
  const   exists           = await dispatch('exists', { code:cCode, tag});



  if(exists && !force){
    dispatch('get', { force: true, code, tag }) // reload latest

    return exists
  }

  const  article = await loadArticle(cCode, tag, this.$axios)
  
  if(!article) return undefined

  article.blob = await getBlob(article.coverImage || {}, this.$axios)

  await dispatch('save', { conferenceCode:cCode, tag,  article })
  
  return article
}

function exists ({ state, dispatch }, { code, tag:passedTag }){
  const { docs           } = state
  const { conferenceCode, tag: paramTag } = this.$router.currentRoute.params

  const   cCode            = code || conferenceCode;
  const   tag              = passedTag || paramTag;

  if(`${cCode}-${tag}`) return docs[`${cCode}-${tag}`]

  return dispatch('existsLocal',{ code:cCode, tag})
}

async function existsLocal ({ commit  }, { code, tag:passedTag }){
  const { conferenceCode, tag: paramTag } = this.$router.currentRoute.params
  const   cCode            = code || conferenceCode;
  const   tag              = passedTag || paramTag;
  const   article          = await this.$localForage.article.getItem(`${cCode}-${tag}`);

  if(!article) return undefined;

  commit('set', { article, conferenceCode:cCode, tag });

  return article;
}

function set(state, { conferenceCode, article, tag }){ 

  state.docs[`${conferenceCode}-${tag}`] = article 
}

function getBlob({ url }, $axios){
  if(!url) return undefined

  const restParams = { method: 'get', url, responseType: 'blob' }

  return useHttp(restParams, $axios)
}


function loadArticle(conferenceCode, tag, $axios){
  try{
    const url        = `${process.env.NUXT_ENV_API}/api/v2017/articles`;
    const restParams = { url,  method: 'get',  responseType: 'json', params: getQuery(conferenceCode, tag) };

    return useHttp(restParams, $axios).then((data) => data[0])
  }
  catch(e){
    console.error(e)
    return undefined
  }
}

function getQuery(code, tag){
  const ag   = [];
  const tags = [];

  tags[0] = tag? encodeURIComponent(tag): encodeURIComponent('cbd-events-home');
  tags[1] = encodeURIComponent(code);

  const match = { 'adminTags': { $all: tags } };

  ag.push({ $match: match });
  ag.push({ $project: { title: 1, summary: 1, content: 1, coverImage: 1 } });
  ag.push({ $sort: { 'meta.updatedOn': -1 } });
  ag.push({ $limit: 1 });

  return { ag: JSON.stringify(ag) };
}

function save({ commit }, { article, conferenceCode, tag }){
  commit('set', { article, conferenceCode, tag });
  this.$localForage.article.setItem(`${conferenceCode}-${tag}`, article);
}
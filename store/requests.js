import Vue        from 'vue'
import {isObject,isEmpty} from '~/modules/helpers'

async function getRequests({dispatch,commit},data){
    let response='';
    let {conference} = data
    let queryParameters = {}

    queryParameters.q = {}
    
    if(conference)
      queryParameters.q.conference = '5a831c426aa2097d12a61893'
queryParameters.q.currentStep =  generateStatus(data)

    try{
        response = await this.$axios.$get('/api/v2018/kronos/participation-requests', {'params': queryParameters})

        let requests = await dispatch('joinOrgs',response)
        requests     = await dispatch('joinParticipants',response)
        commit('set',requests)
    }
    catch(e){
      // if(response.status != 200)
      //   commit('set',response)
        console.error(e)
    }



    return response
}

function generateStatus(data){
  let {state} = data
  if(!state)
    return {$in:['finished']}
  if(state)
    return {$nin:['finished']}
}

const getByCode = (state) => (code) =>{
    return state.docs.find(conf => conf.code===code)
}

function getConferenceId (code){
  return '5a831c426aa2097d12a61893'
}

function setMutation (state,payLoad){

    state.docs = payLoad
}
async function joinParticipants (all,requests){

  let orgIdArray = getOrgIds(requests)

  let queryParameters = {
                          q:{organization:{'$in':orgIdArray}}
                        }
   let participants = await this.$axios.$get('/api/v2018/kronos/participation-request/participants', {'params': queryParameters})

    if(!isEmpty(participants))
      for (let i = 0; i < requests.length; i++) {
        let participant = participants.find((p)=>{if(requests[i].nominatingOrganization && requests[i].nominatingOrganization._id===p.organization) return p})

        if(participant){
          if(!Array.isArray(requests[i].participant))
            requests[i].participant = []
          requests[i].participant.push(participant)
        }
      }
    return requests
}
async function joinOrgs ({dispatch},requests){

    let orgIdArray = getOrgIds(requests)

    let orgObjArry = await dispatch('getOrgs',orgIdArray)

    for (let i = 0; i < requests.length; i++) {
      let org = orgObjArry.find((o)=>{if(requests[i].nominatingOrganization===o._id) return o})
      if(org) requests[i].nominatingOrganization = org
    }
    return requests
}

function getOrgs (all,orgIdArray){

    let queryParameters = {
                            q:{_id:{'$in':orgIdArray}}
                          }
    return this.$axios.$get('/api/v2018/kronos/participation-request/organizations', {'params': queryParameters})
}

function getOrgIds (requests){
  return requests.map((request) => {
                                    if(isObject(request.nominatingOrganization) && !isEmpty(request.nominatingOrganization))
                                      return {$oid:request.nominatingOrganization._id}
                                    else if(request.nominatingOrganization && !isObject(request.nominatingOrganization))
                                      return {$oid:request.nominatingOrganization}

                                    }) // array of org id's
                                    .filter(n => n)    // remove falsies
                                    .filter((n) => {if(n && !isEmpty(n)) return n})
}

export const state  = () =>({
  docs: []
})

export const actions = {
  get    : getRequests,
  getOrgs: getOrgs,
  joinOrgs: joinOrgs,
  joinParticipants:joinParticipants
}

export const getters = {
  byCode:getByCode
}

export const mutations = {
  set:setMutation
}

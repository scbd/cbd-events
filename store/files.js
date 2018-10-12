import Vue from 'vue'
//read from local storage and update state
async function loadAction({state, commit,  rootState}){
  if(state.data.length)return
  let data = []
  let names = []
  let count = await this.$localForage.files.length()

  for (let i = 0; i < count; i++) 
    names[i] =this.$localForage.files.key(i)
  names = await Promise.all(names)

  for (let i = 0; i < count; i++) 
    data[i] =this.$localForage.files.getItem(names[i])  
  data = await Promise.all(data)
  
  await this.$localForage.files.iterate((value, key, iterationNumber)=>data.push(value))

  if(data.length) 
    commit('SET',data)
}

// save to localstorage and update state
async function saveAction({commit}, files){
  if(Array.isArray(files)){
    for (let i = 0; i < files.length; i++) {
      commit('SAVE',files[i])
      this.$localForage.files.setItem(files[i].name,files[i])
    }
  }else{
    commit('SAVE',files)
    return this.$localForage.files.setItem(files.name,files)
  }
}

async function deleteAction({commit}, files){
  if(Array.isArray(files)){
    for (let i = 0; i < files.length; i++) {
      commit('DELETE',files[i])
      this.$localForage.files.removeItem(files[i].name)
    }
  }else{
    commit('DELETE',files)
    return this.$localForage.files.removeItem(files.name)
  }
}
//set the entire file system
async function setMutation(state,payLoad){
  state.data = payLoad
}
function downloading(state){
  state.downloading = !state.downloading
}
function deleteMutation(state,fileName){
  let newData = []
  let index = state.data(file => file.name === fileName)
  state.data.splice(index,1)
  
  state.data.forEach((file)=>newData.push(file)) //reactive hack
  state.data = newData //reactive hack
}
//save a file 
function save(state,payLoad){
  if(state.data.find(({name})=>name===payLoad.name)) return
  let newData = []
  newData[0] = payLoad
  
  state.data.forEach((file)=>newData.push(file)) //reactive hack
  state.data = newData //reactive hack
}

export const actions = {
  LOAD:loadAction,
  SAVE:saveAction,
  DELETE:deleteAction
}

export const getters = {
  GET: (state) => (name) => {
    return state.data.find(file => file.name === name)
  }
}

export const state  = () =>({
 data:[],
 downloading:false
})

export const mutations = {
  SET:setMutation,
  SAVE:save,
  DELETE:deleteMutation,
  DOWNLOADING:downloading
}

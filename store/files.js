import Vue from 'vue'

//read from local storage and update state
async function loadAction({state, commit,  rootState}){
  if(state.data.length)return
  let data = []
  let names = []
  let count
  
  try{

    await this.$localForage.files.iterate((value, key, iterationNumber)=>{
      data.push(value)
    })
    await this.$localForage.blobs.iterate((value, key, iterationNumber)=>{
      data[iterationNumber-1].blob = value
    })
    console.log('data',data)
  }catch(e){
    console.error(`Error:`,e)
  }


  if(data.length) 
    commit('SET',data)
}

// save to localstorage and update state
async function saveAction({commit,dispatch}, {files,blobs}){
console.log('files',files)
console.log('blobs',blobs)
  try{  
    if(Array.isArray(files)){
      for (let i = 0; i < files.length; i++) {
        let clone =  Object.assign({}, files[i])
        clone.blob = blobs[i]
        commit('SAVE',clone)
  
        this.$localForage.files.setItem(files[i].name,files[i])
        this.$localForage.blobs.setItem(files[i].name,blobs[i])
      }
    }else{
      let clone = Object.assign({}, files)
      clone.blob = blobs
      commit('SAVE',clone)
      this.$localForage.files.setItem(files.name,files)
      this.$localForage.blobs.setItem(files.name,blobs)
    }
  }catch(e){
    console.log(`Error:`,e)
  }
}


async function deleteAction({commit,state}, files){
  
  if(Array.isArray(files)){
    let length = files.length
    if(files.length === state.data.length){
      for (let i = 0; i < length; i++) 
        this.$localForage.files.removeItem(files[i].name)
      commit('DELALL')
    }
      
    
    for (let i = 0; i < length; i++) {
      if(length !== files.length){ 
        i = 0
        length = files.length
      }
      commit('DELETE',files[i])
      await this.$localForage.files.removeItem(files[i].name)
    }
  }else{
    commit('DELETE',files)
    await this.$localForage.files.removeItem(files.name)
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
  let index = state.data.find(file => file.name === fileName)
  state.data.splice(index,1)
  
  state.data.forEach((file)=>newData.push(file)) //reactive hack
  state.data = newData //reactive hack
}
function deleteAllMutation(state){
  state.data = []
}
function fileToOpenMutation(state,payLoad =false){
  state.fileToOpen = payLoad
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
 downloading:false,
 fileToOpen:false
})

export const mutations = {
  SET:setMutation,
  SET_FILE_TO_OPEN:fileToOpenMutation,
  SAVE:save,
  DELETE:deleteMutation,
  DOWNLOADING:downloading,
  DELALL:deleteAllMutation
}

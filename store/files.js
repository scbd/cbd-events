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
async function saveAction({commit,dispatch}, files){

    
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

// async function saveIOSAction({commit}, files){
//   let dirEntry = await window.resolveLocalFileSystemURL(cordova.file.dataDirectory)
//   if(Array.isArray(files)){
//     let localPaths =[]
//     for (let i = 0; i < files.length; i++) 
//       localPaths[i] = saveFile(dirEntry, files[i].blob, files[i].name)
// 
//     localPaths =  await Promise.all(localPaths)  
// 
//     for (let i = 0; i < files.length; i++) {
//       files[i].localPath = 
//       this.$localForage.files.setItem(files[i].name,files[i])
//     }
// 
//   }else{
// 
//     return this.$localForage.files.setItem(files.name,files)
//   }
// }
// async function saveFile(dirEntry, fileData, fileName) {
// 
//     let fileEntry = await dirEntry.getFile(fileName, { create: true, exclusive: false })
// 
//     let fileWriter = await fileEntry.createWriter()
// 
//     return fileWriter.write(dataObj);
// 
// }

// function saveIOSFile(){
//   window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
//     console.log('file system open: ' + dirEntry.name);
//     var isAppend = true;
//     createFile(dirEntry, "fileToAppend.txt", isAppend);
//   }, onErrorLoadFs);
// }
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
  DOWNLOADING:downloading,
  DELALL:deleteAllMutation
}

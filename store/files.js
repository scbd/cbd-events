
//read from local storage and update state
async function loadAction({  commit }){
  const   data     = []

  try{
    await this.$localForage.files.iterate((value) => { data.push(value) })  // nee curly bracket else iterate breaks on first iteration ???

    await this.$localForage.blobs.iterate((value, key, iterationNumber) =>  { data[iterationNumber-1].blob = value }) // same

    if(data.length) commit('SET', data)
  }
  catch(e){
    console.error('Error:', e)
  }
}

function saveAction({ commit }, { files, blobs }){
  try{
    if(Array.isArray(files))
      saveArrayOfFiles({ files, blobs }, commit, this)
    else
      saveObjectOfFiles({ files, blobs }, commit, this)
  }
  catch(e){
    console.log('Error:', e)
  }
}


function deleteAction({ commit, state }, files = []){
  const isArray    = Array.isArray(files)
  const length     = isArray? files.length : 0
  const isAll      = isDeleteAll(state.data.length, length)

  if(isAll)   return deleteAllFiles(commit, this)
  if(isArray) return deleteArrayOfFiles({ commit, state }, files, this)
  
  return deleteObjectOfFiles(commit, files, this)
}

function deleteAllAction({ commit }){ return deleteAllFiles(commit, this) }

function isDeleteAll(lengthOne, lengthTwo){ return lengthOne==lengthTwo }

function setMutation(state, payLoad){ state.data = payLoad } //set the entire file system

function downloading(state){ state.downloading = !state.downloading }

function deleteAllMutation(state){ state.data = [] }

function fileToOpenMutation(state, payLoad = false){ state.fileToOpen = payLoad }

function deleteMutation({ data }, fileName){
  const index = data.find(file => file.name === fileName)

  data.splice(index, 1)
  data = data.slice(0) //reactive hack, clone array to trigger observer
}

function save({ data }, payLoad){
  const arrayClone = data.slice(0)

  if(data.find(({ name }) => name===payLoad.name)) return //exists

  data = arrayClone.push(payLoad) //reactive hack - clone to trigger
}

function saveArrayOfFiles({ files, blobs }, commit, { $localForage }){
  for (let i = 0; i < files.length; i++){
    const clone =  Object.assign({}, files[i])

    clone.blob = blobs[i]
    commit('SAVE', clone)

    $localForage.files.setItem(files[i].name, files[i])
    $localForage.blobs.setItem(files[i].name, blobs[i])
  }
}

function saveObjectOfFiles({ files, blobs }, commit, { $localForage }){
  const clone = Object.assign({}, files)

  clone.blob = blobs
  commit('SAVE', clone)

  $localForage.files.setItem(files.name, files)
  $localForage.blobs.setItem(files.name, blobs)
}

async function deleteAllFiles(commit, { $localForage }){
  commit('DELETE_ALL')
  await $localForage.files.clear()
  await $localForage.blobs.clear()
}

async function deleteObjectOfFiles(commit, files, { $localForage }){
  commit('DELETE_ALL')
  await $localForage.files.clear()
  await $localForage.blobs.clear()
}

function deleteArrayOfFiles(commit, files, { $localForage }){
  const filesClone = files.slice(0)
  const { length } = filesClone

  for (let i = 0; i < length; i++){
    const { name } = filesClone[i]

    commit('DELETE', filesClone[i])
    $localForage.files.removeItem(name)
    $localForage.blobs.removeItem(name)
  }
}
const all           = (state) => state.data
const getByMeeting  = (state) => (meetingCode) => state.data.filter((file) => file.baseName.includes(meetingCode))
const isDownloading = (state) => Boolean(state.downloading)
const hasDownloads  = (state) => Boolean(state.data.length)
const get           = (state) => (name) => state.data.find(file => file.name === name)


export const actions = {
  LOAD      : loadAction,
  SAVE      : saveAction,
  DELETE    : deleteAction,
  DELETE_ALL: deleteAllAction
}

export const getters = { get, hasDownloads, isDownloading, getByMeeting, all }

export const state  = () => ({
  data       : [],
  downloading: false,
  fileToOpen : false
})

export const mutations = {
  SET             : setMutation,
  SET_FILE_TO_OPEN: fileToOpenMutation,
  SAVE            : save,
  DELETE          : deleteMutation,
  DOWNLOADING     : downloading,
  DELETE_ALL      : deleteAllMutation
}
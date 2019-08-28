
//read from local storage and update state
async function loadAction({ state, commit }){
  const { length } = state.data
  const data       = []

  try{
    if(length) return

    await this.$localForage.files.iterate((value) => {
      data.push(value)
    })
    
    await this.$localForage.blobs.iterate((value, key, iterationNumber) => {
      data[iterationNumber-1].blob = value
    })

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


function deleteAction({ commit, state }, files){
  const isAll   = isDeleteAll(state.data.length, length)
  const isArray = Array.isArray(files)

  if(isAll)   return deleteAllFiles(commit, this)
  if(isArray) return deleteArrayOfFiles({ commit, state }, files, this)
  
  return deleteObjectOfFiles(commit, files, this)
}

function isDeleteAll(lengthOne, lengthTwo){ return lengthOne===lengthTwo }

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
  commit('DELALL')
  await $localForage.files.clear()
  await $localForage.blobs.clear()
}

async function deleteObjectOfFiles(commit, files, { $localForage }){
  commit('DELALL')
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

export const actions = {
  LOAD  : loadAction,
  SAVE  : saveAction,
  DELETE: deleteAction
}

export const getters = {
  GET: (state) => (name) => state.data.find(file => file.name === name)
}

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
  DELALL          : deleteAllMutation
}
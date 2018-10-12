
//read from local storage and update state
async function loadAction({commit,  rootState}){

  let data = await this.$localForage.fileSystem.getItem('system')

  if(data) 
    commit('SET',data)
  else {
    let code = rootState.routes.route.params.conferenceCode
    commit('SET',initData(code))
    this.$localForage.fileSystem.setItem('system',initData(code))
  } 
}

function initData (code){
  return {
    name:'cbd-events',
    children:[
      {
        name:code
      }
    ]
  }
}

// save to localstorage and update state
async function saveAction(){
  
}

//set the entire file system
async function set(){
  
}
//save a file or dir
async function save(){
  
}

export const actions = {
  LOAD:loadAction,
  SAVE:saveAction
}

export const getters = {
  
}

export const state  = () =>({
 data:{}
})

export const mutations = {
  SET:set
}

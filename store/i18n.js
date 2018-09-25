
function setLocaleMutation (state,payLoad){
  state.prevLocale = state.locale || 'en'
  state.locale = payLoad
}

function setMessagesMutation (state,payLoad){
  state.messages = payLoad
}

export const state  = () =>({
  locale: 'en',
  prevLocale: 'en',
  messages: {}
})

export const mutations = {
  'I18N_SET_LOCALE':setLocaleMutation,
  'setLocale':setLocaleMutation,
  'I18N_SET_MESSAGES':setMessagesMutation
}

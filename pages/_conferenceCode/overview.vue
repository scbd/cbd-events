<template>
  <div class="container-fluid home">
    <h3 >Overview Calendar</h3>
    <overview :code="conferenceCode" :options="{ target:'_blank' }" />
  </div>
</template>

<script>
import overview from '@scbd/conference-cal/dist/src/index'

export default {
  name      : 'index',
  components: { overview },
  asyncData
}
  
function asyncData ({ store, params }){
  store.commit('routes/SET_SHOW_MEETING_NAV', false)
  return { conferenceCode: params.conferenceCode }
}
</script>

<template>
  <div class="page-view">
    <Offline v-if="offLine"/>
    <iframe v-if="!offLine" scrolling="yes" ref="docsFrame" class="docs-frame" :src="`${iFrameHost}/conferences/${conferenceCode}/${meetingCode}/documents?viewOnly=true`"></iframe>
  </div>
</template>

<script>
  import documentDownloadMixin    from '~/modules/documentDownloadMixin'
  import Offline                  from '~/components/Offline'
  
  export default {
    name:"documentsPage",
    mixins: [documentDownloadMixin],  
    async asyncData ({store,params,route}) {
      store.commit('routes/SET_SHOW_MEETING_NAV',true)
      return{
        conferenceCode:params.conferenceCode,
        meetingCode:params.meetingCode,
        iFrameHost:process.env.IFRAME_HOST
      }
    },
    components:{Offline},
    computed:{
      offLine:offLine
    }
}
function offLine(){
  return this.$store.state.offLine.isOffLine
}
</script>

<style scoped>
  .docs-frame{
    width:100%;
    height:95vh;
    margin-top:2.8em;
    border: none;
  }
  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }
  .links {
    padding-top: 15px;
  }
  .right{
    border-left: 1px solid black;
  }
</style>

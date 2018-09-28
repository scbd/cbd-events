<template>
  <div class="page-view">
    <iframe class="docs-frame" :src="`${iFrameHost}/conferences/${conferenceCode}/${meetingCode}/documents?viewOnly=true`"></iframe>
  </div>
</template>

<script>
  export default {
    async asyncData ({store,params,route}) {
      store.commit('routes/SET_SHOW_MEETING_NAV',true)
      return{
        conferenceCode:params.conferenceCode,
        meetingCode:params.meetingCode,
        iFrameHost:process.env.IFRAME_HOST
      }
    },
    beforeDestroy () {
      this.$store.commit('routes/SET_SHOW_MEETING_NAV',false)
    }
  }
</script>

<style scoped>
  .page-view{
    margin-top:60px;
  }
  .docs-frame{
    width:100%;
    height:85vh;
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

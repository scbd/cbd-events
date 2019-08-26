<template>
  <div class="page-view">
    <Offline v-if="offLine" />
    <iframe
      v-if="!offLine"
      scrolling="yes"
      ref="docsFrame"
      class="docs-frame"
      :src="`${iFrameHost}/conferences/${conferenceCode}/${meetingCode}/documents?viewOnly=true`"
    />
  </div>
</template>

<script>
import documentDownloadMixin    from '~/modules/documentDownloadMixin'
import Offline                  from '~/components/Offline'
  
export default {
  name      : 'DocumentsPage',
  mixins    : [ documentDownloadMixin ],
  components: { Offline },
  computed  : { offLine },
  asyncData
}

function asyncData ({ store, params }){
  const { conferenceCode, meetingCode } = params
  const iFrameHost                      = process.env.IFRAME_HOST

  store.commit('routes/SET_SHOW_MEETING_NAV', true)

  return{ conferenceCode, meetingCode, iFrameHost }
}

function offLine(){ return this.$store.state.offLine.isOffLine }

</script>

<style scoped>
  .docs-frame{ width:100%; height:95vh; padding-top:5.8em; border: none; margin: -3em 0 0 0; }
  .subtitle { font-weight: 300; font-size: 42px; color: #526488; word-spacing: 5px; padding-bottom: 15px; }
  .links { padding-top: 15px; }
  .right{ border-left: 1px solid black; }
</style>

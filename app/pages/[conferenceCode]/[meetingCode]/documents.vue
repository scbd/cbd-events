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

<script setup>
import { ref             } from 'vue'
import { storeToRefs     } from 'pinia'
import { useOffLineStore } from '~/stores/off-line'
import { useRoutesStore  } from '~/stores/routes'
import { useDocumentDownload } from '~/composables/useDocumentDownload'

const route        = useRoute()
const config       = useRuntimeConfig()
const routesStore  = useRoutesStore()
const offLineStore = useOffLineStore()

const { conferenceCode, meetingCode } = route.params
const iFrameHost = config.public.iframeHost

const docsFrame = ref(null)
useDocumentDownload(docsFrame)

const { isOffLine: offLine } = storeToRefs(offLineStore)

routesStore.setShowMeetingNav(true)
</script>

<style scoped>
  .docs-frame{ width:100%; height:95vh; padding-top:5.8em; border: none; margin: -3em 0 0 0; }
  .subtitle { font-weight: 300; font-size: 42px; color: #526488; word-spacing: 5px; padding-bottom: 15px; }
  .links { padding-top: 15px; }
  .right{ border-left: 1px solid black; }
</style>

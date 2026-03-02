<template>
  <div :class="{'not-in-session': !sessionActive}" class="main">
    <h4 v-if="!sessionActive" class="text-center mt-3">
      Provisional Agenda
    </h4>
    <hr v-if="!sessionActive">
    <section v-if="!sessionActive">
      <div class="agenda item" v-for="(item, index) in agendaItems" :key="index">
        <span class="label agenda" :class="{[agendaPrefix]: agendaPrefix}">
          {{ agendaPrefix }} {{ item.item }}
        </span>
        <h6 v-if="!agendaItems || !agendaItems.length"> Unavailable, will be posted shortly.</h6>
        <span>{{ item.shortTitle || item.title }}</span>
      </div>
      <hr>
    </section>
    <Offline v-if="sessionActive && offLine" />
    <iframe
      ref="docsFrame"
      v-if="sessionActive && !offLine"
      class="docs-frame"
      :src="`${iFrameHost}/conferences/${conferenceCode}/schedules?viewOnly=true${forceDateParam}`"
    />
  </div>
</template>

<script setup>
import { ref, computed       } from 'vue'
import { storeToRefs         } from 'pinia'
import { useConferencesStore } from '~/stores/conferences'
import { useOffLineStore     } from '~/stores/off-line'
import { useRoutesStore      } from '~/stores/routes'
import { useDocumentDownload } from '~/composables/useDocumentDownload'

const route            = useRoute()
const config           = useRuntimeConfig()
const conferencesStore = useConferencesStore()
const routesStore      = useRoutesStore()
const offLineStore     = useOffLineStore()

const { conferenceCode } = route.params
const { datetime       } = route.query

const iFrameHost = config.public.iframeHost

const docsFrame = ref(null)
useDocumentDownload(docsFrame)

const { agendaItems, agendaPrefix } = storeToRefs(conferencesStore)
const { isOffLine: offLine        } = storeToRefs(offLineStore)

const sessionActive  = computed(() => conferencesStore.isInSession(datetime))
const forceDateParam = computed(() => conferencesStore.forceDate(datetime))

if (!sessionActive.value)
  routesStore.setShowMeetingNav({ agendasOnly: true })
else
  routesStore.setShowMeetingNav(false)
</script>

<style>
  .main {padding-top:.1em;}
  .main.not-in-session {padding-top:2em;}
  .agenda.item { padding: .5em 1em .5em 1em;}
  .label.agenda      { background: #777; display: inline-block; min-width: 45px;    }
  .label.agenda.CBD  { background: #009B48; }
  .label.agenda.CP   { background: #A05800; }
  .label.agenda.NP   { background: #0086B7; }
  .label { display: inline; padding: .2em .6em .2em .6em; font-size: 75%; font-weight: 700; line-height: 1; color: #fff; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: .25em; }
  .docs-frame{ width:100%; height:87vh; border: none; }
</style>

<template>
  <section>
    <Header :title="screenTitle" />
    <div class="page container-fluid">
      <div class="row" v-for="(conference, index) in conferencesWithMeetings" :key="conference._id">
        <div @click="changeConference(conference)" class="col" :class="{ block: !getHeroImage(conference, index), hero: getHeroImage(conference, index) }">
          <img v-if="getHeroImage(conference, index)"  :src="getHeroImage(conference, index) || defaultImage" :alt="`${title(conference)} logo`">
          <img v-if="!getHeroImage(conference, index)" :src="getImage(conference)            || defaultImage" :alt="`${title(conference)} logo`">
          <div v-if="!getHeroImage(conference, index)" class="container d-flex">
            <h4 class="justify-content-center align-self-center">{{ title(conference) }}</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs                          } from 'pinia'
import { useConferencesStore                  } from '~/stores/conferences'
import { useBus                               } from '~/composables/use-bus'
import { lstring                              } from '~/utils/filters'

definePageMeta({ layout: 'bottom-screen' })

const { t }            = useI18n()
const router           = useRouter()
const localePath       = useLocalePath()
const bus              = useBus()
const conferencesStore = useConferencesStore()

const { docs } = storeToRefs(conferencesStore)

const screenTitle  = t('conferences')
const defaultImage = 'https://attachments.cbd.int/cbd-logo-en.svg'

const conferencesWithMeetings = computed(() =>
  (docs.value || []).filter(c => c.hasMeetings)
)

function title(conference) {
  return lstring(conference.apps.cbdEvents.title)
}

function getImage({ apps }) {
  const { cbdEvents } = apps

  if (!cbdEvents || !cbdEvents.image) return false

  return cbdEvents.image
}

function getHeroImage({ apps }, index) {
  const { cbdEvents } = apps

  if (!index || !cbdEvents || !cbdEvents.heroImage) return false

  return cbdEvents.heroImage
}

async function changeConference(conference) {
  const { code } = conference

  conferencesStore.clearAll()
  await conferencesStore.get(code)
  router.push(localePath({ name: 'conferenceCode', params: { conferenceCode: code } }))
}

function done() { router.go(-1) }

onMounted(()      => bus.on('bottom-screen-done', done))
onBeforeUnmount(() => bus.off('bottom-screen-done', done))
</script>

<style scoped>
  .page         { margin-top:50px; height:100vh; }
  .hero > img   { align-self: start; max-width:92vw; }
  .block > img  { align-self: center; max-width: 100%; }
  .block > div  { vertical-align: top; }
  .block h5     { font-weight: 500; }
  .hero         { cursor: pointer;
                  width: 100vw;
                  padding: 1em;
                  border-top: 1px solid #ccc;
                  border-bottom: 1px solid #ccc;
                  box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
                }
  .block        { cursor: pointer;
                  display: grid;
                  grid-template-columns: 100px auto;
                  grid-template-rows: auto;
                  grid-column-gap: 1em;
                  padding: 1em;
                  border-top: 1px solid #ccc;
                  border-bottom: 1px solid #ccc;
                  box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
                }
</style>

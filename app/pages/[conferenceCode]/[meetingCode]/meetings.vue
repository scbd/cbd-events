<template>
  <section>
    <HeaderBottomScreen :title="title" />
    <div class="page container-fluid">
      <div class="row">
        <div
          class="block gradient col-12"
          @click="changeMeeting(meeting)"
          v-for="(meeting, index) in visibleMeetings"
          :key="index"
        >
          <div>
            <h4>{{ meeting.evtCd }}</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount } from 'vue'
import { storeToRefs               } from 'pinia'
import { useConferencesStore       } from '~/stores/conferences'
import { useRoutesStore            } from '~/stores/routes'
import { useBus                    } from '~/composables/use-bus'
import   HeaderBottomScreen          from '~/components/header/header-bottom-screen.vue'

definePageMeta({ layout: 'bottom-screen' })

const { t }    = useI18n()
const route    = useRoute()
const router   = useRouter()
const bus      = useBus()

const conferencesStore = useConferencesStore()
const routesStore      = useRoutesStore()

const { meetings }                  = storeToRefs(conferencesStore)
const { showMeetingNav, prevRoute } = storeToRefs(routesStore)

const title = t('meetings')
const { conferenceCode } = route.params

const agendasOnly = computed(() => {
  try { return showMeetingNav.value?.agendasOnly ?? false }
  catch(e) { return false }
})

const visibleMeetings = computed(() => {
  if (!meetings.value) return []

  return meetings.value.filter(m => (hasAgenda(m) || (!agendasOnly.value && m.id)))
})

function hasAgenda({ agenda }) { return agendasOnly.value && agenda }

function done() { router.go(-1) }

function changeMeeting(meeting) {
  const { name } = prevRoute.value
  const params   = { conferenceCode, meetingCode: meeting.evtCd }

  conferencesStore.setSelectedMeeting(meeting)
  router.push({ name, params })
}

bus.on('bottom-screen-done', done)
onBeforeUnmount(() => { bus.off('bottom-screen-done', done) })
</script>

<style scoped>
  .page{ margin-top:50px; height:100vh; }
  .block > img { align-self: center; width: 100%; }
  .block > div { vertical-align: top; }
  .block h5 { font-weight: 500; }
  /* For browsers that do not support gradients */
  .gradient {
              background-color:rgba(0,0,0,0.40);
              background: rgba(0,0,0,0.40);
              background: -webkit-linear-gradient(left top, rgba(0,0,0,0.40), #2c3e50);
              /* For Safari 5.1 to 6.0 */
              background: -o-linear-gradient(bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* For Opera 11.1 to 12.0 */
              background: -moz-linear-gradient(bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* For Firefox 3.6 to 15 */
              background: linear-gradient(to bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* Standard syntax (must be last) */
            }
  .block {
            background-color: rgba(0,0,0,0.40);
            text-align: center;
            color:white;
            margin: 1em 0 1em 0;
            cursor: pointer;
            padding: 1em;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
          }
</style>
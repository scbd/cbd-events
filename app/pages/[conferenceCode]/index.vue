<template>
  <div class="container-fluid home">
    <div class="row">
      <div class="col-12 mb-3">
        <img class="hero" v-if="getHeroImage" :src="getHeroImage" :alt="`${lstring(conference.title)} logo`">
      </div>
      <div v-if="showAbout" class="col-6">
        <NuxtLink class="btn btn-secondary btn-index" :to="localePath({ name: 'conferenceCode-about', params: { conferenceCode } })">
          <Icon name="info-circle" in-text="true" /> About
        </NuxtLink>
      </div>
      <div v-if="conferenceCal" class="col-6">
        <NuxtLink class="btn btn-secondary btn-index" :to="localePath({ name: 'conferenceCode-overview', params: { conferenceCode } })">
          <Icon name="calendar" in-text="true" /> Overview
        </NuxtLink>
      </div>
      <div class="col-6">
        <NuxtLink class="btn btn-secondary btn-index" :to="localePath({ name: 'conferenceCode-meetingCode-agenda', params: { conferenceCode, meetingCode } })">
          <Icon name="clock-o" in-text="true" /> Agenda
        </NuxtLink>
      </div>
      <div class="col-6" v-if="hasDownloads">
        <NuxtLink class="btn btn-secondary btn-index" :to="localePath({ name: 'conferenceCode-meetingCode-downloads', params: { conferenceCode, meetingCode } })">
          <Icon name="document-download" in-text="true" /> Downloads
        </NuxtLink>
      </div>
      <div class="col-6">
        <NuxtLink class="btn btn-secondary btn-index" :to="localePath({ name: 'conferenceCode-meetingCode-documents', params: { conferenceCode, meetingCode } })">
          <Icon name="docs" in-text="true" /> Documents
        </NuxtLink>
      </div>
      <div v-if="showCalendar" class="col-6">
        <NuxtLink class="btn btn-secondary btn-index" :to="localePath({ name: 'conferenceCode-meetingCode-calendar', params: { conferenceCode, meetingCode }, query: { selected: startDate } })">
          <Icon name="calendar-o" in-text="true" /> Calendar
        </NuxtLink>
      </div>
      <div v-for="(button, index) in buttons" :key="index" :class="{ 'col-6': button.size !== 2, 'col-12': button.size === 2 }">
        <NuxtLink class="btn btn-secondary btn-index" :to="localePath({ name: 'conferenceCode-article-tag', params: { conferenceCode, tag: button.tag } })">
          <Icon :name="button.icon" in-text="true" /> {{ button.text }}
        </NuxtLink>
      </div>

      <div v-if="content || articleBlob" class="col-12">
        <Article :content="content" :blob="articleBlob" :title="articleTitle" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref                    } from 'vue'
import { storeToRefs                      } from 'pinia'
import { useConferencesStore              } from '~/stores/conferences'
import { useFilesStore                    } from '~/stores/files'
import { useAboutStore                    } from '~/stores/about'
import { useArticleStore                  } from '~/stores/article'
import { useRoutesStore                   } from '~/stores/routes'
import { useBus                           } from '~/composables/use-bus'
import { lstring                          } from '~/utils/filters'

const route            = useRoute()
const localePath       = useLocalePath()
const bus              = useBus()

const conferencesStore = useConferencesStore()
const filesStore       = useFilesStore()
const aboutStore       = useAboutStore()
const articleStore     = useArticleStore()
const routesStore      = useRoutesStore()

const { conferenceCode } = route.params

const { meetingCode, startDate, conferenceCal, selectedApp, showCalendar } = storeToRefs(conferencesStore)
const { hasDownloads }                                                      = storeToRefs(filesStore)

routesStore.setShowMeetingNav(false)

// ── async data ──────────────────────────────────────────────────────────────

const { data: aboutData } = await useAsyncData(
  `about-${conferenceCode}`,
  () => aboutStore.get(conferenceCode)
)

const { data: articleData } = await useAsyncData(
  `article-home-${conferenceCode}`,
  () => articleStore.get({ code: conferenceCode, tag: 'cbd-events-home' }, true)
)

const aboutExists  = ref(Boolean(aboutData.value))
const content      = ref(articleData.value?.content || null)
const articleTitle = ref(articleData.value?.title   || null)
const articleBlob  = ref(
  articleData.value?.blob ? URL.createObjectURL(articleData.value.blob) : null
)

// ── derived from selectedApp ────────────────────────────────────────────────

const conference = computed(() => {
  try {
    const { title, imageBlob, heroImageBlob, heroImage, image, hasAbout, buttons } = selectedApp.value

    return { title, imageBlob, heroImageBlob, heroImage, image, hasAbout, buttons }
  }
  catch { return {} }
})

const getHeroImage = computed(() => {
  try {
    const blob = conference.value.heroImageBlob || conference.value.imageBlob

    return blob ? URL.createObjectURL(blob) : 'https://attachments.cbd.int/cbd-logo-en.svg'
  }
  catch { return false }
})

const showAbout = computed(() => {
  const { hasAbout } = conference.value || {}

  return hasAbout || aboutExists.value
})

const buttons = computed(() => (conference.value.buttons || []).filter(b => b.status))

function toggleSettings() { bus.emit('toggleSetting') }
</script>

<style scoped>
  .home{ padding-bottom: 3em; }
  .hero  {   display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 80%; max-height: 50vh;}
  .btn-index { width:100%; background-color: rgb(1, 70, 58); text-align: left; font-size: 1em; text-align: center; margin-bottom: 1em;}
</style>

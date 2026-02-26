<template>
  <div v-if="title" class="container-fluid home">
    <Article :content="content" :blob="blob" :title="title" />
  </div>
</template>

<script setup>
import { ref                } from 'vue'
import { useAboutStore     } from '~/stores/about'
import { useRoutesStore    } from '~/stores/routes'

const route       = useRoute()
const routesStore = useRoutesStore()
const aboutStore  = useAboutStore()

const { conferenceCode } = route.params

routesStore.setShowMeetingNav(false)

const { data: aboutData } = await useAsyncData(
  `about-${conferenceCode}`,
  () => aboutStore.get(conferenceCode)
)

const content = ref(aboutData.value?.content || null)
const title   = ref(aboutData.value?.title   || null)
const blob    = ref(
  aboutData.value?.blob ? URL.createObjectURL(aboutData.value.blob) : null
)
</script>


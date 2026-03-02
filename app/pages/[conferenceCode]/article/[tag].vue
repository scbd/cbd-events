<template>
  <div v-if="title" class="container-fluid home">
    <Article :content="content" :blob="blob" :title="title" />
  </div>
</template>

<script setup>
import { ref              } from 'vue'
import { useArticleStore } from '~/stores/article'
import { useRoutesStore  } from '~/stores/routes'

const route        = useRoute()
const routesStore  = useRoutesStore()
const articleStore = useArticleStore()

const { conferenceCode, tag } = route.params

routesStore.setShowMeetingNav(false)

const { data: articleData } = await useAsyncData(
  `article-${conferenceCode}-${tag}`,
  () => articleStore.get({ code: conferenceCode, tag })
)

const content = ref(articleData.value?.content || null)
const title   = ref(articleData.value?.title   || null)
const blob    = ref(
  articleData.value?.blob ? URL.createObjectURL(articleData.value.blob) : null
)
</script>
  <style>
  h1{
    font-size: 1.75rem;
    margin: 1rem 0 1rem 0;
  }
  h2{
    font-size: 1.4rem;
    margin: .5rem 0 .5rem 0;
  }
  </style>
  <style scoped>
    .home{ padding-bottom: 3em; }
    .hero  { align-self: start; width:95vw; }
  </style>
  
<template>
  <div class="container-fluid pb-5">
    <h3>Overview Calendar</h3>
    <overview :code="conferenceCode" :options="{ target: '_blank' }" />
  </div>
</template>

<script setup>
import overview          from '@scbd/conference-cal/dist/src/index'
import { useRoutesStore } from '~/stores/routes'

const route       = useRoute()
const routesStore = useRoutesStore()

routesStore.setShowMeetingNav(false)

const conferenceCode = route.params.conferenceCode
</script>
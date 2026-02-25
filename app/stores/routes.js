import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRoutesStore = defineStore('routes', () => {
  const route          = ref({})
  const prevRoute      = ref({})
  const initialized    = ref(false)
  const showMeetingNav = ref(false)
  const showNavs       = ref(true)
  const showSettings   = ref(false)
  const showMeetings   = ref(false)

  const conferenceCode = computed(() => route.value?.params?.conferenceCode || '')
  const meetingCode    = computed(() => route.value?.params?.meetingCode    || '')

  function setRoute(newRoute) {
    prevRoute.value  = { ...route.value }
    route.value      = newRoute
    if (!initialized.value) initialized.value = true
  }

  function setPrevRoute(newRoute) {
    prevRoute.value = newRoute
  }

  function setInit(value = true) {
    initialized.value = value
  }

  function setShowMeetingNav(value = true) {
    showMeetingNav.value = value
  }

  function setShowNavs(value = true) {
    showNavs.value = value
  }

  function toggleMeetings() {
    showMeetings.value = !showMeetings.value
  }

  return {
    route, prevRoute, initialized, showMeetingNav, showNavs, showSettings, showMeetings,
    conferenceCode, meetingCode,
    setRoute, setPrevRoute, setInit, setShowMeetingNav, setShowNavs, toggleMeetings,
  }
})

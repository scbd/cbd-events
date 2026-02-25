<template>
  <section>
    <transition name="slide-fade">
      <nav v-if="showNavs" class="mainn navbar  navbar-default" @click="toggleSideMenu()">
        <div class="container pl-1 pr-1">
          <img :src="`${config.public.attachments}/cbd-leaf-green.svg`" class="header-nav-img" :alt="$t('scbdLeafLogo')">

          <div class="title">
            <b>{{ lstring(conference.title) }}</b>
          </div>

          <SideMenu :is-open="isSideMenuOpen" />
        </div>
        <div class="sub" v-if="showMeetingNav">
          <div class="sub-con" @click="toggle()">
            <b v-if="meeting.title"> {{ meeting.evtCd }} </b>
            <b v-else> {{ lstring(meeting.subTitle) }} </b>
            <Icon name="select-arrows" in-text="true" />
          </div>
        </div>
      </nav>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useConferencesStore } from '~/stores/conferences'
import { useRoutesStore } from '~/stores/routes'
import { useBus } from '~/composables/use-bus'
import { lstring } from '~/utils/filters'
import SideMenu from '~/components/header/side-menu.vue'

const config           = useRuntimeConfig()
const { $swal }        = useNuxtApp()
const { t }            = useI18n()
const router           = useRouter()
const route            = useRoute()
const bus              = useBus()

const conferencesStore = useConferencesStore()
const routesStore      = useRoutesStore()

const { showMeetingNav, showNavs } = storeToRefs(routesStore)
const { selected, selectedMeeting } = storeToRefs(conferencesStore)

const conference = computed(() => {
  try {
    if (!selected.value) return {}
    return selected.value.apps?.cbdEvents || {}
  } catch (e) { return {} }
})

const meeting = computed(() => selectedMeeting.value || {})

const isSideMenuOpen = ref(false)

function toggleSideMenu() { isSideMenuOpen.value = !isSideMenuOpen.value }
function closeSideMenu()  { isSideMenuOpen.value = false }

function toggle() {
  const { locale } = useI18n()
  router.push({ name: `conferenceCode-meetingCode-meetings___${locale.value}`, params: route.params })
}

function offlineNotice() {
  $swal.fire({
    title: t('internetConnectionLost'),
    text : t('internetConnectionLostDescription'),
    icon : 'warning'
  })
}

function onlineNotice() {
  $swal.fire({ title: t('internetConnectionRestored'), icon: 'success' })
}

let scrolled      = false
let lastScrollTop = 0

function onScroll(e) {
  if ((window.scrollY < 0 || document.documentElement.scrollTop < 0) ||
      (window.scrollY === 0 && document.documentElement.scrollTop === 0)) {
    scrolled = false
    e.preventDefault()
    e.stopPropagation()
    return
  }
  scrolled = true
}

function hasScrolled() {
  const doc  = document.documentElement
  const top  = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
  const diff = Math.abs(top - lastScrollTop)

  if (top < lastScrollTop && diff > 25) routesStore.setShowNavs(true)
  if (top > lastScrollTop && diff > 25) routesStore.setShowNavs(false)
  if (diff > 25) lastScrollTop = top
}

onMounted(() => {
  bus.on('toggleSetting', toggleSideMenu)
  bus.on('close-setting', closeSideMenu)

  if (!import.meta.client) return
  window.addEventListener('scroll', onScroll)
  window.addEventListener('online', onlineNotice)
  window.addEventListener('offline', offlineNotice)
  setInterval(() => {
    if (scrolled) {
      hasScrolled()
      scrolled = false
    }
  }, 250)
})

onBeforeUnmount(() => {
  bus.off('toggleSetting', toggleSideMenu)
  bus.off('close-setting', closeSideMenu)

  if (!import.meta.client) return
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('online', onlineNotice)
  window.removeEventListener('offline', offlineNotice)
})
</script>

<style scoped>
  .pull-right { float: right; margin:.2em 0 0 0; }
  .pull-left { float: left; margin-left: -5px; }
  .brand { vertical-align: top; line-height: 1.4em; }
  .header-nav-img { margin-bottom: 3px; max-height: 1.3em; position: relative; }
  .slide-fade-enter-active { transition: all .3s ease; }
  .slide-fade-leave-active { transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0); }
  .slide-fade-enter, .slide-fade-leave-to { transform: translatey(-35px); opacity: 0; }
  .sub-con { background-color:rgba(0,0,0,0.40); width:100vw; height: 45px; padding: .6em 0 0 0; }
  .sub {
    color:white;
    background-color: rgba(0,0,0,0);
    background: #bdc3c7; /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(left top, #bdc3c7, #2c3e50); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(bottom right, #bdc3c7, #2c3e50); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(bottom right, #bdc3c7, #2c3e50); /* For Firefox 3.6 to 15 */
    background: linear-gradient(to bottom right, #bdc3c7, #2c3e50); /* Standard syntax (must be last) */
    border: none;
  }
  .mainn {
    text-align: center;
    color:#333;
    padding: 0 0 0 0;
    background-color: white;
    min-height: 30px;
    border:0;
    border-bottom: 1px solid #e7e7e7;
    border-radius:0;
    border-bottom: 1px solid rgb(231, 231, 231);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
    margin:0;
    transition: top 0.2s ease-in-out;
    position:fixed;
    top:0px;
    z-index:99999;
    width:100%;
  }
  @media (max-width: 320px) {
    .title{ font-size: .9em; }
  }
</style>

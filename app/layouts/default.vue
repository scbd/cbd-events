<template>
  <div>
    <Icons />
    <Header />
    <main class="main-view">
      <slot />
      <Loading v-if="state" :percent="percent" :state="state" />
    </main>
    <Nav />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { StatusBar }   from '@capacitor/status-bar'
import { updateOTA }   from '~/composables/useOta'
import { usePlatform } from '~/composables/use-platform'
import { useOffLineStore } from '~/stores/off-line'
import Header  from '~/components/header/header.vue'
import Nav     from '~/components/navigation/index.vue'
import Loading from '~/components/loading.vue'

const { isNative } = usePlatform()
const offLineStore = useOffLineStore()

const percent = ref(null)
const state   = ref(null)

function onProgress(info) {
  percent.value = info.percent
  state.value   = 'downloading'

  if (percent.value !== 100) return

  state.value = 'downloadComplete'
  setTimeout(() => { state.value = 'installing' }, 750)
  setTimeout(() => { percent.value = null }, 2000)
  setTimeout(() => { state.value = null }, 2000)
}

function syncError(e) { console.error(`OTA Error: ${e.message}`) }

function onResume() {
  setTimeout(() => { updateOTA(onProgress, syncError) }, 0)
}

function toggleConnection() { offLineStore.toggle() }

if (import.meta.client) {
  window.addEventListener('online', toggleConnection)
  window.addEventListener('offline', toggleConnection)
  offLineStore.set(window.navigator.onLine)
}

onMounted(async () => {
  if (!isNative.value) return

  StatusBar.setBackgroundColor({ color: '#000000' })
  await updateOTA(onProgress, syncError)
  document.addEventListener('resume', onResume, false)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  window.removeEventListener('online', toggleConnection)
  window.removeEventListener('offline', toggleConnection)
  document.removeEventListener('resume', onResume)
})
</script>

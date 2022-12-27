<template>
  <div>
    <Icons />
    <Header />
    <main class="main-view">
      <nuxt />
      <Loading v-if="state" :percent="percent" :state="state"/>
    </main>
    <Nav />
  </div>
</template>

<script>
import   Header      from '~/components/header/header'
import   Nav         from '~/components/navigation/index'
import { updateOTA } from '~/composables/over-the-air'
import { StatusBar } from '@capacitor/status-bar'

export default {
  name      : 'Default',
  components: { Header, Nav, Loading: () => import('~/components/Loading')  },
  methods   : { toggleConnection, onProgress, onResume },
  beforeMount, mounted, data
}

function data(){ return{ percent: null, state: null } }

async function mounted(){
  StatusBar.setBackgroundColor({ color: '#000000'})
  const t = await updateOTA(this.onProgress, syncError)

  document.addEventListener('resume', this.onResume, false)
}

function beforeMount(){
  if(process.server) return

  window.addEventListener('online', this.toggleConnection)
  window.addEventListener('offline', this.toggleConnection)
  
  this.$store.commit('offLine/SET', window.navigator.onLine)
}

function onProgress (info){
  this.percent = info.percent
  this.state   = 'downloading'

  if(this.percent != 100) return
  
  this.state = 'downloadComplete'
  setTimeout(() =>  this.state = 'installing', 750)
  setTimeout(() =>  this.percent = null, 2000)
  setTimeout(() =>  this.state = null, 2000)
}

function syncError       (e){ console.error(`OTA Error: ${e.message}`) }
function onResume        (){ setTimeout(() => { updateOTA(this.onProgress, syncError) }, 0) }
function toggleConnection(){ this.$store.commit('offLine/TOGGLE') }
</script>

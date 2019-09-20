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
import Header  from '~/components/header/header'
import Nav     from '~/components/navigation/index'

export default {
  name      : 'Default',
  components: { Header, Nav, Loading: () => import('~/components/Loading')  },
  methods   : { toggleConnection, onProgress, sync, onResume },
  beforeMount,
  mounted,
  data
}
function data(){ return{ percent: null, state: null } }

function mounted(){
  this.sync()
  document.addEventListener('resume', this.onResume, false)
}

function sync(){
  const { codePush } = window

  if(!codePush) return

  const syncOptions = {
    updateDialog: {
      appendReleaseDescription: true,
      descriptionPrefix       : '\n\nChange log:\n'
    },
    installMode: window.InstallMode.IMMEDIATE
  }

  codePush.sync(null, syncOptions, this.onProgress, syncError)
}

function beforeMount(){
  if(process.server) return

  window.addEventListener('online', this.toggleConnection)
  window.addEventListener('offline', this.toggleConnection)
  
  this.$store.commit('offLine/SET', window.navigator.onLine)
}

function onProgress (downloadProgress){
  this.percent = ~~((downloadProgress.receivedBytes/downloadProgress.totalBytes)*100)
  this.state   = 'downloading'

  if(this.percent != 100) return
  
  this.state = 'downloadComplete'
  setTimeout(() =>  this.state = 'installing', 750)
  setTimeout(() =>  this.percent = null, 2000)
  setTimeout(() =>  this.state = null, 2000)
}

function syncError       (e){ console.log('error', e) }
function onResume        (){ setTimeout(() => { this.sync() }, 0) }
function toggleConnection(){ this.$store.commit('offLine/TOGGLE') }
</script>

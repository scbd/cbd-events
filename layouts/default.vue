<template>
  <div >
    <Icons/>
    <Header/>
    <main class="main-view">
      <nuxt/>
    </main>
    <Nav/>
  </div>
</template>

<script>
import VueNotifications from 'vue-notifications'
  import Icons             from '~/components/icons'
  import Header             from '~/components/header/header'
  import Nav                from '~/components/navigation/index'
  export default {
    name:'default',
    components:{Header,Nav,Icons},
    methods:{
      toggleConnection:toggleConnection
    },
    beforeMount(){
      if(process.server) return
      window.addEventListener('online', this.toggleConnection );
      window.addEventListener('offline', this.toggleConnection );
      this.$store.commit('offLine/SET',window.navigator.onLine)
    }
  }
  function toggleConnection(){
    this.$store.commit('offLine/TOGGLE')
  }

</script>

<template>
  <section>
    <Header :title="title"/>
    <div  class="iframe-container">
      <iframe ref="viewFrame" :src="blob"></iframe>
    </div>
  </section>
</template>

<script>
  import Header from '~/components/header/header-bottom-screen'

  export default {
    name:"fileVue",
    components:{Header},
    layout:'bottom-screen',
    async asyncData ({app, store}) {
      return {
        title:app.i18n.t('viewFile'),
        blob:store.state.files.fileToOpen
      }
    },
    methods:{
      done:done
    },
    mounted(){
      this.$root.$on('bottom-screen-done',done)
      console.log('this.$refs.viewFrame.offsetWidth',window.innerWidth)
    }
  }
  function done(localeCode){
    this.$router.go(-1)
  }

</script>
<style scoped>
.iframe-container {
    position: relative;
    padding-top: 100%;
    height: 100vh;
    width:100vw;
}
.iframe-container iframe {
  position: absolute;
    top: 10px;
    left: -50px;
    width: 100vw;
    height: 100vw;
    border: 0;
}
</style>

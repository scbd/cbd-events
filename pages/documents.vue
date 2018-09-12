<template>
  <div class="container-fluid debug">
        <iframe class="docs-frame" src="https://www.cbd.int/conferences/2018/cop-14/documents"></iframe>
  </div>
</template>

<script>
  export default {
    components: {},
    async asyncData ({store,params,route}) {
  console.log('docs asyncData')
    },
    watchQuery: ['state'],
    mounted(){
            console.log('docs mounted')
      // this.$router.push({
      //   path: `${this.$router.currentRoute.path}`
      // })this.$store.dispatch('conferences/get')
      // let {conference} =  this.$router.params
// this.$store.dispatch('requests/get',{conference:'2018',requestType:'media',requestType:this.$route.query.state})
    }
  }
</script>

<style>

.docs-frame{
  width:100%;
  height:95vh;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.right{
  border-left: 1px solid black;
}
</style>

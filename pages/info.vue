<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xs-6">
                 {{$t('info')}}
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    components: {},
    async asyncData ({store,params,route}) {
  console.log('info async data')
    },
    watchQuery: ['state'],
    mounted(){
            console.log('info mounted')
      // this.$router.push({
      //   path: `${this.$router.currentRoute.path}`
      // })this.$store.dispatch('conferences/get')
      // let {conference} =  this.$router.params
// this.$store.dispatch('requests/get',{conference:'2018',requestType:'media',requestType:this.$route.query.state})
    }
  }
</script>

<style>

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

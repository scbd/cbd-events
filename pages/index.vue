<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xs-6">
         {{$t('home')}}<br>
         {{$i18n.path({name:'calendar'})}} <br>
         <nuxt-link :to="$i18n.path({name:'calendar'})">fdskjhkjfshkjdfhkjsdfskhjdfkhjsfd</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    components: {},
    async asyncData ({store,params,router}) {
      console.log('index asyncData')
    },
    watchQuery: ['state'],
    mounted(){
            console.log('index mounted mounted')
      // this.$router.push({
      //   path: `${this.$router.currentRoute.path}`
      // })this.$store.dispatch('conferences/get')
      // let {conference} =  this.$router.params
//this.$store.dispatch('requests/get',{conference:'2018',requestType:'media',requestType:this.$route.query.state})
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

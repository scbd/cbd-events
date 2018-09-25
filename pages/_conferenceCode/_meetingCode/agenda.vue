<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xs-12">
        <object width="100%" height="900px" data="https://www.cbd.int/doc/c/e229/100c/86927ed18cf09f7fecfab822/cop-14-01-en.pdf"></object>
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    components: {},
    async asyncData ({store,params,route}) {

    },
    // watchQuery: ['state'],
    mounted(){
          
      // this.$router.push({
      //   path: `${this.$router.currentRoute.path}`
      // })this.$store.dispatch('conferences/get')
      // let {conference} =  this.$router.params
      //this.$store.dispatch('requests/get',{conference:'2018',requestType:'media',requestType:this.$route.query.state})
    }
  }
</script>

<style>
.pdf-frame{
  position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    border: 0;
}
.pdf-cont {
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;

     display: block;
     height: 0;
     padding: 0;

}
</style>

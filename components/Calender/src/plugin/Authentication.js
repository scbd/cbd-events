
export default {
  install(Vue, options){
    Vue.mixin({
      mounted (){
        if(this.$refs.authFrame)
          alert('authFrame installed')
      }
    })
  }
}

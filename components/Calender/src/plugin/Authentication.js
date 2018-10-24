
export default {
    install(Vue, options){
      Vue.mixin({
        mounted: function () {
          if(this.$refs.authFrame)
            alert('authFrame installed')


        }
      })
    }
}

<template>
  <div class="container-fluid home"> <div class="row"> <div class="col-12 "> <Offline v-if="offline" /> </div> </div> </div>
</template>

<script>
import Offline from '~/components/Offline'


export default {
  name      : 'offline',
  components: { Offline },
  methods   : { notice, redirect },
  data,
  mounted
}
function data(){
  return { offline: false }
}
function mounted(){
  this.offline = true
  this.notice()
}

function notice(){
  this.$swal.fire({
    title            : this.$i18n.t('offline'),
    text             : this.$i18n.t('offlineMsg'),
    type             : 'error',
    confirmButtonText: this.$i18n.t('tryAgain'),
    onAfterClose     : this.redirect
  })
}

function redirect(){
  const { codePush } = window

  codePush.restartApplication()
}
</script>

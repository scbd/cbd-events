<template>
  <div class="container-fluid home">
    <div class="row">
      <div class="col-12">
        <Offline v-if="offline" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { t }   = useI18n()
const nuxtApp = useNuxtApp()
const offline = ref(false)

onMounted(async () => {
  offline.value = true
  await nuxtApp.$swal.fire({
    title            : t('offline'),
    text             : t('offlineMsg'),
    type             : 'error',
    confirmButtonText: t('tryAgain'),
  })
})
</script>

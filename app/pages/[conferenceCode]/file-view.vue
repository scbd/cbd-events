<template>
  <section>
    <Header :title="title" />
    <div class="iframe-container">
      <iframe ref="viewFrame" :src="blob" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs                     } from 'pinia'
import { useFilesStore                   } from '~/stores/files'
import { useBus                          } from '~/composables/use-bus'

definePageMeta({ layout: 'bottom-screen' })

const { t }  = useI18n()
const router = useRouter()
const bus    = useBus()

const { fileToOpen } = storeToRefs(useFilesStore())

const title = t('viewFile')
const blob  = ref(fileToOpen.value || null)

function done() { router.go(-1) }

onMounted(()        => { bus.on('bottom-screen-done', done) })
onBeforeUnmount(()  => { bus.off('bottom-screen-done', done) })
</script>
<style scoped>
.iframe-container { position: relative; padding-top: 100%; height: 100vh; width:100vw; }
.iframe-container iframe {
  position: absolute;
    top: 10px;
    left: -50px;
    width: 100vw;
    height: 100vw;
    border: 0;
}
</style>

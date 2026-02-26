<template>
  <section>
    <Header :title="title" />
    <div class="page container-fluid">
      <div class="row">
        <div class="list-group">
          <li
            class="list-group-item"
            v-for="locale in locales"
            :key="locale.code"
            @click="changeLanguage(locale.code)"
          >
            {{ $t(locale.code) }}
          </li>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useBus                     } from '~/composables/use-bus'

definePageMeta({ layout: 'bottom-screen' })

const { t, locales, setLocale } = useI18n()
const router                    = useRouter()
const bus                       = useBus()

const title = t('language')

async function changeLanguage(localeCode) {
  await setLocale(localeCode)
}

function done() { router.go(-1) }

onMounted(()      => bus.on('bottom-screen-done', done))
onBeforeUnmount(() => bus.off('bottom-screen-done', done))
</script>

<style scoped>
  .page { margin-top:50px; height:100vh; }
</style>

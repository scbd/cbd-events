<template>
  <section>
    <Icon name="cog" is-text="true"/>
    <transition name="test">
      <div class="side-menu" v-if="isOpen" >
        <div style="position:relative; text-align: right;">
          <Icon  name="close"/>
        </div>

            <h4>{{ $t('settings') }}</h4>
            

            <div class="list-group">
              <NuxtLink :to="localePath({name:'conferenceCode-conferences', params: { conferenceCode: conferenceCode } })">
                <button class="list-group-item" >
                  <svg class="icon"><use href="#icon-transfer" /></svg> {{ switchConference }}
                </button>
              </NuxtLink>
            </div>
            <div class="list-group" @click="deleteAll()" >
              <button type="button" class="list-group-item" >
                <svg class="icon"><use href="#icon-trash-o" /></svg> {{ deleteAllDownloads }}
              </button>
            </div>
              
            <h4 class="mt-4">{{ $t('contactUs') }}</h4>
            <div class="list-group">
              <a href="tel:1-514-288-2220">
                <button type="button" href="tel:1-514-288-2220" class="list-group-item" >
                <svg class="icon"><use href="#icon-phone" /></svg>{{ $t('callThe') }} {{ $t('scbd') }} <span class="email">1.514.288.2220</span></button>
              </a>
            </div>
            <div class="list-group">
              <a href="mailto:secretariat@cbd.int">
                <button type="button" class="list-group-item" >
                <svg class="icon"><use href="#icon-envelope" /></svg>
                  {{ $t('emailThe') }} {{ $t('scbd') }}
                  <span class="email">secretariat@cbd.int</span>
                </button>
              </a>
            </div>
            <div class="list-group">
              <a :href="`mailto:${supportEmail}`">
                <button type="button" class="list-group-item" >
                <svg class="icon"><use href="#icon-envelope" /></svg>
                  {{ $t('IT Support') }}
                  <span class="email">{{supportEmail}}</span>
                </button>
              </a>
            </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConferencesStore } from '~/stores/conferences'
import { useFilesStore } from '~/stores/files'

defineProps({ isOpen: { type: Boolean, default: false } })

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const conferencesStore = useConferencesStore()
const filesStore       = useFilesStore()

const { selected } = storeToRefs(conferencesStore)

const conferenceCode = computed(() => route.params.conferenceCode || '')

const conference = computed(() => selected.value || {})

const supportEmail = computed(() => {
  const { supportEmail } = conference.value?.apps?.cbdEvents || { supportEmail: 'it@cbd.int' }
  return supportEmail
})

const switchConference    = computed(() => t('switchConference'))
const deleteAllDownloads  = computed(() => t('deleteAllDownloads'))

async function deleteAll() {
  filesStore.setDownloading(true)
  await filesStore.removeAll()
  filesStore.setDownloading(false)
}
</script>

<style scoped>
section{display:inline-block;}
.icon{margin-bottom:7px; margin-right:7px;}
.icon-cog{margin-bottom:7px;}
.email{ color:#337ab7; float:right; }
.logo{ max-height: 1.3em; }
 h1{ margin: 1em 1em 1em 1em; }
.list-group-item{ font-size: 1em; width:100%; text-align:left; }
.side-menu{ position:absolute; top:30px; left:1px; height:100vh; width:99vw; background-color: #eee; }
.test-enter-active { transition: all .2s ease; }
.test-leave-active { transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0); }
.test-enter { transform: translatex(100vw); opacity: 0; }
.test-leave-to { transform: translatex(100vw); opacity: 0; }
.active{ color:#337ab7; }

.pullRight { float: right; margin:0 0 0 0; }
</style>

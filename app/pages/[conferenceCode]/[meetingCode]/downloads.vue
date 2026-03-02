<template>
  <div class="container">
    <section v-for="(file, $index) in files" :key="file.name">
      <div class="row file ps-3 pe-3">
        <div class="col-1 paddingless" @click="handleOpenFile(file)">
          <Icon v-if="isMsWord(file.type)" name="file-word-o" x="2" in-text="true"/>
          <Icon v-else-if="isPDF(file.type)" name="file-pdf-o" x="2" in-text="true"/>
          <Icon v-else name="file-empty" x="2" in-text="true"/>
        </div>
        <div
          :class="{'col-10':(isIOS && !isIpadDevice), 'col-11':(!isIOS || isIpadDevice)}"
          @click="handleOpenFile(file)"
        >
          {{ trimName(file.baseName) }}<br>
          {{ timeDisplay(file.lastModified) }}
          <span class="point">●</span> {{ formatBytes(file.size) }}
        </div>
        <div v-if="isIOS" class="col-1 paddingless text-center" @click="handleShareFile(file)">
          <svg class="icon x2"><use href="#icon-share-alternitive" /></svg>
        </div>
      </div>
      <hr class="hr" v-if="$index != files.length-1">
    </section>

    <section v-if="!files.length">
      <div class="text-center">
        <br><br><br><br>
        <span>No files downloaded for the <br><b>{{ lstring(meeting.title) }}</b></span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs         } from 'pinia'
import { useFilesStore       } from '~/stores/files'
import { useConferencesStore } from '~/stores/conferences'
import { useRoutesStore      } from '~/stores/routes'
import { usePlatform         } from '~/composables/use-platform'
import { isIpad              } from '~/utils/device'
import { isPDF, isMsWord     } from '~/utils/mime-types'
import { openFile, shareFile, setOpenSafariFn } from '~/utils/cordova-files'
import { lstring, trimName, timeDisplay, formatBytes } from '~/utils/filters'

const route      = useRoute()
const router     = useRouter()
const localePath = useLocalePath()

const filesStore       = useFilesStore()
const conferencesStore = useConferencesStore()
const routesStore      = useRoutesStore()
const { platform }     = usePlatform()

const { conferenceCode } = route.params

const { files }   = storeToRefs(filesStore)
const { meeting } = storeToRefs(conferencesStore)

const isIOS        = computed(() => platform === 'ios')
const isIpadDevice = computed(() => isIpad())

// Capacitor stub — openFile/shareFile still expect a $cordova-shaped arg
// but only use $cordova.file for directory paths that writeFile() no longer needs
const cordovaStub = { file: {} }

function handleOpenFile(file)  { openFile(file, cordovaStub) }
function handleShareFile(file) { shareFile(file, cordovaStub) }

function openSafari({ blob }) {
  const name       = 'conferenceCode-fileView'
  const params     = { conferenceCode }
  const routerPath = localePath({ name, params })
  const blobUrl    = window.URL.createObjectURL(blob)

  filesStore.setFileToOpen(blobUrl)
  router.push(routerPath)
}

// Setup
filesStore.load()
routesStore.setShowMeetingNav(false)

onMounted(() => {
  setOpenSafariFn(openSafari)
})
</script>

<style scoped>
.point{ font-size:.5em; vertical-align:middle; }
.page-view{ margin-top:85px; }
.file{ min-height: 50px; cursor: pointer; }
.hr{ margin: 0 -15px 1em -15px; }
</style>


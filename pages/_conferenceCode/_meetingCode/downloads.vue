<template>
  <div class="container">
    <section v-for="(file, $index) in files" :key="file.name" >
      <div class="row file pl-3 pr-3">
        <div class="col-1 paddingless" @click="openFile(file, $cordova)" >
          <Icon v-if="isMsWord(file.type)" name="file-word-o" x="2" in-text="true"/>
          <Icon v-else-if="isPDF(file.type)" name="file-pdf-o" x="2" in-text="true"/>
          <Icon v-else name="file-empty" x="2" in-text="true"/>
        </div>
        <div
          :class="{'col-10':(isIOS && !isIpad), 'col-11':(!isIOS || isIpad)}"
          @click="openFile(file, $cordova)"
        >
          {{ file.baseName | trimName }}<br>
          {{ file.lastModified | timeDisplay }}
          <span class="point">●</span> {{ file.size | formatBytes }}
        </div>
        <div v-if="isIOS" class="col-1 paddingless text-center" @click="shareFile(file, $cordova)" >
          <svg class="icon x2"><use xlink:href="#icon-share-alternitive" /></svg>
        </div>
      </div>
      <hr class="hr" v-if="$index != files.length-1" >
    </section>

    <section v-if="!files.length">
      <div class="text-center">
        <br><br><br><br>
        <span>No files downloaded for the <br><b>{{ meeting.title | lstring}}</b></span>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { isIOSCordova, isIpad                    } from '~/modules/Device'
import { isPDF,    isMsWord                      } from '~/modules/MimeTypes'
import { openFile, shareFile,   setOpenSafariFn  } from '~/modules/CordovaFiles'
import { lstring, trimName, timeDisplay, formatBytes      } from '~/plugins/filters'

export default {
  name    : 'Downloads',
  methods : {  isPDF, isMsWord, openFile, shareFile, openSafari },
  computed: { isIOS, isIpad, ...gettersMap() },
  filters : { trimName, timeDisplay, formatBytes, lstring },
  asyncData,
  mounted
}

function gettersMap(){
  return mapGetters({
    meeting: 'conferences/meeting',
    files  : 'files/all'
  })
}

async function asyncData ({ store, params }){
  const { conferenceCode } = params

  await store.dispatch('files/LOAD')
  store.commit('routes/SET_SHOW_MEETING_NAV', false)

  return { conferenceCode }
}

function isIOS(){
  try{ return isIOSCordova(this.$cordova.device) }
  catch(e){ return {} }
}

function mounted (){
  if(!this.$cordova) this.$cordova = null
  setOpenSafariFn(this.openSafari)
}

function openSafari({ blob }){
  const name       = 'conferenceCode-fileView'
  const params     = { conferenceCode: this.conferenceCode }
  const routerPath = this.localePath({ name, params })
  const blobUrl    = window.URL.createObjectURL(blob)

  this.$store.commit('files/SET_FILE_TO_OPEN', blobUrl)
  this.$router.push(routerPath)
}

</script>

<style scoped>
.point{ font-size:.5em; vertical-align:middle; }
.page-view{ margin-top:85px; }
.file{ min-height: 50px; cursor: pointer; }
.hr{ margin: 0 -15px 1em -15px; }
</style>


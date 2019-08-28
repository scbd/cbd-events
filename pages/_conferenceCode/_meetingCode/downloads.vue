<template>
  <div class="page-view container-fluid">
    <section v-for="(file, $index) in files" :key="file.name" >
      <div class="file">
        <div class="col-xs-1 paddingless" @click="openFile(file)" >
          <svg v-if="!isPDF(file.type)" class="icon x2 word" >
            <use xlink:href="#icon-file-word-o" />
          </svg>
          <svg v-if="isPDF(file.type)" class="icon x2 pdf" >
            <use xlink:href="#icon-file-pdf-o" />
          </svg>
        </div>
        <div
          :class="{'col-xs-10':(isIOS && !isIpad), 'col-xs-11':(!isIOS || isIpad)}"
          @click="openFile(file)"
        >
          {{ file.baseName | trimName }}<br>
          {{ timeDisplay(file.lastModified) }}
          <span class="point">●</span> {{ formatBytes(file.size,2) }}
        </div>
        <div v-if="isIOS && !isIpad" class="col-xs-1 paddingless text-center" @click="shareFile(file)" >
          <svg class="icon x2"><use xlink:href="#icon-share-alternitive" /></svg>
        </div>
      </div>
      <hr class="hr" v-if="$index != files.length-1" >
    </section>

    <section v-if="!files.length">
      <div class="text-center">
        <br><br><br><br>
        <span>No files downloaded for the <br><b>{{ meeting.title }}</b></span>
      </div>
    </section>
  </div>
</template>

<script>
import { DateTime    } from 'luxon'
import { formatBytes } from '~/modules/helpers'
import   localFiles    from '~/modules/localFileSystem.js'
  
export default {
  name: 'Downloads',

  methods : { isPDF, timeDisplay, formatBytes, openFile, shareFile, saveCordovaFileLocally, openSafariPWA },
  computed: { files, meeting, isIpad },
  filters : { trimName },
  asyncData,
  created
}

function asyncData ({ store, params }){
  store.commit('routes/SET_SHOW_MEETING_NAV', true)
  return {
    conferenceCode: params.conferenceCode,
    meetingCode   : params.meetingCode,
    isIOS         : false
  }
}

function   created(){ this.isIOS = !!this.$cordova }

function trimName (name){
  const value = name.replace(/\.[^/.]+$/, '')

  if (!value) return ''
  if (value.length<30) return value

  return `${value.substr(0, 13)}...${value.substr(value.length-13, value.length-1)}`
}

function isIpad (){
  if(process.server) return false
  return !!window.navigator.userAgent.match(/iPad/i)
}
  
async function shareFile(file){
  const fileURL = await this.saveCordovaFileLocally(file)

  const rect =  [ 0, 0, innerWidth / 2, 0 ];

  this.$cordova.fileOpener2.showOpenWithDialog(
    decodeURIComponent(fileURL),
    file.type,
    {
      error: (e) => { console.log('Error: ', e); },
      rect
    }
  )
}
  
async function saveCordovaFileLocally(file){
  try{
    const { tempDirectory, cacheDirectory } = this.$cordova.file
    const { baseName, blob }                = file
    const fileSyatemUrl                     = tempDirectory || cacheDirectory
 

    const dirEntry  = await localFiles.resolveLocalFileSystemURL(fileSyatemUrl)
    const fileEntry = await localFiles.getFile(dirEntry, baseName, { create: true, exclusive: false })

    await localFiles.write(fileEntry, blob)

    return fileEntry.toURL()
  }
  catch(e){
    console.error(e)
    throw e
  }
}
  
function meeting(){ return this.$store.state.conferences.selectedMeeting }
  
function openFile(file){
  const { $cordova } = this

  if ($cordova)             return openFileFromCordova($cordova, file)
  if (isInternetExplorer()) return window.navigator.msSaveOrOpenBlob(file.blob)
  if (isSafari())           return this.openSafariPWA(file)
  
  return openFileDefault(file)
}

function isInternetExplorer (){
  return (window && window.navigator && window.navigator.msSaveOrOpenBlob)
}

function createBlobUrl({ blob }){
  const opts = 'toolbartranslucent=yes,enableViewportScale=yes,hidenavigationbuttons=yes,hidespinner=yes,location=no'

  return window.URL.createObjectURL(blob, '_blank', opts)
}

function isSafari(){
  const userAgentHasSafari = ~navigator.userAgent.search('Safari')
  const userAgentHasChrome = ~navigator.userAgent.search('Chrome')

  return userAgentHasSafari && userAgentHasChrome
}

function isIOS({ platform }){ return platform === 'iOS' }

function openFileDefault({ blob, baseName }){
  const data = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href     = data
  link.download = baseName
  link.click()

  // For Firefox it is necessary to delay revoking the ObjectURL
  return setTimeout(() => window.URL.revokeObjectURL(data), 100)
}

async function openFileFromCordova($cordova, file){
  const { fileOpener2, device } = $cordova

  if(isIOS(device)) return openFileFromIOS($cordova, file)

  const fileURL = await this.saveCordovaFileLocally(file)
  const error   = fileOpener2Error
  const success = fileOpener2Success
      
  return fileOpener2.open(fileURL, 'application/pdf', { error, success })
}

function fileOpener2Error(e){
  console.log('Error status: ' + e.status + ' - Error message: ' + e.message)
  throw e
}

function fileOpener2Success(){
  console.log('file opened successfully')
}

function openFileFromIOS({ inAppBrowser }, file){
  const blobUrl = createBlobUrl(file)

  return inAppBrowser.open(blobUrl)
}

function openSafariPWA (fileObject){
  const name       = 'conferenceCode-fileView'
  const params     = { conferenceCode: this.conferenceCode }
  const routerPath = this.localePath({ name, params })
  const blobUrl    = window.URL.createObjectURL(fileObject.blob)

  this.$store.commit('files/SET_FILE_TO_OPEN', blobUrl)
  this.$router.push(routerPath)
}
  
function timeDisplay (isoDate){
  const format = 'LLL d'

  return DateTime.fromISO(isoDate).toFormat(format)
}
  
function isPDF (contentType){
  return !!~contentType.indexOf('application/pdf')
}
  
function files (){
  return this.$store.state.files.data.filter((file) => ~file.baseName.indexOf(this.meetingCode))
}
</script>
<style scoped>
.point{
  font-size:.5em;
  vertical-align:middle;
}
.page-view{
  margin-top:85px;
}
.file{
  min-height: 50px;
  cursor: pointer;
}
.pdf{
  fill:red;
}
.word{
  fill:blue;
}
.hr{
  margin: 0 -15px 1em -15px;
}
</style>


<template>
  <div class="page-view container-fluid" >
    
    <section v-for="(file, $index) in files" :key="file.name">
      <div class="file" >
        <div class="col-xs-1 paddingless" v-on:click="openFile(file)">
          <svg v-if="!isPDF(file.type)" class="icon x2 word"><use xlink:href="#icon-file-word-o"></use></svg>
          <svg v-if="isPDF(file.type)" class="icon x2 pdf"><use xlink:href="#icon-file-pdf-o"></use></svg>
        </div>
        <div :class="{'col-xs-10':(isIOS && !isIpad), 'col-xs-11':(!isIOS || isIpad)}" v-on:click="openFile(file)">
          {{file.baseName | trimName}}<br>
          {{timeDisplay(file.lastModified)}} <span class="point">●</span> {{formatBytes(file.size,2)}}
        </div>
        <div v-if="isIOS && !isIpad" class="col-xs-1 paddingless text-center" v-on:click="shareFile(file)">
          <svg class="icon x2"><use xlink:href="#icon-share-alternitive"></use></svg>
        </div>
      </div>
      <hr class="hr" v-if="$index != files.length-1">
    </section>
    <section v-if="!files.length">
      <div class="text-center">
        <br><br><br><br>
        <span>No files downloaded for the <br><b>{{meeting.title}}</b></span>
      </div>
    </section>
  </div>
</template>

<script>
  import {DateTime}     from 'luxon'
  import Header         from '~/components/header/header-bottom-screen'
  import {formatBytes}  from '~/modules/helpers'
  import localFiles    from '~/modules/localFileSystem.js'
  
  export default {
    name:"downloads",
    async asyncData ({store,params}) {
      store.commit('routes/SET_SHOW_MEETING_NAV',true)
      return {
          conferenceCode:params.conferenceCode,
          meetingCode:params.meetingCode,
          isIOS:false
        }
    },
    created(){
      this.isIOS = !!this.$cordova
    },
    methods:{
      isPDF:isPDF,
      timeDisplay:timeDisplay,
      formatBytes:formatBytes,
      openFile:openFile,
      shareFile:shareFile,
      saveIOSFile:saveIOSFile
    },
    computed:{
      files:files,
      meeting:meeting,
      isIpad:isIpad
    },
    filters: {
      trimName: function (name) {
        let value = name.replace(/\.[^/.]+$/, "")
        if (!value) return ''
        if (value.length<30) return value

        return `${value.substr(0,13)}...${value.substr(value.length-13,value.length-1)}`
      }
    }
  }
  
  function isIpad () {
    if(process.server) return false
    return !!window.navigator.userAgent.match(/iPad/i)
  }
  
  async function shareFile(file){
    
    let fileURL = await this.saveIOSFile(file)
    var rect =  [0, 0, innerWidth / 2, 0];
    this.$cordova.fileOpener2.showOpenWithDialog(
      decodeURIComponent(fileURL), 
      file.type, 
      { 
        error : function(e) { 
            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
        },
        rect:rect
      }
    )
  }
  
  async function saveIOSFile(file){
    try{
       let dirEntry = await localFiles.resolveLocalFileSystemURL(this.$cordova.file.tempDirectory)
       let fileEntry = await localFiles.getFile(dirEntry,file.baseName, { create: true, exclusive: false })
       let localUrl = await localFiles.write(fileEntry,file.blob)
       return fileEntry.toURL()
    } catch(e) {
      console.error(e)
      throw e
    }
  }
  
  function meeting(){
    return this.$store.state.conferences.selectedMeeting
  }
  
  function openFile(file){
    // IE doesn't allow using a blob object directly as link href
     // instead it is necessary to use msSaveOrOpenBlob

     if(this.$cordova)
       this.$cordova.inAppBrowser.open(window.URL.createObjectURL(file.blob),'_blank','toolbartranslucent=yes,enableViewportScale=yes,hidenavigationbuttons=yes,hidespinner=yes,location=no')
     
     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(file.blob);
       return;
     } 
    
     // For other browsers: 
     // Create a link pointing to the ObjectURL containing the blob.
     let data = window.URL.createObjectURL(file.blob);
     let link = document.createElement('a');
     link.href = data;
     link.download=file.baseName;
     link.click();
     
     // For Firefox it is necessary to delay revoking the ObjectURL
     setTimeout(()=>window.URL.revokeObjectURL(data), 100)
  }
  
  function timeDisplay (isoDate) {
    let format = 'LLL d'
    return DateTime.fromISO(isoDate).toFormat(format)
  }  
  
  function isPDF (contentType) {
    return !!~contentType.indexOf('application/pdf')
  }
  
  function files () {
    return this.$store.state.files.data.filter((file)=> ~file.baseName.indexOf(this.meetingCode))
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

<template>
  <div class="page-view container-fluid" >
    
    <section v-for="(file, $index) in files" :key="file.name">
      <div class="file" v-on:click="openFile(file)">
        <div class="col-xs-1 paddingless">
          <svg v-if="!isPDF(file.type)" class="icon x2 word"><use xlink:href="#icon-file-word-o"></use></svg>
          <svg v-if="isPDF(file.type)" class="icon x2 pdf"><use xlink:href="#icon-file-pdf-o"></use></svg>
        </div>
        <div class="col-xs-11">
          {{file.baseName | trimName}}<br>
          {{timeDisplay(file.lastModified)}} <span class="point">●</span> {{formatBytes(file.size,2)}}
        </div>
        <!-- <div class="col-xs-1 paddingless text-center">
          <svg class="icon x1-5"><use xlink:href="#icon-ellipsis-v"></use></svg>
        </div> -->
      </div>
      <hr class="hr" v-if="$index != files.length-1">
    </section>
  </div>
</template>

<script>
  import {DateTime} from 'luxon'
  import Header from '~/components/header/header-bottom-screen'
  import {formatBytes} from '~/modules/helpers'
  export default {
    name:"downloads",
    async asyncData ({store,params}) {
      store.commit('routes/SET_SHOW_MEETING_NAV',true)
      return {
          conferenceCode:params.conferenceCode,
          meetingCode:params.meetingCode
        }
    },
    methods:{
      isPDF:isPDF,
      timeDisplay:timeDisplay,
      formatBytes:formatBytes,
      openFile:openFile
    },
    computed:{
      files:files
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

  function openFile(file){
    // IE doesn't allow using a blob object directly as link href
     // instead it is necessary to use msSaveOrOpenBlob
     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(file.blob);
       return;
     } 
    
     // For other browsers: 
     // Create a link pointing to the ObjectURL containing the blob.
     const data = window.URL.createObjectURL(file.blob);
     let link = document.createElement('a');
     link.href = data;
     link.download=file.baseName;
     link.click();
     setTimeout(function(){
       // For Firefox it is necessary to delay revoking the ObjectURL
       window.URL.revokeObjectURL(data);
     , 100}
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
  margin-top:70px;
}
.file{
  min-height: 50px;
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

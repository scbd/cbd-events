<template>
  <div class="page-view">
    <iframe ref="docsFrame" class="docs-frame" :src="`${iFrameHost}/conferences/${conferenceCode}/${meetingCode}/documents?viewOnly=true`"></iframe>
  </div>
</template>

<script>
  import axios from 'axios'
  import path from 'path'
  import sizeOf from 'object-sizeof'
  import {DateTime} from 'luxon'
  export default {
    name:"documentsPage",
    async asyncData ({store,params,route}) {
      store.commit('routes/SET_SHOW_MEETING_NAV',true)

      return{
        conferenceCode:params.conferenceCode,
        meetingCode:params.meetingCode,
        iFrameHost:process.env.IFRAME_HOST
      }
    },
    methods:{
      saveFiles:saveFiles,
      getFileName:getFileName,
      createFileObj:createFileObj
    },
    created(){
      if(process.client && this.$nuxt.$loading.start)
        this.$nuxt.$loading.start()
    },
    mounted:function(){
      if (process.client){
        this.$store.dispatch('files/LOAD')
        window.addEventListener('message', this.saveFiles)
        this.$refs.docsFrame.onload = () => this.$nuxt.$loading.finish()
      }
    },
    beforeDestroy () {
      if(process.client)
        window.removeEventListener('scroll', this.onScroll)
    }

  }
  
  async function saveFiles({data}){
    let msg = data
    
    if(msg.type!=='saveFiles') return
    this.$nuxt.$loading.start()
    this.$store.commit('files/DOWNLOADING')
    let blobs = []
    let fileObjs = []
      
    for (let i = 0; i < msg.data.length; i++) 
      blobs[i] = axios({method:'get', url:msg.data[i]}).then((res)=>{
        msg.data[i] = { name:msg.data[i] }
        msg.data[i].type = res.headers['content-type']
        return new Blob([res.data],{name:msg.data[i],type:res.headers['content-type']})
      })
    
    blobs =  await Promise.all(blobs)
    
    for (let i = 0; i < msg.data.length; i++)
      fileObjs[i] =  this.createFileObj(msg.data[i], blobs[i])     
      
    await this.$store.dispatch('files/SAVE',fileObjs)
    this.$nuxt.$loading.finish()
    
    await this.$store.dispatch('files/LOAD')
    this.$store.commit('files/DOWNLOADING')
  }
  
  function createFileObj (fileData, blob){
    return {
      name:this.getFileName(fileData.name),
      baseName:path.basename(fileData.name),
      blob:blob,
      size:blob.size || sizeOf(blob),
      type:blob.type || fileData.type,
      lastModified: DateTime.local().toISO()
    }
  }
  
  function getFileName (fileUrl){
    let name = path.basename(fileUrl)
    let conferenceCode = this.$route.params.conferenceCode
    let meetingCode = this.$route.params.meetingCode
    return `/cbd-events/${conferenceCode}/${meetingCode}/${name}`
  }
</script>

<style scoped>
  .page-view{
    margin-top:60px;
  }
  .docs-frame{
    width:100%;
    height:85vh;
    border: none;
  }
  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }
  .links {
    padding-top: 15px;
  }
  .right{
    border-left: 1px solid black;
  }
</style>

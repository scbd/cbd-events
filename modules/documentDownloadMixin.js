import axios from 'axios'
import path from 'path'
import sizeOf from 'object-sizeof'
import {DateTime} from 'luxon'

export default {
  methods:{
    saveFiles:saveFiles,
    getFileName:getFileName,
    createFileObj:createFileObj,
    closeDialog:closeDialog
  },
  created(){
    if(process.server) return 
    
    if(this.$nuxt.$loading.start)
      this.$nuxt.$loading.start()

  },
  mounted:function(){
    if (process.client && this.$refs.docsFrame){
      this.$store.dispatch('files/LOAD')
      window.addEventListener('message', this.saveFiles)
      this.$refs.docsFrame.onload = () => this.$nuxt.$loading.finish()
    }
  },
  beforeDestroy () {
    if(process.client && this.$refs.docsFrame)
      window.removeEventListener('message', this.saveFiles)
  }

}
async function saveFiles({data}){
  let msg = data
  if(msg.type!=='saveFiles') return
  
  this.$store.commit('routes/SET_SHOW_NAVS',true)
  this.$nuxt.$loading.start()
  this.$store.commit('files/DOWNLOADING')
  let blobs = []
  let fileObjs = []

  for (let i = 0; i < msg.data.length; i++) {

    let downloadUri = msg.data[i].url
    if(process.env.PROXY_ENABLED)
      downloadUri = downloadUri.replace('https://www.cbd.int','')
    
    blobs[i] = axios({method:'get', url:downloadUri,responseType:'blob'}).then((res)=>{
      return res.data
    })
  }

  blobs =  await Promise.all(blobs)

  for (let i = 0; i < msg.data.length; i++)
    fileObjs[i] =  this.createFileObj(msg.data[i])     

  try{
    await this.$store.dispatch('files/SAVE',{ files:fileObjs, blobs:blobs})
  }catch(e){
    console.error(e)
  }
  
  this.$nuxt.$loading.finish()
  
  await this.$store.dispatch('files/LOAD')
  this.$store.commit('files/DOWNLOADING')
  this.closeDialog()
}

function closeDialog (){
  this.$refs.docsFrame.contentWindow.postMessage(JSON.stringify({ type : 'closeDialogRemote' }), process.env.IFRAME_HOST)
}

function createFileObj (fileData){
    fileData.name = this.getFileName(fileData.name),
    fileData.baseName = path.basename(fileData.name),
    fileData.size = fileData.size || blob.size || sizeOf(blob),
    fileData.lastModified = fileData.date
    return fileData
}

function getFileName (fileUrl){
  let name = path.basename(fileUrl)
  let conferenceCode = this.$route.params.conferenceCode
  let meetingCode = this.$route.params.meetingCode
  return `/cbd-events/${conferenceCode}/${meetingCode}/${name}`
}


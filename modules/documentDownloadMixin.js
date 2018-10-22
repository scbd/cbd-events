// import Vue            from 'vue'
// import VueLazyload    from 'vue-lazyload'
// Vue.use(VueLazyload,{preload:1.5})
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
    if(process.client && this.$nuxt.$loading.start)
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
    
  for (let i = 0; i < msg.data.length; i++) 
    blobs[i] = axios({method:'get', url:msg.data[i].replace('https://www.cbd.int',''),responseType:'blob'}).then((res)=>{
      msg.data[i] = { name:msg.data[i] }
      msg.data[i].type = res.headers['content-type']
      return res.data
    })
  
  blobs =  await Promise.all(blobs)
  
  for (let i = 0; i < msg.data.length; i++)
    fileObjs[i] =  this.createFileObj(msg.data[i], blobs[i])     

  await this.$store.dispatch('files/SAVE',fileObjs)
  this.$nuxt.$loading.finish()
  
  await this.$store.dispatch('files/LOAD')
  this.$store.commit('files/DOWNLOADING')
  this.closeDialog()
}

function closeDialog (){
  this.$refs.docsFrame.contentWindow.postMessage(JSON.stringify({ type : 'closeDialogRemote' }), process.env.IFRAME_HOST)
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
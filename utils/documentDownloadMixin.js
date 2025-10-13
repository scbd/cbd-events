import path    from 'path'
import sizeOf  from 'object-sizeof'
import useHttp from '~/composables/http';

export default {
  methods: { saveFiles, getFileName, createFileObj, closeDialog, getFileObjs },
  mounted,
  created,
  beforeDestroy
}

function mounted(){
  if (!process.client || !this.$refs.docsFrame) return null
  this.$store.dispatch('files/LOAD')
  window.addEventListener('message', this.saveFiles)
  this.$refs.docsFrame.onload = () => this.$nuxt.$loading.finish()
}

function created(){
  if(process.server) return
  
  if(this.$nuxt.$loading.start)  this.$nuxt.$loading.start()
}

function beforeDestroy (){
  if(!process.client || !this.$refs.docsFrame) return null
  window.removeEventListener('message', this.saveFiles)
}

async function saveFiles({ data }){
  const msg = data

  if(msg.type!=='saveFiles') return
  
  this.$store.commit('routes/SET_SHOW_NAVS', true)
  this.$nuxt.$loading.start()
  this.$store.commit('files/DOWNLOADING')

  const blobs    = await getBlobs(msg)

  const fileObjs = this.getFileObjs(msg, blobs)


  try{
    await this.$store.dispatch('files/SAVE', { files: fileObjs, blobs })
    await this.$store.dispatch('files/LOAD')
  }
  catch(e){
    console.error(e)
  }
  
  this.$nuxt.$loading.finish()
  
  await this.$store.dispatch('files/LOAD')
  this.$store.commit('files/DOWNLOADING')
  this.closeDialog()
}

function getFileObjs({ data }, blobs){
  const fileObjs = []

  for (let i = 0; i < data.length; i++)
    fileObjs[i] =  this.createFileObj(data[i], blobs[i])

  return fileObjs
}

function getBlobs({ data }){
  const blobs = []

  for (let i = 0; i < data.length; i++){
    const { url } = data[i] 
    const restParams = { url, method: 'get',  responseType: 'blob' } //url: downloadUri,

    blobs[i] = useHttp(restParams).then((data) => convertBlobToBase64(data))
  }

  return Promise.all(blobs)
}


function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.readAsDataURL(blob)
      reader.onload = () => resolve(reader.result.toString())
      reader.onerror = error => reject(error)
  })
}
function closeDialog (){
  this.$refs.docsFrame.contentWindow.postMessage(JSON.stringify({ type: 'closeDialogRemote' }), process.env.NUXT_ENV_IFRAME_HOST)
}

function createFileObj (fileData, blob){
  fileData.name = this.getFileName(fileData.name),
  fileData.baseName = path.basename(fileData.name),
  fileData.size = fileData.size || blob.size || sizeOf(blob),
  fileData.lastModified = fileData.date
  return fileData
}

function getFileName (fileUrl){
  const name = path.basename(fileUrl)
  const conferenceCode = this.$route.params.conferenceCode
  const meetingCode = this.$route.params.meetingCode

  return `/cbd-events/${conferenceCode}/${meetingCode}/${name}`
}


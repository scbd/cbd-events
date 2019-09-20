import LocalFiles from '~/modules/LocalFileSystem'
import Device     from '~/modules/Device'

const rect                      = [ 0, 0, innerWidth / 2, 0 ]
const showOpenWithDialogOptions = { error: (e) => { console.log('Error: ', e); }, rect }

const saveLocally = async (fileData, { file }) => {
  try{
    const { tempDirectory, cacheDirectory } = file
    const { baseName, blob }                = fileData
    const   fileSystemUrl                   = tempDirectory || cacheDirectory

    const dirEntry  = await LocalFiles.resolveLocalFileSystemURL(fileSystemUrl)
    const fileEntry = await LocalFiles.getFile(dirEntry, baseName, { create: true, exclusive: false })

    await LocalFiles.write(fileEntry, blob)

    return fileEntry.toURL()
  }
  catch(e){
    console.error(e)
    throw e
  }
}
  
const  openFileDefault = ({ blob, baseName }) => {
  if(!window) throw new Error('Window object not found')
  const data = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href     = data
  link.download = baseName
  link.click()

  // For Firefox it is necessary to delay revoking the ObjectURL
  return setTimeout(() => window.URL.revokeObjectURL(data), 100)
}
  
async function openFileFromCordova($cordova, file){
  const { fileOpener2, device } = $cordova
  const   isIOS                 = Device.isIOSCordova(device)

  if(!$cordova) throw new Error('$cordova object not found')

  const fileURL = await saveLocally(file, $cordova)

  if(isIOS)
    return fileOpener2.open(decodeURIComponent(fileURL), file.type, { error, success })

  fileOpener2.showOpenWithDialog(decodeURIComponent(fileURL), file.type, showOpenWithDialogOptions)
}
  
function error   (e){ console.log(`Error status: ${e.status} - Error message: ${e.message}`, e); throw e }
function success (){  console.log('file opened successfully') }
  

function openSafari ({ blob, baseName }){
  try{ CordovaFiles.OpenSafariFn(blob) }
  catch(e){ openFileDefault({ blob, baseName }) }
}

export const shareFile = async (file, $cordova) => {
  const { fileOpener2  } = $cordova
  const fileURL = await saveLocally(file, $cordova)

  fileOpener2.showOpenWithDialog(decodeURIComponent(fileURL), file.type, showOpenWithDialogOptions)
}

export const openFile = (file, $cordova) => {
  if(!$cordova && this && this.$cordova)   $cordova = this.$cordova

  if ($cordova)                    return openFileFromCordova($cordova, file)
  if (Device.isInternetExplorer()) return window.navigator.msSaveOrOpenBlob(file.blob)
  if (Device.isSafari())           return openSafari(file)

  return openFileDefault(file)
}

export default class CordovaFiles{
  static openFile        = openFile
  static setOpenSafariFn = setOpenSafariFn
  static shareFile       = shareFile
}

export const setOpenSafariFn  = (fn) => { CordovaFiles.OpenSafariFn = fn }
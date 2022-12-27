
import { FileOpener } from '@awesome-cordova-plugins/file-opener'
import { writeFile } from '~/composables/file-system'


import { Share } from '@capacitor/share';

const rect                      = [ 0, 0, innerWidth / 2, 0 ]
const showOpenWithDialogOptions = { error: (e) => { console.error('Error: '+e.message); }, rect }

const saveLocally = async (fileData, { file }) => {
  try{
    const { tempDirectory, cacheDirectory } = file
    const { baseName, blob }                = fileData
    const   fileSystemUrl                   = tempDirectory || cacheDirectory

    // const dirEntry  = await LocalFiles.resolveLocalFileSystemURL(fileSystemUrl)
    // const fileEntry = await LocalFiles.getFile(dirEntry, baseName, { create: true, exclusive: false })

    const uri = await writeFile(baseName, blob) //await LocalFiles.write(fileEntry, blob)


  
    // const ref = await InAppBrowser.create(uri);
    // const dirEntry  = await LocalFiles.resolveLocalFileSystemURL(fileSystemUrl)
    // const fileEntry = await LocalFiles.getFile(dirEntry, baseName, { create: true, exclusive: false })

    // await LocalFiles.write(fileEntry, blob)

    return uri
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
console.log('openFileFromCordova', file.type)
  // const { fileOpener2 } = $cordova
  // console.error('Device keys',JSON.stringify(Object.keys(Device)))
  // console.error('$cordova.Device.getInfo()',$cordova.Device.getInfo())
  // console.warn('$cordova',JSON.stringify(Object.keys($cordova.Device.getInfo())))
  // const   isIOS                 = isIOSCordova(Device)

  if(!$cordova) throw new Error('$cordova object not found')

  const fileURL = decodeURIComponent(await saveLocally(file, $cordova))


  //await FileOpener.showOpenWithDialog(fileURL, file.type, showOpenWithDialogOptions)
  //   await FileOpener.appIsInstalled('com.adobe.reader', {
  //     success : function(res) {
  //         if (res.status === 0) {
  //             console.log('Adobe Reader is not installed.');
  //         } else {
  //             console.log('Adobe Reader is installed.')
  //         }
  //     }
  // });
  // if(isIOS)
     return FileOpener.open(decodeURIComponent(fileURL), file.type, { error, success })


     
}
  
function error   (e){ console.error(`Error status: ${e.status} - Error message: ${e.message}`); throw e }
function success (){  console.log('file opened successfully') }
  

// function openSafari ({ blob, baseName }){
//   try{ CordovaFiles.OpenSafariFn(blob) }
//   catch(e){ openFileDefault({ blob, baseName }) }
// }

export const shareFile = async (file, $cordova) => {
  const url = await saveLocally(file, $cordova)

  await Share.share({  title: file.baseName, url, dialogTitle: `Share ${file.baseName}`,})
}

export const openFile = (file, $cordova) => {

  // if(!$cordova && this && this.$cordova)   $cordova = this.$cordova

  return openFileFromCordova($cordova, file)

//   if ($cordova)                    return openFileFromCordova($cordova, file)

//   return openFileDefault(file)
}

export default class CordovaFiles{
  static openFile        = openFile
  static setOpenSafariFn = setOpenSafariFn
  static shareFile       = shareFile
}

export const setOpenSafariFn  = (fn) => { CordovaFiles.OpenSafariFn = fn }
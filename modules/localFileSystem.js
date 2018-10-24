const resolveLocalFileSystemURL =  (url) => {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      url, 
      (fs)=>resolve(fs),
      (e)=>reject(e)
    )
  })
}

const requestFileSystem =  (type, size) => {
  return new Promise((resolve, reject) => {
    window.requestFileSystem(
      type, 
      size,
      (fs)=>resolve(fs),
      (e)=>reject(e)
    )
  })
}

const getFile =  (dirEntry, path, options) => {
  return new Promise((resolve, reject) => {
    dirEntry.getFile(
      path, 
      options,
      (fileEntry)=>resolve(fileEntry),
      (e)=>reject(e)
    )
  })
}

const write =  (fileEntry, data) => {
  return new Promise((resolve, reject) => {
    fileEntry.createWriter(
      (fileWriter)=>{
        if(!fileEntry) reject(new Error(`No fileEntry passed`))
        if(!data) reject(new Error(`No data passed to write file ${fileEntry.nativeURL}`))
        
        fileWriter.onwriteend = ()=>resolve(fileEntry.toURL())
        fileWriter.onerror = (e)=>reject(e)
        fileWriter.write(data)
      }
      
    )
  })
}

export default {resolveLocalFileSystemURL, requestFileSystem, getFile, write}
const resolveLocalFileSystemURL = (url) => new Promise((resolve, reject) => {
  window.resolveLocalFileSystemURL(
    url,
    (fs) => resolve(fs),
    (e) => reject(e)
  )
})

const requestFileSystem = (type, size) => new Promise((resolve, reject) => {
  window.requestFileSystem(
    type,
    size,
    (fs) => resolve(fs),
    (e) => reject(e)
  )
})

const getFile = (dirEntry, path, options) => new Promise((resolve, reject) => {
  dirEntry.getFile(
    path,
    options,
    (fileEntry) => resolve(fileEntry),
    (e) => reject(e)
  )
})

const write = (fileEntry, data) => new Promise((resolve, reject) => {
  fileEntry.createWriter(
    (fileWriter) => {
      if(!fileEntry) reject(new Error('No fileEntry passed'))
      if(!data) reject(new Error(`No data passed to write file ${fileEntry.nativeURL}`))
        
      fileWriter.onwriteend = () => resolve(fileEntry.toURL())
      fileWriter.onerror = (e) => reject(e)
      fileWriter.write(data)
    }
  )
})
const createBlobUrlOpts = 'toolbartranslucent=yes,enableViewportScale=yes,hidenavigationbuttons=yes,hidespinner=yes,location=no'

export const createBlobUrl = ({ blob }, opts = createBlobUrlOpts) => window.URL.createObjectURL(blob, '_blank', opts)

export default class LocalFileSystem{
  static resolveLocalFileSystemURL = resolveLocalFileSystemURL
  static requestFileSystem         = requestFileSystem
  static getFile                   = getFile
  static write                     = write
  static createBlobUrl             = createBlobUrl
}
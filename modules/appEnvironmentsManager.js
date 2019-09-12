const path   = require('path')
const dotenv = require('dotenv')

export const pwaEnvironments = [ 'local', 'dev', 'stg' ]
export const cordovaEnvironments = [ 'ios', 'iosdev', 'iosstg', 'android', 'androiddev', 'androidstg' ]
export const environments = pwaEnvironments.concat(cordovaEnvironments)

export const dotEnvReader = () => {
  let dotFile = '.env'

  if (environments.includes(process.env.NODE_ENV))
    dotFile = `${dotFile}.${process.env.NODE_ENV}`
  else
    process.env.NODE_ENV = 'production'
    
  console.info(`##### Building for NODE_ENV: ${process.env.NODE_ENV}`)
  console.info(`##### Reading dotenv file: ${dotFile}`)

  dotenv.config({ path: path.resolve(process.cwd(), dotFile) })
}

export const isCordovaEnv = () => cordovaEnvironments.includes(process.env.NODE_ENV)

export const isAndroidEnv = () => {
  return ~process.env.NODE_ENV.indexOf('android')
}
  
export const cordovaNuxtConfig = (nuxtConfig) => {
  if(!isCordovaEnv()) return nuxtConfig
  
  nuxtConfig.mode = 'spa'

  nuxtConfig.head.meta = [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, minimal-ui, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
    { hid: 'description', name: 'description', content: 'UN Biodiversity Events Application' }
  ]
                          
  nuxtConfig.head.link =[ { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' } ]
  nuxtConfig.head.script=  [ { src: 'cordova.js' } ]
  
  //delete(nuxtConfig.manifest.icons)

  nuxtConfig.modules.splice(nuxtConfig.modules.indexOf('@nuxtjs/proxy'), 1)

  nuxtConfig.generate = { dir: 'cordova/www' }

  nuxtConfig.router.mode ='hash'

  nuxtConfig.build.publicPath  =  '/nuxt/'
  nuxtConfig.plugins.unshift('~/plugins/cordova.js')
  
  delete(nuxtConfig.proxy)

  delete(nuxtConfig.axios.proxy)
  return nuxtConfig
}
export const isInternetExplorer = () => window && window.navigator && window.navigator.msSaveOrOpenBlob
export const userAgentHasSafari = () => window && window.navigator && ~window.navigator.userAgent.search('Safari')
export const userAgentHasChrome = () => window && window.navigator && ~window.navigator.userAgent.search('Chrome')
export const userAgentHasIPad   = () => window && window.navigator && ~window.navigator.userAgent.match(/iPad/i)
export const isIpad             = () => window && window.navigator && !!window.navigator.userAgent.match(/iPad/i)
export const isSafari           = () => userAgentHasSafari && userAgentHasChrome
export const isIOSCordova       = ($cordova) => {
  try{ return $cordova.device.platform === 'iOS' }
  catch(e){ return false }
}

export default class Device{
    static isIpad = isIpad
    static isInternetExplorer = isInternetExplorer
    static userAgentHasSafari = userAgentHasSafari
    static userAgentHasChrome = userAgentHasChrome
    static userAgentHasIPad   = userAgentHasIPad
    static isSafari           = isSafari
    static isIOSCordova       = isIOSCordova
}
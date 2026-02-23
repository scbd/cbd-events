import { Capacitor } from '@capacitor/core'   ;
import   axios       from 'axios'
import { HTTP      } from '@ionic-native/http'

export const http = (restParams, $axios = axios) => {
    if(Capacitor.getPlatform() === 'web') return webVersion(restParams, $axios)

    return nativeVersion(restParams)
}

export default http;

function nativeVersion(restParams){
    try {
        return HTTP.sendRequest(restParams.url, restParams).then( (res) => res.data)
    } catch (error) {
        console.log(error);
    }
}

function webVersion(restParams, $axios){
    try {
        return $axios(restParams).then( (res) => res.data)
    } catch (error) {
        console.error(error);
    }
}
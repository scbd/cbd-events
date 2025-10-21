import { Capacitor } from '@capacitor/core'
import { HTTP } from '@ionic-native/http'

export const http = (restParams) => {
    if(Capacitor.getPlatform() === 'web') return webVersion(restParams)

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

function webVersion(restParams){
    try {
        // $fetch is Nuxt's built-in fetch utility - automatically handles JSON
        // Convert axios-style config to fetch-style config
        const { url, method = 'GET', params, data, responseType, ...config } = restParams
        
        const fetchOptions = {
            method: method.toUpperCase(),
            ...config
        }
        
        // Handle query parameters - $fetch uses 'query' not 'params'
        if (params) {
            fetchOptions.query = params
        }
        
        // Handle request body
        if (data) {
            fetchOptions.body = data
        }
        
        // Handle response type
        if (responseType === 'blob') {
            // Use $fetch.raw() to get the Response object and extract the blob
            return $fetch.raw(url, fetchOptions).then(res => res._data);
        } else if (responseType === 'json') {
            // $fetch returns JSON by default, no explicit action needed
        }
        
        return $fetch(url, fetchOptions)
    } catch (error) {
        console.error(error);
        throw error;
    }
}
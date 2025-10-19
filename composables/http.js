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
        
        // Build query string from params if provided
        const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
        const fullUrl = url + queryString
        
        // Configure fetch options
        const fetchOptions = {
            method: method.toUpperCase(),
            ...config
        }
        
        // Add body if provided
        if (data) {
            fetchOptions.body = data
        }
        
        // Handle different response types
        if (responseType === 'blob') {
            // For blob responses, use responseType option
            fetchOptions.responseType = 'blob'
        }
        
        // For JSON responses (default), $fetch handles automatically
        return $fetch(fullUrl, fetchOptions)
    } catch (error) {
        console.error(error);
    }
}
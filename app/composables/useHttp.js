import { $fetch } from 'ofetch'

export function useHttp() {
  async function get(url, options = {}) {
    return $fetch(url, { method: 'GET', ...options })
  }

  async function post(url, body, options = {}) {
    return $fetch(url, { method: 'POST', body, ...options })
  }

  return { get, post, $fetch }
}

// Direct export for non-composable usage in stores
export const http = { get: (url, opts = {}) => $fetch(url, { method: 'GET', ...opts }) }
export default http

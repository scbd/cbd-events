// Stub for Nuxt virtual module #app — used in Vitest environment.
// Tests that need specific behaviour override this with vi.mock('#app').
export const useNuxtApp = () => ({
  $axios: {},
  $i18n : { locale: { value: 'en' } }
})

export const useRuntimeConfig = () => ({
  public: {
    baseUrl    : 'https://cbd-events.cbd.int',
    iframeHost : 'https://www.cbd.int',
    api        : 'https://api.cbd.int',
    attachments: 'https://attachments.cbd.int',
    appVersion : '1.0.0',
  },
})

export const defineNuxtPlugin  = (fn)  => fn
export const useRouter         = ()    => ({})
export const useRoute          = ()    => ({})
export const navigateTo        = () => Promise.resolve()

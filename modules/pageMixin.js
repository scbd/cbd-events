// import Vue            from 'vue'
// import VueLazyload    from 'vue-lazyload'
// Vue.use(VueLazyload,{preload:1.5})

export default {
  scrollToTop: true,
  head () {
    return {
      // title: this.$i18n.t('title'),
      link: [
        // We use $route.path since we don't use query parameters
        {
          hid:'canonical',
          rel: 'canonical',
          href: `${this.$route.path}`
        }
      ],
      meta: [
        // { hid: 'description', name: 'description', content: this.$i18n.t('description') },
        // { hid:'twitter:title', name: 'twitter:title', content: this.$i18n.t('title') },
        // { hid:'twitter:description', name: 'twitter:description', content: this.$i18n.t('description') },
        // { hid:'og:title', name: 'og:title', content: this.$i18n.t('title') },
        // { hid:'og:description', name: 'og:description', content: this.$i18n.t('description') },
        // { hid:'lang', name: 'lang', content: this.$i18n.locale },
        // { hid:'og:image', name: 'og:image', content: 'https://attachments.cbd.int/1200x630/red-coral-blue-back.jpg' },
        { hid:'twitter:card', name: 'twitter:card', content: 'summary' },
        { hid:'twitter:site', name: 'twitter:site', content: '@CBDNews' },
        // { hid:'twitter:image', name: 'twitter:image', content: 'https://attachments.cbd.int/1200x675/red-coral-blue-back.jpg' },
        // { hid:'twitter:image:alt', name: 'twitter:image:alt', content: 'img alt' }

      ],
      htmlAttrs: {
        lang: this.$i18n.locale,
        dir:  this.$i18n.getDirection(this.$i18n.locale)
      }
    }
  }

}

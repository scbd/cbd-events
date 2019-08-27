
export default ({ app }) => {
  console.log('app.i18n', app.i18n)
  
  app.i18n.path = (link) => app.localePath(link).replace('#', '')

  app.i18n.getDirection = (lang) => {
    if(lang==='ar') return 'rtl'
    return 'ltr'
  }

  app.i18n.isRtl = (lang) => {
    if(lang==='ar') return true
    return false
  }
}

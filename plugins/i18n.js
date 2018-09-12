
export default async ({ app, store, serverStore }) => {
console.log(app)
  app.i18n.path = (link) => {
   return app.localePath(link).replace('#','')
  }

  app.i18n.getDirection = (lang) => {
     if(lang==='ar') return 'rtl'
     return 'ltr'
  }

  app.i18n.isRtl = (lang) => {
     if(lang==='ar') return true
     return false
  }
}

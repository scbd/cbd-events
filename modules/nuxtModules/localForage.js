const { resolve } = require('path')

module.exports = function module (moduleOptions){
  const newOpts  = { name: 'nuxtJS', storeName: 'nuxtLocalForage' }
  const userOpts = this.options['localforage'] || moduleOptions
  const options  = Object.assign(newOpts, userOpts)
console.log('options',options)
  this.addPlugin({
    src     : resolve(__dirname, './../../plugins/localForage.js'),
    ssr     : false,
    fileName: 'localForage.js',
    options
  })
}

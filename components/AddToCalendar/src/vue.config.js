const PurgecssPlugin  = require('purgecss-webpack-plugin')
const glob            = require('glob-all')
const path            = require('path')
module.exports = {

  configureWebpack: {
      plugins: [
        new PurgecssPlugin({
          paths: glob.sync([
            path.join(__dirname, './src/**/*.vue')
          ]),
          whitelist: ['html', 'body']
        })
      ]
    }
}

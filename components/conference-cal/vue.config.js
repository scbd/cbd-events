module.exports = {
  css:{
    extract:true
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.cbd.int',
        ws: false,
        changeOrigin: true
      }

    }
  }
}

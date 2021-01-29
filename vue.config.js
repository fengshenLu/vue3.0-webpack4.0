const env = process.env.NODE_ENV
const path = require('path')
module.exports = {
  lintOnSave: false,
  configureWebpack: config=>{
    config = require(`./webpackConfig/${env}/vue.config.js`)
    return  config
  },
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
      .set('@home',path.resolve(__dirname))
  }
}
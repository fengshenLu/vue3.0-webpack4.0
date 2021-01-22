const env = process.env.NODE_ENV
module.exports = {
  lintOnSave: false,
  configureWebpack: config=>{
    config = require(`./webpackConfig/${env}/vue.config.js`)
    return  config
  },
}
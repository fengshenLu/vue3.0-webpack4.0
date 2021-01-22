const OpenBrowserPlugin = require('open-browser-webpack-plugin');
module.exports = {
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    })

  ],
  // chainWebpack: (config) => {
  //   config.plugin('OpenBrowserPlugin')
  //     .use(OpenBrowserPlugin)
  //     .tap(c => {
  //       c[0] = {url: 'http://localhost:8080'}
  //       return c;
  //     })
  // },
  devServer: {
    port: 8080,
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,
    publicPath: '',
    clientLogLevel: 'error', // 日志级别
    overlay: {
      warnings: true,
      errors: true
    },
    // proxy: {
    //   '/api': {
    //     target: '',
    //     pathRewrite: {'^/api': '/'},
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  }
}
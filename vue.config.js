const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const BASE_URL = process.env.NODE_ENV === 'production' ? '/ui' : '/ui'

module.exports = {
  lintOnSave: false,
  baseUrl: BASE_URL,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'))
    // 参考： https://github.com/artemsky/vue-snotify/issues/14
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js')
    config
      .plugin('provide')
      .use(require('webpack').ProvidePlugin, [
        {
          $: 'jquery',
          jquery: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        }, {
          Vue: 'vue'
        }])
  },
  pages: {
    index: {
      entry: './src/DataTree.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  devServer: {
    index: 'index.html'
  }
}

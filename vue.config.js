module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
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
      entry: './src/main.js',
      template: 'public/index.html',
      filename: 'index2.html'
    },
    'DataTree': {
      entry: './src/DataTree.js',
      template: 'public/index.html',
      filename: 'data-tree.html'
    }
  },
  devServer: {
    index: 'data-tree.html'
  }
}

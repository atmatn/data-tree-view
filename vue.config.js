const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const BASE_URL = process.env.NODE_ENV === 'production' ? '/ui' : '/ui'
const BACKEND_SERVER = 'htttp://ns013x.corp.youdao.com:18085'

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  baseUrl: BASE_URL,
  // resolve: {
  //   alias: {
  //     'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
  //   }
  // },
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
        }
        // , {
        //   Vue: 'vue'
        // }
      ])
  },
  pages: {
    index: {
      entry: './src/DataTree.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  devServer: {
    index: 'index.html',
    disableHostCheck: true,
    proxy: {
      // 参考 https://cli.vuejs.org/zh/config/#devserver-proxy
      // 参考 https://github.com/chimurai/http-proxy-middleware#proxycontext-config
      '/api/summary-query': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/api/all-log-attrs': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/presto': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/api/current-dso-list': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/api/args-script': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/api/ds-perms': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/api/presto': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/log': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/snippet': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      },
      '/api/data-tree': {
        target: BACKEND_SERVER,
        ws: true,
        changeOrigin: true
      }
    }
  }
}

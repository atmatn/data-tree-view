import Vue from 'vue'
import DataTreeWrapper from './DataTreeWrapper.vue'
import router from './router'
import store from './store'
import $ from 'jquery'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import BootstrapVue from 'bootstrap-vue'
import '@/css/global.css'
Vue.use(BootstrapVue)

Vue.use(iView)
if (process.env.NODE_ENV !== 'production') require('./mock')
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(DataTreeWrapper),
  created () {
    this.$store.dispatch('reload')
  }
}).$mount('#app')

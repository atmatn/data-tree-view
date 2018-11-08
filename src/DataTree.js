import Vue from 'vue'
import DataTree from './DataTree.vue'
import router from './router'
import store from './store'
import $ from 'jquery'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(DataTree)
}).$mount('#app')

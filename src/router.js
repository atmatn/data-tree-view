import Vue from 'vue'
import Router from 'vue-router'
import RunScript from './views/RunScript.vue'
import DataTree from './views/DataTree.vue'
import DataTreeHome from './views/DataTreeHome.vue'
import log from '@/lib/log'
import { Recorded } from 'rx';
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/ui/',
  routes: [
    {
      path: '/data-tree',
      name: 'data-tree',
      component: DataTree,
      children: [{
        path: 'run-script',
        name: 'run-script',
        component: RunScript
      }, {
        path: 'home',
        name: 'data-tree-home',
        component: DataTreeHome
      }]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/exp-home',
      name: 'exp-home',
      component: () => import(/* webpackChunkName: "exp-home" */ './exp/ExpHome3.vue')
    },
    {
      path: '/summary-query',
      name: 'summary-query',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "summary-query" */ './views/SummaryQuery.vue'),
      meta: { page: 'summary-query' }
    },
    {
      path: '/current-dso-list',
      name: 'current-dso-list',
      component: () => import(/* webpackChunkName: "current-dso-list" */ './views/CurrentDsoList.vue')
    },
    {
      path: '/ds-perms',
      name: 'ds-perms',
      component: () => import(/* webpackChunkName: "ds-perms" */ './views/DataSourcePerms.vue')
    },
    {
      path: '*',
      // redirect: { name: 'data-tree-home' }
      // 方便demo这个功能
      redirect: { name: 'summary-query' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  var record = to.matched[0]
  if (record && record.meta && record.meta.page) {
    log('action_open', {
      'page': record.meta.page,
      'action': 'open'
    })
  }
  next()
})

export default router

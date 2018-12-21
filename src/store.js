import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import axios from 'axios'
import _ from 'lodash'
import $ from 'jquery'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 参考：https://vuex.vuejs.org/zh/guide/state.html
    someMsg: '',
    // currentScriptId: '',
    // currentScriptParams: {},
    dataTreeNodes: [],
    wichToShow: false, // 决定是否显示无可执行权限的项
    allow: false, // 确定按钮是否可以关闭model
    allow2: false,
    permsList: '', // 权限列表
    queryingCount: 0,
    turnOn: [], // 选择哪一项展开
    turnLight: '', // 选择那一项高亮
    showDebug: true,
    onSwitch: false,
    result: []
    // param_a: '',
    // param_a_value: ''
  },
  mutations: {
    // 参考：https://vuex.vuejs.org/zh/guide/mutations.html
    updateSomeMsg: (state, msg) => { state.someMsg = msg },

    // updateScriptIdAndParams: (state, { scriptId, params }) => {
    //   state.currentScriptId = scriptId
    //   state.currentScriptParams = params
    // },

    // updateScriptParams: (state, { params }) => {
    //   state.currentScriptParams = params
    // },

    updateDataTreeNodes: (state, { treeNodes }) => {
      state.dataTreeNodes = _.cloneDeep(treeNodes)
    },
    updateWichToShow: (state, { status }) => {
      state.wichToShow = status
    },
    updateAllow: (state, { status }) => {
      state.allow = status
    },
    updateAllow2: (state, { status }) => {
      state.allow2 = status
    },
    updateCannotSubmit: (state, { status }) => {
      state.allow = status
    },
    updatePermsList: (state, { perms }) => {
      state.permsList = _.cloneDeep(perms)
      // console.log(state.permsList)
    },
    updateTurnOn: (state, { status }) => {
      state.turnOn = status
    },
    updateTurnLight: (state, { status }) => {
      state.turnLight = status
    },
    updateOnSwitch: (state, { status }) => {
      state.onSwitch = status
    },
    // updateParam_a: (state, { status }) => {
    //   state.param_a = status
    //   state.param_a_value = status
    // },
    updateResult: (state, { status }) => {
      console.log(status)
      status.forEach((item) => {
        if (item.currentUserVisible === true || item.currentUserExecutable === true) {
          let {
            id: value,
            title: label
          } = item
          if (item.children) {
            var children = item.children
            if (item.children.length !== 0) {
              console.log(item.children)
              children = Vue.commit('updateResult', children)
            }
          }
          state.result.push({
            value,
            label,
            children
          })
        }
      })
    },
    incrementQueringCount: (state, { val }) => {
      state.queryingCount += val
    },
    setShowDebug: (state, { val }) => {
      state.showDebug = val
    }
  },
  actions: {
    // 参考: https://vuex.vuejs.org/zh/guide/actions.html
    setSomeMsg ({ commit }, msg) {
      commit('updateSomeMsg', msg)
    },

    openScript ({ commit }, { scriptId, params }) {
      // commit('updateScriptIdAndParams', { scriptId, params })
      router.push({
        name: 'run-script',
        query: {
          scriptId: scriptId,
          ...params
        }
      })
    },
    // updateScriptParams ({ commit, state }, { params }) {
    //   // debugger
    //   commit('updateScriptParams', { params })
    //   router.push({
    //     name: 'run-script',
    //     query: {
    //       scriptId: state.currentScriptId,
    //       ...params
    //     }
    //   })
    // },
    reloadDataTree ({ commit, state }) {
      axios.request({
        url: '/api/data-tree',
        method: 'get'
      }).then(res => {
        commit('updateDataTreeNodes', { treeNodes: res.data.treeNodes })
      })
    },
    reloadPermsList ({ commit, state }) {
      axios.request({
        url: '/api/data-tree/edit/list-perms',
        method: 'post'
      }).then(res => {
        commit('updatePermsList', { perms: res.data.perms })
      })
    },
    changeWichToShow ({ commit }, { status }) {
      commit('updateWichToShow', { status })
    },
    changeOnSwitch ({ commit }, { status }) {
      commit('updateOnSwitch', { status })
    },
    incrementQueringCount ({ commit, state }, { val }) {
      commit('incrementQueringCount', { val })
    },
    updateSummaryQueryParams ({ commit, state }, payload) {
      console.log('action: updateSummaryQueryParams' + JSON.stringify(payload))
      const url = '/ui/summary-query?' + $.param(payload)
      router.push({
        path: url
      })
    },
    setShowDebug ({ commit, state }, { val }) {
      commit('setShowDebug', { val })
    },
    changeResult ({ commit }, { status }) {
    // commit('updateResult', { status })
    }
  }
})

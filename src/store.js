import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 参考：https://vuex.vuejs.org/zh/guide/state.html
    someMsg: '',

    currentScriptId: '',
    currentScriptParams: {}
  },
  mutations: {
    // 参考：https://vuex.vuejs.org/zh/guide/mutations.html
    updateSomeMsg: (state, msg) => { state.someMsg = msg },

    updateScriptIdAndParams: (state, { scriptId, params }) => {
      state.currentScriptId = scriptId
      state.currentScriptParams = params
    },

    updateScriptParams: (state, { params }) => {
      state.currentScriptParams = params
    }
  },
  actions: {
    // 参考: https://vuex.vuejs.org/zh/guide/actions.html
    setSomeMsg ({ commit }, msg) {
      commit('updateSomeMsg', msg)
    },

    openScript ({ commit }, { scriptId, params }) {
      commit('updateScriptIdAndParams', { scriptId, params })
      router.push({
        name: 'run-script',
        query: {
          scriptId: scriptId,
          ...params
        }
      })
    },
    updateScriptParams ({ commit, state }, { params }) {
      debugger
      commit('updateScriptParams', { params })
      router.push({
        name: 'run-script',
        query: {
          scriptId: state.currentScriptId,
          ...params
        }
      })
    }
  }
})

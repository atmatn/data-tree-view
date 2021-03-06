import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import axios from 'axios'
import _ from 'lodash'
import $ from 'jquery'
Vue.use(Vuex)

// 获取可搜索的节点列表，包括 product, folder 和 leaf
function generateDataTreeSearchList (dataTreeNodes) {
  let arr = []
  let curProduct = {}

  function process (node, prefix) {
    if (node instanceof Array) {
      node.forEach(n => {
        curProduct = {
          product: {
            title: n.title,
            id: n.id
          },
          items: [],
          hasPrivillage: n.currentUserVisible
        }
        curProduct.items.push({
          id: n.id,
          title: n.title  + (n.currentUserVisible ? '' : ' (无权限)'),
          hasPrivillage: n.currentUserVisible
        })
        arr.push(curProduct)
        if(n.children){
          n.children.forEach(subNode => {
            process(subNode, n.title + ' / ')
          })
        }
      })
    } else {
      // debugger
      curProduct.items.push({
        id: node.id,
        title: prefix + node.title + (node.currentUserExecutable ? '' : ' (无权限)'),
        hasPrivillage: node.currentUserExecutable
      })
      if (node.children) {
        node.children.forEach(subNode => {
          process(subNode, prefix + node.title + ' / ')
        })
      }
    }
  }

  process(dataTreeNodes)
  // debugger
  return arr
}

function generateFlattenProductFolders (dataTreeNodes) {
  // debugger
  let arr = []
  let curProduct = {}
  function process (node, prefix) {
    if (node instanceof Array) {
      node.forEach(n => {
        if (n.children) {
          // 产品有children，才会新建一个元素
          curProduct = {
            product: {
              title: n.title,
              id: n.id
            },
            folders: []
          }
          arr.push(curProduct)
          n.children.forEach(subNode => {
            process(subNode, '')
          })
        }
      })
    } else {
      if (node.type === 'folder' && node.children) {
        // debugger
        curProduct.folders.push({
          id: node.id,
          title: prefix + node.title
        })
        if (node.children) {
          node.children.forEach(subNode => {
            process(subNode, prefix + node.title + ' / ')
          })
        }
      }
    }
  }

  process(dataTreeNodes)
  return arr
}

let store = new Vuex.Store({
  state: {
    // 参考：https://vuex.vuejs.org/zh/guide/state.html
    someMsg: '',
    // currentScriptId: '',
    // currentScriptParams: {},
    dataTreeNodes: [],
    switchToShow: false, // 决定是否显示无可执行权限的项
    // allow: false, // 确定按钮是否可以关闭model
    // allow2: false,
    permsList: [], // 权限列表
    queryingCount: 0,
    // turnOn: [], // 选择哪一项展开
    // turnLight: '', // 选择那一项高亮
    showDebug: false,
    onSwitch: false,
    indexMap: {},
    indexParentMap: {},
    expandWitch: {}, // 那一项要被展开
    dataTreeSearchList: [], // 用于目录树搜索
    flattenProductFolders: [], // 用作选取复制、移动的目标目录
    whichAnchor: '', // 定位哪一项要跳转
    // result: []
    // param_a: '',
    // param_a_value: ''
    loginStatus: {
      username: 'anonymous'
    }
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

    updateFlattenProductFolders: (state, { flattenProductFolders }) => {
      state.flattenProductFolders = flattenProductFolders
    },
    updateDataTreeSearchList: (state, { dataTreeSearchList }) => {
      state.dataTreeSearchList = dataTreeSearchList
    },
    updateDataTreeNodes: (state, { treeNodes }) => {
      state.dataTreeNodes = _.cloneDeep(treeNodes)
    },
    updateWhichAnchor: (state, { status }) => {
      state.whichAnchor = status
    },
    updateSwitchToShow: (state, { status }) => {
      state.switchToShow = status
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
      // debugger
      state.permsList = _.cloneDeep(perms)
      // console.log(state.permsList)
    },
    // updateExpandChain: (state, { status }) => {
    //   state.turnOn = status
    // },
    // updateCurrentActiveNode: (state, { status }) => {
    //   state.turnLight = status
    // },
    updateOnSwitch: (state, { status }) => {
      state.onSwitch = status
    },
    updateIndexMap: (state, { indexMap }) => {
      state.indexMap = indexMap
    },
    updateIndexParentMap: (state, { indexParentMap }) => {
      state.indexParentMap = indexParentMap
    },
    // updateParam_a: (state, { status }) => {
    //   state.param_a = status
    //   state.param_a_value = status
    // },
    // updateResult: (state, { status }) => {
    //   console.log(status)
    //   status.forEach((item) => {
    //     if (item.currentUserVisible === true || item.currentUserExecutable === true) {
    //       let {
    //         id: value,
    //         title: label
    //       } = item
    //       if (item.children) {
    //         var children = item.children
    //         if (item.children.length !== 0) {
    //           console.log(item.children)
    //           children = Vue.commit('updateResult', children)
    //         }
    //       }
    //       state.result.push({
    //         value,
    //         label,
    //         children
    //       })
    //     }
    //   })
    // },
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
      // debugger
      // commit('updateScriptIdAndParams', { scriptId, params })
      router.push({
        name: 'run-script',
        query: {
          scriptId: scriptId,
          ...params
        }
      })
    },

    openDirectLink ({ commit }, { url, mode }) {
      // debugger
      // commit('updateScriptIdAndParams', { scriptId, params })
      router.push({
        name: 'run-direct-link',
        query: {
          url,
          mode
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
      return new Promise(function (resolve, reject) {
        axios.request({
          url: '/api/data-tree',
          method: 'get'
        }).then(res => {
          // debugger

          // 保存编辑目录树时的展开状态
          // debugger
          let expandList = []
          Object.keys(state.indexMap).forEach(id => {
            if (state.indexMap[id].expand === true ) {
              expandList.push(id)
            }
          })
          console.log('expandList = ' + expandList.join(','))

          commit('updateDataTreeNodes', { treeNodes: res.data.treeNodes })
          let treeNodes = state.dataTreeNodes

          // id -> node
          var indexMap = {}

          // id -> parentId
          var indexParentMap = {}

          function doIndex (target, parentId) {
            if (target === undefined) {
              // 无参数调用，直接处理root array
              doIndex(treeNodes, -1)
            } else if (Array.isArray(target)) {
              // 清空索引，因为要重建
              indexMap = {}
              indexParentMap = {}
              // root array
              target.forEach(item => {
                doIndex(item, -1)
              })
            } else {
              // 索引当前节点
              if (indexMap[target.id] !== undefined) {
                let err = {
                  msg: `错误！tree 出现重复id=${target.id}`
                }
                throw err
              }
              indexMap[target.id] = target
              indexParentMap[target.id] = parentId
              // 递归往下
              if (target.type === 'product' || target.type === 'folder') {
                if (target.children !== undefined) {
                  target.children.forEach(item => {
                    doIndex(item, target.id)
                  })
                }
              }
            }
          }
          doIndex()

          expandList.forEach(id => {
            Vue.set(indexMap[id], 'expand', true)
          })

          let dataTreeSearchList = generateDataTreeSearchList(treeNodes)
          let flattenProductFolders = generateFlattenProductFolders(treeNodes)
          commit('updateDataTreeSearchList', { dataTreeSearchList })
          commit('updateFlattenProductFolders', { flattenProductFolders })
          commit('updateIndexMap', { indexMap })
          commit('updateIndexParentMap', { indexParentMap })

          resolve(state.treeNodes)
        })
      })
    },
    reloadPermsList ({ commit }) {
      // debugger
      axios.request({
        url: '/api/data-tree/edit/list-perms',
        method: 'post'
      }).then(res => {
        // debugger
        commit('updatePermsList', { perms: res.data.perms })
      })
    },
    updateSwitchToShow ({ commit }, { status }) {
      commit('updateSwitchToShow', { status })
    },
    changeOnSwitch ({ commit }, { status }) {
      commit('updateOnSwitch', { status })
    },
    incrementQueringCount ({ commit, state }, { val }) {
      commit('incrementQueringCount', { val })
    },
    updateSummaryQueryParams ({ commit, state }, payload) {
      console.log('action: updateSummaryQueryParams' + JSON.stringify(payload))
      const url = '/summary-query?' + $.param(payload)
      // debugger
      router.push({
        path: url
      })
    },
    setShowDebug ({ commit, state }, { val }) {
      commit('setShowDebug', { val })
    },
    getNodeType ({ commit, state }, { id }) {
      return new Promise(function (resolve, reject) {
        try {
          if (id === -1) {
            resolve('root')
          }
          let type = state.indexMap[id].type
          resolve(type)
        } catch (e) {
          reject(e)
        }
      })
    },
    getNodeTitle ({ commit, state }, { id }) {
      return new Promise(function (resolve, reject) {
        try {
          let title = state.indexMap[id].title
          resolve(title)
        } catch (e) {
          reject(e)
        }
      })
    },
    getTypeAttrsTemplate ({ commit, state }, { type }) {
      return new Promise(function (resolve, reject) {
        var ret = []
        if (type === 'direct-link') {
          ret = [
            {
              title: '目标url',
              attrKey: 'linkUrl',
              type: 'url',
              attrVal: ''
            },
            {
              title: '打开方式',
              attrKey: 'openMode',
              type: 'open_url_mode',
              attrVal: 'iframe'
            }
          ]
        } else if (type === 'args-script') {
          ret = [
            {
              title: '脚本id',
              attrKey: 'scriptId',
              type: 'script_id',
              attrVal: ''
            },
            {
              title: '脚本参数',
              attrKey: 'scriptParams',
              type: 'script_params',
              attrVal: {}
            }
          ]
        }
        resolve(ret)
      })
    },
    getScriptSearchList ({ commit, dispatch, state }) {
      let arr = []
      function process (node, prefix) {
        if (node instanceof Array) {
          node.forEach(n => {
            if (n.children) {
              n.children.forEach(subNode => {
                process(subNode, '')
              })
            }
          })
        } else {
          // debugger
          if (node.scriptId !== undefined) {
            arr.push({
              id: node.scriptId,
              node: node
            })
          }

          if (node.children) {
            node.children.forEach(subNode => {
              process(subNode, node)
            })
          }
        }
      }

      return new Promise(function (resolve, reject) {
        try {
          // let arr = [{
          //   product: {
          //     title: '有道精品课',
          //     id: 1
          //   },
          //   items: [
          //     {
          //       id: 15,
          //       title: '链接'
          //     },
          //     {
          //       id: 16,
          //       title: '链接 / KPI数据'
          //     }
          //   ]
          // }]
          if (state.dataTreeNodes.length === 0) {
            dispatch('reloadDataTree').then(res => {
              process(state.dataTreeNodes)
              resolve(arr)
            })
          } else {
            process(state.dataTreeNodes)
            resolve(arr)
          }
        } catch (e) {
          reject(e)
        }
      })
    },
    // 获取到指定节点的祖先节点的id，返回的列表次序是从最上层到最下层。
    // 从product开始
    getDataTreeAncestorIdList ({ commit, dispatch, state }, { id }) {
      let arr = []
      function process (curId) {
        // debugger
        if (curId === -1) {
          return
        }
        if (curId !== id) {
          arr.push(curId)
        }
        process(state.indexParentMap[curId])
      }
      return new Promise(function (resolve, reject) {
        try {
          // let arr = ['1', '15']
          if (state.dataTreeNodes.length === 0) {
            dispatch('reloadDataTree').then(res => {
              process(id)
              resolve(arr.reverse())
            })
          } else {
            process(id)
            resolve(arr.reverse())
          }
        } catch (e) {
          reject(e)
        }
      })
    },
    reloadLoginStatus ({ commit, dispatch, state }) {
      axios.request({
        url: '/userNameV2',
        method: 'get'
      }).then(res => {
        state.loginStatus = res.data
      })
    },
    reload ({ commit, dispatch, state }) {
      dispatch('reloadPermsList')
      dispatch('reloadDataTree')
      dispatch('reloadLoginStatus')
    }
    // changeResult ({ commit }, { status }) {
    // // commit('updateResult', { status })
    // }
  }
})

// store.dispatch('reloadPermsList')
// store.dispatch('reloadDataTree')

export default store

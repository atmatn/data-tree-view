import Mock from 'mockjs'

import { getDataTree, addTreeNode, renameTreeNode, moveTreeNode, getPerms, setPerms, copyNode, getAttrs, setAttrs, deleteNode, listPerms, moveUp, moveDown } from './data-tree'
import { getQueries, getDataSourceList, getDataSourceDimList, getDateRangeAgg, updateDimCatList } from './summary-query'
import { getDsoProductList, setDsoCategory, deleteDso, listProducts, addProduct } from './current-dso-list'
import { getDsPerms, setDsPerms, addDsAndPerms, deleteDsAndPerms, getAvailablePerms, listAvailableDataSources } from './ds-perms'

import {
  getArgsScriptSingle,
  getKafkaList
} from './my-script'
import {
  getPrestoQueries
} from './presto'

var getWelcomeMsg = function getWelcomeMsg ({
  url,
  type,
  body
}) {
  return {
    msg: 'mock hello world!'
  }
}

var downloadByPost = function ({
  url,
  type,
  body
}) {
  var m = body.match(/.*content=(.*?)&.*/)
  debugger
  var s = decodeURIComponent(m[1])
  return encodeURIComponent(s)
}

Mock.mock(/\/getWelcomeMsg/, 'get', getWelcomeMsg)

// 集成测试时，暂时手工设置为true
var integrationTest = true

if (!integrationTest) {
  Mock.mock(/\/api\/summary-query\/date-range-agg/, 'post', getDateRangeAgg)
  Mock.mock(/\/api\/summary-query\/datasources/, 'get', getDataSourceList)
  Mock.mock(/\/api\/summary-query\/dims/, 'post', getDataSourceDimList)
  Mock.mock(/\/api\/summary-query\/update-dim-cat-list/, 'post', updateDimCatList)
  Mock.mock(/\/api\/summary-query\/queries/, 'get', getQueries)

  Mock.mock(/\/api\/current-dso-list\/list-dso-products/, 'get', getDsoProductList)
  Mock.mock(/\/api\/current-dso-list\/change-category/, 'post', setDsoCategory)
  Mock.mock(/\/api\/current-dso-list\/delete-dso/, 'post', deleteDso)
  Mock.mock(/\/api\/current-dso-list\/list-products/, 'get', listProducts)
  Mock.mock(/\/api\/current-dso-list\/add-product/, 'post', addProduct)

  Mock.mock(/\/api\/ds-perms\/all/, 'get', getDsPerms)
  Mock.mock(/\/api\/ds-perms\/set-perms/, 'post', setDsPerms)
  Mock.mock(/\/api\/ds-perms\/add/, 'post', addDsAndPerms)
  Mock.mock(/\/api\/ds-perms\/delete/, 'post', deleteDsAndPerms)
  Mock.mock(/\/api\/ds-perms\/list-perms/, 'get', getAvailablePerms)
  Mock.mock(/\/api\/ds-perms\/list-available-ds/, 'get', listAvailableDataSources)

  Mock.mock(/\/api\/presto\/my-queries/, 'get', getPrestoQueries)
  Mock.mock(/\/api\/args-script\/single/, 'get', getArgsScriptSingle)

  Mock.mock(/\/api\/data-tree/, 'get', getDataTree)

  Mock.mock(/\/api\/data-tree\/edit\/add/, 'post', addTreeNode)
  Mock.mock(/\/api\/data-tree\/edit\/rename/, 'post', renameTreeNode)
  Mock.mock(/\/api\/data-tree\/edit\/delete/, 'post', deleteNode)
  Mock.mock(/\/api\/data-tree\/edit\/move$/, 'post', moveTreeNode)
  Mock.mock(/\/api\/data-tree\/edit\/get-perms/, 'post', getPerms)
  Mock.mock(/\/api\/data-tree\/edit\/set-perms/, 'post', setPerms)
  Mock.mock(/\/api\/data-tree\/edit\/copy/, 'post', copyNode)
  Mock.mock(/\/api\/data-tree\/edit\/get-attrs/, 'post', getAttrs)
  Mock.mock(/\/api\/data-tree\/edit\/set-attrs/, 'post', setAttrs)
  Mock.mock(/\/api\/data-tree\/edit\/list-perms/, 'post', listPerms)
  Mock.mock(/\/api\/data-tree\/edit\/move-up/, 'post', moveUp)
  Mock.mock(/\/api\/data-tree\/edit\/move-down/, 'post', moveDown)
  // Mock.mock(/\/api\/data-tree\/edit\/get-node/, 'post', getNode)
}

Mock.mock(/\/zk\/kafka/, 'get', getKafkaList)
Mock.mock(/\/downloadByPost/, 'post', downloadByPost)

Mock.setup({
  timeout: 0
})

export default Mock

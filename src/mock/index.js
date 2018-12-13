import Mock from 'mockjs'
import { getDataTree, addTreeNode, renameTreeNode } from './data-tree'
import { getQueries, getDataSourceList, getDataSourceDimList, getDateRangeAgg, updateDimCatList } from './summary-query'
import { getDsoProductList, setDsoCategory, deleteDso, listProducts, addProduct } from './current-dso-list'

var getWelcomeMsg = function getWelcomeMsg ({ url, type, body }) {
  return {
    msg: 'mock hello world!'
  }
}

var downloadByPost = function ({ url, type, body }) {
  var m = body.match(/.*content=(.*?)&.*/)
  debugger
  var s = decodeURIComponent(m[1])
  return encodeURIComponent(s)
}

Mock.mock(/\/getWelcomeMsg/, 'get', getWelcomeMsg)

Mock.mock(/\/api\/data-tree/, 'get', getDataTree)

Mock.mock(/\/api\/data-tree\/edit\/add/, 'post', addTreeNode)
Mock.mock(/\/api\/data-tree\/edit\/rename/, 'post', renameTreeNode)

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
}

Mock.mock(/\/downloadByPost/, 'post', downloadByPost)

Mock.setup({
  timeout: 0
})

export default Mock

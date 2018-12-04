import Mock from 'mockjs'
import { getDataTree } from './data-tree'
import { getDataSourceList, getDataSourceDimList, getDateRangeAgg, updateDimCatList } from './summary-query'

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

// 集成测试时，暂时手工设置为true
var integrationTest = true

if (!integrationTest) {
  Mock.mock(/\/api\/summary-query\/date-range-agg/, 'post', getDateRangeAgg)
  Mock.mock(/\/api\/summary-query\/datasources/, 'get', getDataSourceList)
  Mock.mock(/\/api\/summary-query\/dims/, 'post', getDataSourceDimList)
  Mock.mock(/\/api\/summary-query\/update-dim-cat-list/, 'post', updateDimCatList)
}

Mock.mock(/\/downloadByPost/, 'post', downloadByPost)

Mock.setup({
  timeout: 0
})

export default Mock

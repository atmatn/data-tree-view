import Mock from 'mockjs'
import { getDataTree } from './data-tree'
import { getDataSourceList, getDataSourceDimList, getDimValsPvUv, getDateRangePvUv } from './summary-query'

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

Mock.mock(/\/api\/summary-query\/datasources/, 'get', getDataSourceList)

Mock.mock(/\/api\/summary-query\/dims/, 'post', getDataSourceDimList)

Mock.mock(/\/api\/summary-query\/dim-vals-pv-uv/, 'post', getDimValsPvUv)

Mock.mock(/\/api\/summary-query\/date-range-pv-uv/, 'post', getDateRangePvUv)

Mock.mock(/\/downloadByPost/, 'post', downloadByPost)

Mock.setup({
  timeout: 0
})

export default Mock

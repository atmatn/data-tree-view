export const getDataSourceList = ({ url, type, body }) => {
  return {
    dataSources: ['mobileDictClient_android', 'FANYIAPP_iphone']
  }
}

export const getDataSourceDimList = ({ url, type, body }) => {
  // debugger
  var m = [ JSON.parse(body).dataSource + '_d1' ]
  return {
    dimList: ['action', 'click', 'type', 'other', 'model'].concat(m)
  }
}

export const getDimValsPvUv = ({ url, type, body }) => {
  var b = JSON.parse(body)
  var curDim = b.curDim
  return {
    dimValsPvUvData: [
      { value: curDim + '_value_1', pv: 8, uv: 3 },
      { value: curDim + '_value_2', pv: 7, uv: 2 },
      { value: curDim + '_value_3', pv: 3, uv: 1 }
    ]
  }
}

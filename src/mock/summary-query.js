import moment from 'moment'
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
      { 'dim_val': curDim + '_value_1', pv: 8, uv: 3 },
      { 'dim_val': curDim + '_value_2', pv: 7, uv: 2 },
      { 'dim_val': curDim + '_value_3', pv: 3, uv: 1 }
    ]
  }
}

export const getDateRangePvUv = ({ url, type, body }) => {
  var b = JSON.parse(body)
  // var dataSource = b.dataSource
  var fromDate = b.dateRange.from
  var toDate = b.dateRange.to

  var dataList = []
  var pv
  // debugger
  for (var day = fromDate; day <= toDate; day = moment(day + 'T00:00:00').add(1, 'days').format('YYYY-MM-DD')) {
    pv = 300 + Math.round(Math.random() * 100)
    dataList.push({
      day: day,
      uv: Math.round(pv * Math.random()),
      pv: pv
    })
  }

  return {
    dateRangePvUvData: dataList
  }
}

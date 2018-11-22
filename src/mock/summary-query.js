import moment from 'moment'
export const getDataSourceList = ({ url, type, body }) => {
  return {
    dataSources: [
      {
        value: 'mobileDictClient_android'.toLowerCase(),
        // uidConf: {
        //   uidFieldList: ['imei', 'login_user'],
        //   defaultUidField: 'imei'
        // }
      },
      {
        value: 'FANYIAPP_iphone'.toLowerCase(),
        // uidConf: {
        //   uidFieldList: ['imei'],
        //   defaultUidField: 'imei'
        // }
      },
      {
        value: 'mobiledictclient_perf',
        // uidConf: {
        //   uidFieldList: [],
        //   defaultUidField: null
        // }
      }]
    // dataSources: ['mobileDictClient_android', 'FANYIAPP_iphone', 'mobiledictclient_perf'].map(x => x.toLowerCase())
  }
}

export const getDataSourceDimList = ({ url, type, body }) => {
  // debugger
  var ds = JSON.parse(body).dataSource;
  var m = [ ds + '_d1' ]
  var dimList = ['visitkey', 'key', 'keyfrom', 'type',
    'basepath', 'model', 'mid', 'vendor', 'block', 'le',
    'phoneversion', 'localversion', 'os', 'action', 'show',
    'setting', 'other', '_request', 'clipboard_query',
    'clipboard_query_click', 'clipboard_need_active',
    'clipboard_actived', 'set_clipboard_on', 'set_clipboard_off',
    'splash_ad_show', 'show_splash_ad_id', 'abtest', 'opensubbook',
    'openbook', 'tab', 'from', 'direct', 'optbookid', 'optparentbookid',
    'style', 'dailydur', 'update', 'count', '_username',
    'msgid', 'community', 'id', 'replyto', 'postid', 'channel', 'sound_length',
    'source', 'position', 'at', 'group', 'score', 'bec', 'cet6', 'kaoyan', 'gre',
    'gmat', 'toefl', 'sat', 'ielts', 'middle_school', 'high_school', 'cet4',
    'articleid', 'base_url', 'location', 'platform_lc', 'pos', 'rk', 'category_name',
    'network', 'video_type', 'screen', 'click', 'unit', 'head', 'resource_id', 'query',
    'method', 'shape', 'tag', 'strategy', 'reason', 'result', 'paid', 'answerid',
    'beginfrom', 'subscribed', 'coursecategory', 'base', 'outvendor', 'username',
    'platform', 'device', 'browser', 'iplocation', 'ipcom', 'ipcountry', 'ipprovince',
    'ip', 'referer', 'url', 'username_type', 'imei', 'qhead', 'qclassifier', 'keywords',
    'ts', 'ocravgtime', 'runduration', 'startappduration', 'queryduration', 'querywebdictduration',
    'querysentencesduration', 'querywikiduration', 'querytranduration', 'wordbookduration',
    'displayorderedbyascduration', 'displayorderedbydateduration', 'displayinshowingintpduration',
    'displayinhidingintpduration', 'duration', 'client_ts',
    'keywords_array', 'q', 'useragent', 'target', 'login_user', 'newimei', 'form',
    'infoid', 'role', 'state'].concat(m)

  var uidConf = {
    uidFieldList: ['imei', 'login_user'],
    defaultUidField: 'imei'
  }

  if (ds === 'mobiledictclient_perf') {
    dimList = ['visitkey', 'action', 'other', 'type', 'network',
      'keyfrom', 'isdurationvalid', 'platform', 'device', 'browser',
      'iplocation', 'ipcom', 'ipcountry', 'ipprovince', 'ip', 'referer',
      'url', 'username_type', 'ts', 'duration', 'q', 'client_ts']
    uidConf = {
      uidFieldList: [],
      defaultUidField: null
    }
  }

  var moreInfoDimList = dimList.map(x => {
    return {
      value: x,
      category: '默认分类'
    }
  }
  )

  return {
    dimList: moreInfoDimList,
    uidConf: uidConf
  }
}

// export const getDimGroupByAgg = ({ url, type, body }) => {
//   var b = JSON.parse(body)
//   var { dataSource, aggs, groupByDims } = b
//   var curDim = b.curDim
//   var arr = []

//   var curObj = []
//   function fill(depth) {
//     if (depth > groupByDims.length) {
//       arr.push([...curObj])
//     } else {
//       for (var i = 0; i < 10; i++) {

//       }
//     }
//   }
//   // var pv
//   // var uv
//   for (var i = 0; i < 100; i++) {
//     // pv = 300 + Math.round(Math.random() * 100)
//     // uv = Math.round(pv * Math.random()) + 1
//     let lineObj = { 'dim_val': curDim + '_value_' + i }
//     aggs.forEach(agg => {
//       lineObj[agg.name] = 300 + Math.round(Math.random() * 100)
//     })
//     arr.push(
//       lineObj
//     )
//     arr = arr.sort((a, b) => b.uv - a.uv)
//     // debugger
//   }

//   var isSampled = (ds === 'mobiledictclient_android' && (b.filters === undefined || b.filters.length === 0))

//   if (isSampled) {
//     return {
//       dimGroupByAggData: arr,
//       isSampled,
//       sampleType: '1/32',
//       preciseSql: `
//       -- 这个SQL是仅用于示意，不保证能够成功运行！
//       select count(*) PV, count(distinct imei) UV from dso.${ds}
//        where day = '${day}' and ... group by '${curDim}';
//       `
//     }
//   } else {
//     return {
//       isSampled,
//       dimGroupByAggData: arr
//     }
//   }
// }

export const getDateRangeAgg = ({ url, type, body }) => {
  var b = JSON.parse(body)
  // var dataSource = b.dataSource
  var fromDate = b.dateRange.from
  var toDate = b.dateRange.to
  var ds = b.dataSource
  var groupByList = b.groupByList || []
  var filters = b.filters

  var dataList = []
  var pv
  // debugger

  var curObj = {}
  // -1 表示day, >=0 表示groupBy的dim
  function fill (depth) {
    if (depth >= groupByList.length) {
      dataList.push({ ...curObj })
    } else if (depth === -1) {
      for (var day = fromDate; day <= toDate; day = moment(day + 'T00:00:00').add(1, 'days').format('YYYY-MM-DD')) {
        curObj['day'] = day
        fill(depth + 1)
      }
    } else {
      // groupBy dim
      var groupByItem = groupByList[depth]
      for (var i = 0; i < 10; i++) {
        curObj[groupByItem] = (i === 0 ? null : (groupByItem + '_' + i))
        fill(depth + 1)
      }
    }
  }

  // 生成数据行
  fill(-1)

  dataList.forEach(item => {
    b.aggs.forEach(agg => {
      item[agg.name] = Math.round(10000 * Math.random())
    })
    // 保证UV小于UV
    if (item['pv'] !== undefined && item['pv'] > 0) {
      if (item['uv'] !== undefined && item['uv'] > item['pv']) {
        item['uv'] = Math.round(item['pv'] * Math.random())
      }
    }
  })

  var isSampled = (ds === 'mobiledictclient_android' && (b.filters === undefined || b.filters.length === 0))

  var selectExprForGroupBy = groupByList.map(x => `,\`${x}\``).join(' ')
  var groupByExprForGroupBy = ' group by day ' + selectExprForGroupBy

  var whereExprForFilters = filters.map(filter => {
    if (filter.operator === '=') {
      return `and ${filter.dim} = '${filter.dimVal}'`
    } else if (filter.operator === 'like') {
      return `and lower(${filter.dim}) like '%${filter.dimVal.toLowerCase()}%'`
    }
  }).join(' ')

  var preciseSql = `
  -- 这个SQL是仅用于示意，不保证能够成功运行！
  select count(*) PV, count(distinct imei) UV, day ${selectExprForGroupBy} from dso.${ds}
   where day between '${fromDate}' and '${toDate}' ${whereExprForFilters}
   ${groupByExprForGroupBy} ;
  `

  debugger
  if (isSampled) {
    return {
      dateRangeAggData: dataList,
      isSampled,
      sampleType: '1/32',
      preciseSql
    }
  } else {
    return {
      dateRangeAggData: dataList,
      isSampled
    }
  }
}

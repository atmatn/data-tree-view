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

export const getDimValsPvUv = ({ url, type, body }) => {
  var b = JSON.parse(body)
  var curDim = b.curDim
  var arr = []
  var pv
  var uv
  for (var i = 0; i < 100; i++) {
    pv = 300 + Math.round(Math.random() * 100)
    uv = Math.round(pv * Math.random()) + 1
    arr.push(
      { 'dim_val': curDim + '_value_' + i, pv, uv }
    )
    arr = arr.sort((a, b) => b.uv - a.uv)
    // debugger
  }
  return {
    dimValsPvUvData: arr
  }
}

export const getDateRangeAgg = ({ url, type, body }) => {
  var b = JSON.parse(body)
  // var dataSource = b.dataSource
  var fromDate = b.dateRange.from
  var toDate = b.dateRange.to
  var ds = b.dataSource

  var dataList = []
  var pv
  // debugger
  for (var day = fromDate; day <= toDate; day = moment(day + 'T00:00:00').add(1, 'days').format('YYYY-MM-DD')) {
    pv = 300 + Math.round(Math.random() * 100)
    let item = { day }
    b.aggs.forEach(agg => {
      item[agg.name] = Math.round(pv * Math.random()) + 1
    })
    dataList.push(item)
  }

  var isSampled = (ds === 'mobiledictclient_android' && (b.filters === undefined || b.filters.length === 0))

  if (isSampled) {
    return {
      dateRangeAggData: dataList,
      isSampled,
      sampleType: '1/32',
      preciseSql: `
      -- 这个SQL是仅用于示意，不保证能够成功运行！
      select count(*) PV, count(distinct imei) UV from dso.${ds}
       where day between '${fromDate}' and '${toDate}' and ... ;
      `
    }
  } else {
    return {
      dateRangeAggData: dataList,
      isSampled
    }
  }
}

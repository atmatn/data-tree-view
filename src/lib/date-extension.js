// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// dateFormat((new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
export const dateFormat = function (dt, fmt) {
  var o = {
    'M+': dt.getMonth() + 1, // 月份
    'd+': dt.getDate(), // 日
    'h+': dt.getHours(), // 小时
    'm+': dt.getMinutes(), // 分
    's+': dt.getSeconds(), // 秒
    'q+': Math.floor((dt.getMonth() + 3) / 3), // 季度
    'S': dt.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

Date.getCurrentTimeStr = function getCurrentTimeStr () {
  var today = new Date()
  return Date.getTimeStr(today, 'T')
}

function addPrefixZero (dd) {
  if (dd < 10) {
    dd = '0' + dd
  }
  return dd
}

Date.getTimeStr = function getTimeStr (today, split) {
  split = split || ' '
  var dd = today.getDate()
  var mm = today.getMonth() + 1 // January is 0!
  var yyyy = today.getFullYear()

  var t = yyyy + '-' + addPrefixZero(mm) + '-' + addPrefixZero(dd) + split + addPrefixZero(today.getHours()) + ':' + addPrefixZero(today.getMinutes()) + ':' + addPrefixZero(today.getSeconds())
  return t
}

/**
fn = Math.ceiling / Math.floor
**/
export const toIntDay = function timestampToIntDay (dt, fn) {
  // console.log("[timestampToIntDay] ts=" + ts)
  var day = (dt / 1000 / 60 / 60 + 8) / 24
  // console.log("[timestampToIntDay] day=" + day)
  if (fn) {
    // 从 epoch + 8小时开始（因为中国的时区有8小时偏移）
    let ret = fn(day)
    // console.log("[timestampToIntDay] ret=" + ret)
    return ret
  } else {
    let ret = Math.floor(day)
    // console.log("[timestampToIntDay] ret=" + ret)
    return ret
  }
}

Date.intDayToTs = function intDayToTs (intDay) {
  var ts = intDay * 1000 * 3600 * 24 - 8 * 3600 * 1000
  return ts
}

Date.intDayToDate = function intDayToDate (intDay) {
  var ts = Date.intDayToTs(intDay)
  return new Date(ts)
}

export const intDayToDateStr = Date.intDayToDateStr = function intDayToDateStr (intDay) {
  var dt = Date.intDayToDate(intDay)
  // console.log("[intDayToDateStr] ts=' + ts)
  return dateFormat(dt, 'yyyy-MM-dd')
}

Date.intDayToDateStrShort = function intDayToDateStr (intDay) {
  var dt = Date.intDayToDate(intDay)
  // console.log('[intDayToDateStr] ts=' + ts)
  return dateFormat(dt, 'yyyyMMdd')
}

Date.intDayToMonthStr = function intDayToMonthStr (intDay) {
  var dt = Date.intDayToDate(intDay)
  // console.log('[intDayToDateStr] ts=' + ts)
  return dateFormat(dt, 'yyyy-MM')
}

Date.intDayOfThisMonthFirstDay = function intDayOfThisMonthFirstDay (intDay) {
  var d = Date.intDayToDate(intDay)
  d.setDate(1)
  return toIntDay(d)
}

Date.intDayOfLastMonthFirstDay = function intDayOfLastMonthFirstDay (intDay) {
  var d = Date.intDayToDate(intDay)
  d.setDate(1)
  d.setMonth(d.getMonth() - 1)
  return toIntDay(d)
}

Date.intDayOfLastMonthLastDay = function intDayOfLastMonthLastDay (intDay) {
  var d = Date.intDayToDate(intDay)
  d.setDate(0)
  return toIntDay(d)
}

Date.dateStrToIntDay = function dateStrToIntDay (dateStr) {
  var tmpDate = dateStr + 'T00:00:00+08:00'
  var dt = Date.parse(tmpDate)
  return toIntDay(new Date(dt))
}

Date.dateStrShortToIntDay = function dateStrToIntDay (dateStr) {
  var m = dateStr.match(/(\d{4})(\d{2})(\d{2})/)
  if (m != null) {
    dateStr = m[1] + '-' + m[2] + '-' + m[3]
    var tmpDate = dateStr + 'T00:00:00+08:00'
    var dt = Date.parse(tmpDate)
    return toIntDay(new Date(dt))
  }
}

// example:
// input: 2016-05-15
// output: 2016-05-16
Date.nextDateStr = function (dateStr, delta) {
  var tmpDate = dateStr + 'T00:00:00+08:00'
  var dt = Date.parse(tmpDate)
  return Date.intDayToDateStr(toIntDay(new Date(dt)) + (delta === undefined ? 1 : delta))
}

export const yesterdayDateStr = Date.yesterdayDateStr = function () {
  return Date.intDayToDateStr(toIntDay(new Date()) - 1)
}

Date.yesterdayDateStrShort = function () {
  return Date.intDayToDateStrShort(toIntDay(new Date()) - 1)
}

Date.lastSunday = function (intDay) {
  var ts = Date.intDayToTs(intDay)
  var nWeekDay = new Date(ts).getDay()
  return (intDay - nWeekDay)
}

Date.lastMonthLastDay = function () {
  var curTimeStr = Date.getCurrentTimeStr()
  var firstDayThisMonth = curTimeStr.substr(0, 7) + '-01'
  var targetDay = Date.dateStrToIntDay(firstDayThisMonth) - 1
  return Date.intDayToDateStr(targetDay)
}

Date.genDayList = function (fromDate, toDate) {
  var shortDate = false
  if (fromDate.match(/\d{8}/) != null) {
    shortDate = true
  }
  var retList = []

  if (shortDate) {
    var nDay = Date.dateStrShortToIntDay(fromDate)
    var nDayEnd = Date.dateStrShortToIntDay(toDate)
    for (let d = nDay; d <= nDayEnd; d++) {
      retList.push(Date.intDayToDateStrShort(d))
    }
  } else {
    for (let d = fromDate; d <= toDate; d = Date.nextDateStr(d)) {
      retList.push(d)
    }
  }
  return retList
}

// eslint-disable-next-line
Date.prototype.format = function(fmt) {
  return dateFormat(this, fmt)
}

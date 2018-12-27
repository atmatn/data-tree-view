import $ from 'jquery'
import _ from 'underscore'
var cacheMap = {}
export const getListFromMeta = function getListFromMeta (meta) {
  // console.log(meta)
  var metaObj = JSON.parse(meta)
  if (metaObj === null) {
    return []
  }
  if (metaObj.type === 'listed') {
    return metaObj.val
  } else if (metaObj.type === 'url') {
    var url = metaObj.val
    if (cacheMap[url] !== undefined) {
      return cacheMap[url]
    } else {
      var ret = []
      $.ajax({
        url: url,
        async: false,
        success: function (data) {
          if (typeof (data) === 'string') {
            ret = JSON.parse(data)
          } else {
            ret = data
          }
        },
        error: function () {
          console.log('error get url: ' + metaObj.val)
        }
      })
      cacheMap[url] = ret
      return ret
    }
  }
}

export const getStringFromMeta = function getStringFromMeta (meta) {
  console.log(meta)
  var metaObj = JSON.parse(meta)
  return metaObj
}

export const getDefaultLengthFromMeta = function getStringFromMeta (meta, defaultVal) {
  var ret = defaultVal
  if (meta !== null && meta !== '') {
    console.log(meta)
    var metaObj = JSON.parse(meta)
    if (metaObj.type === 'default_length') {
      ret = metaObj.val
    }
  }
  return ret
}

export const getList = function getList (txt) {
  var payCourses = txt.split('\n')
  var idsTrimmed = _.flatten(_.map(payCourses, function (v) {
    var tv = v.trim()
    return tv === '' ? [] : [tv]
  }))
  return idsTrimmed
}

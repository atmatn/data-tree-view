import _ from '@/lib/myunderscore'
import { get_presto } from '@/lib/custom-script/custom-script'

const jsCodeTemplate = _.template('http://hd020:18080/jsCode?id=<%=id%>,' +
  'http://hd035:18080/jsCode?id=<%=id%>')

const snippetTemplate = _.template('http://hd020:18080/snippet/<%=id%>,' +
  'http://hd035:18080/snippet/<%=id%>')

const runJsPostUrl = 'http://hd020:18080/runjs/sample'

const modExpr = function modExpr (aggExpr) {
  return aggExpr.replace(/\$\{(.+?)\}/g,
    ' json_extract_scalar(j, \'$.$1\')')
}

export const set_snippet = function setSnippet (snippetObj) {
  var ret
  var d = JSON.stringify(snippetObj, null, 4)
  // debugger;
  $.ajax({
    method: 'POST',
    url: '/snippet',
    processData: false,
    data: d,
    'contentType': 'application/json',
    success: function (data) {
      console.log('set snippet success: ' + JSON.stringify(data))
      ret = data
    },
    error: function (data) {
      console.log('set snippet fail!')
    },
    async: false
  })
  return ret
}

export const runJs = function runJs (params) {
  var scriptId = params.scriptId
  var constantArg = params.constantArg
  var source = params.source
  var criteria = params.criteria
  var arrCol = params.arrCol
  var aggExpr = params.aggExpr
  var groupByExpr = params.groupByExpr
  var havingExpr = params.havingExpr || ' 1 = 1'
  var debug = params.debug
  var debugInclude = params.debugInclude
  var callback = params.callback
  var detail = params.detail
  var nextQuery = params.nextQuery // 如果不是用aggExpr，则使用nextQuery

  debugger

  if (scriptId === undefined) {
    var e = '错误！缺少scriptId参数！'
    throw e
  }

  var snippetPath
  if (constantArg !== undefined) {
    var snippetId = set_snippet(constantArg)
    snippetPath = snippetTemplate({
      id: snippetId
    })
  } else {
    snippetPath = '{}'
  }
  var jsCodePath = jsCodeTemplate({
    id: scriptId
  })

  if (criteria === undefined) {
    criteria = ' 1 = 1'
  }

  var sqlT1Core = _.template(
    `select
    runjs2(<%= arrCol%>,
    '<%=jsCodePath%>',
    '<%=snippetPath%>',<%=postPath%>,<%=postContains%>) as res,* from
    <%= source%> where <%= criteria %>`,
    {
      arrCol: arrCol,
      jsCodePath: jsCodePath,
      snippetPath: snippetPath,
      criteria: criteria,
      source: source,
      postPath: debug ? "'" + runJsPostUrl + '\'' : 'NULL',
      postContains: debugInclude ? ("'" + debugInclude + "'") : 'NULL'
    })

  if (detail) {
    var tsStr = new Date().getTime()
    var t1Name = 'temp.tmp_' + tsStr
    let sqlT1 = `create table ${t1Name} as ${sqlT1Core};`
    get_presto(sqlT1, function () {
      var sqlT2 = _.template(`
      with t2 as ( select json_parse(res) j,* from <%=t1%> ) `, {
        t1: t1Name
      })
      aggStep(sqlT2)
    })
    return {
      detailTable: t1Name
    }
  } else {
    let sqlT1 = `with t1 as (${sqlT1Core}),`
    var sqlT2 = _.template(`
    t2 as ( select json_parse(res) j,* from t1 ) `, {})
    return aggStep(sqlT1 + sqlT2)
  }

  function aggStep (prependSql) {
    var sqlR
    if (groupByExpr !== undefined && aggExpr !== undefined) {
      var aggExprMod = modExpr(aggExpr)
      var groupByExprMod = modExpr(groupByExpr)
      var havingExprMod = modExpr(havingExpr)

      sqlR = _.template(`
        select <%=aggExpr%> from t2 group by <%=groupByExpr%> having <%=havingExpr%>;
      `,
      {
        aggExpr: aggExprMod,
        groupByExpr: groupByExprMod,
        havingExpr: havingExprMod
      }
      )
    } else {
      if (groupByExpr === undefined && nextQuery === undefined) {
        let aggExprMod = modExpr(aggExpr)
        sqlR = _.template(`
          select <%=aggExpr%> from t2;
          `,
        {
          aggExpr: aggExprMod
        }
        )
      } else if (nextQuery !== undefined) {
        sqlR = nextQuery
      } else {
        let e = '参数错误！必须有aggExpr或nextQuery之一！'
        throw e
      }
    }
    var sql = prependSql + sqlR
    return get_presto(sql, callback)
  }
}

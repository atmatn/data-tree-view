import $ from 'jquery'
import Vue from 'Vue'
import _ from 'underscore'
import { downloadCsv } from '@/lib/tools'
import { Table, Button } from 'iview'
import { timeFormatter, autoFormat } from '@/lib/format'
import '@/lib/custom-script.css'
function isHeadless () {
  return false
}

function createTable (title) {
  var tmpl =
  `
  <div class="custom-table-div"><h2><%= title %></h2>
      <table class="custom-table"></table>
      <div class="download-button-wrap">
      <button class="download-button-utf8">下载表格(csv, utf8编码)</button>
      <button class="download-button-gbk">下载表格(csv, gbk编码)</button></div>
  </div>
  `
  return _.template(tmpl)({ title: title })
}

function createTableHeader (headers, userClassMap, hideDate) {
  var tmpl =
  `<thead><tr><th class="date">日期</th>
      <% for(var i=0; i<headers.length; i++) {%>
      <th class="<%- userClassMap[headers[i]] %>"><%- headers[i] %></th>"+
      <% } %>
      </tr></thead>
  `
  var f = _.template(tmpl);
  var html = f({ headers: headers, userClassMap: userClassMap })
  var $elem = $(html)
  if (hideDate) {
    $elem.find('.date').hide()
  }
  return $elem
}

function createTableBody () {
  var tmpl = '<tbody></tbody>'
  return _.template(tmpl)({})
}

function createTableLine (time, headers, values, attachDataList, userClassMap, hideDate) {
  var tmpl =
  `
  <tr>
    <td class="date"><%- time %></td>
    <% for(var i=0; i<values.length; i++) {%>
      <td class="colVal <%- userClassMap[headers[i]] %>"><%= autoFormat(headers[i], values[i]) %></th>
    <% } %>
    </tr>
  `
  var f = _.template(tmpl)
  var html = f({
    time: timeFormatter(time),
    values: values,
    headers: headers,
    userClassMap: userClassMap,
    autoFormat: autoFormat
  })
  var $tableLine = $(html)

  // 对周末进行特殊处理
  var treatAsWeekend = false
  var datePattern = /(\d{4}-\d{2}-\d{2})/
  var m = ('' + time).match(datePattern)
  if (m != null) {
    var nDay = Date.dateStrToIntDay(m[0])
    var nWeekday = nDay % 7
    if (nWeekday === 2 || nWeekday === 3) {
      treatAsWeekend = true
    }
  }
  if (treatAsWeekend) {
    $tableLine.addClass('weekend')
  }

  if (hideDate) {
    $tableLine.find('.date').hide()
  }
  var $tdList = $tableLine.find('.colVal')
  for (var i = 0; i < headers.length; i++) {
    var attachData = attachDataList[ i ] || {}
    var $td = $($tdList[i])
    $td.data('attachData', attachData)
    if (attachData.css !== undefined) {
      // debugger;
      $td.css(attachData.css)
    }
    if (attachData.addClass !== undefined) {
      $td.addClass(attachData.addClass)
    }
    if (attachData.callback !== undefined) {
      attachData.callback($td, attachData)
    }
  }
  return $tableLine
}

export const drawTable = function (params) {
  var table = params.source
  var title = params.title
  var data = table.data
  var cols = table.cols
  if (typeof (data) !== 'object' || !(data instanceof Array)) {
    if (typeof (data) === 'string' && data.indexOf('ERROR') >= 0) {
      alert('查询失败：' + data)
    } else {
      debugger
      alert("drawTable(): 'data' 参数错误！")
    }
    return
  }
  if (typeof (cols) !== 'object' || !(cols instanceof Array)) {
    debugger
    alert("drawTable(): 'cols' 参数错误！")
    return
  }
  var renderMap = params.renderMap
  var renderHeaderMap = params.renderHeaderMap
  var headerMap = params.headerMap
  var widthMap = params.widthMap
  var fixedMap = params.fixedMap || {}
  var $target = params.$target
  var inlineStyle = params.inlineStyle || {}
  var tableHeight = ''
  if (typeof (params.tableHeight) === 'number') {
    tableHeight = params.tableHeight
  } else if (typeof (params.tableHeight) === 'string') {
    var m = params.tableHeight.match(/^(.*)%/)
    if (m != null) {
      tableHeight = $(window).height() * (m[1] / 100)
    }
  }
  var useSimpleTable = (params.simple === true)
  var $newElem = $('<div>')
  $target.append($newElem)

  var e = $newElem[0]

  if (!isHeadless() && data.length < 3000 && !useSimpleTable) {
    var v = new Vue({
      el: e,
      // template: '<div class="draw-table-div" v-bind:style="inlineStyle"><h2 class="h2">{{title}}</h2><i-table stripe border :columns="cols" :data="data" :height="height">abc</i-table><i-button @click="downloadClick(\'UTF-8\')">下载表格(csv, utf8编码)</i-button> <i-button @click="downloadClick(\'GBK\')">下载表格(csv, gbk编码)</i-button></div>',
      render (h) {
        // '<div class="draw-table-div" v-bind:style="inlineStyle"><h2 class="h2">{{title}}</h2><i-table stripe border :columns="cols" :data="data" :height="height">abc</i-table><i-button @click="downloadClick(\'UTF-8\')">下载表格(csv, utf8编码)</i-button> <i-button @click="downloadClick(\'GBK\')">下载表格(csv, gbk编码)</i-button></div>',
        return (
          <div class="draw-table-div" style={inlineStyle}>
            <h2 class="h2">{this.title}</h2>
            <Table stripe border columns={this.cols} data={this.data} height={this.height}></Table>
            <Button onClick={this.downloadClick.bind(this, 'UTF-8')}>下载表格(csv, utf8编码)</Button>
            <Button onClick={this.downloadClick.bind(this, 'GBK')}>下载表格(csv, gbk编码)</Button>
          </div>
        )
      },
      data: function () {
        return {
          height: tableHeight,
          inlineStyle: inlineStyle,
          title: title !== undefined ? title : '表格',
          cols: _.map(cols, function (c) {
            var h
            if (headerMap !== undefined &&
                    headerMap[c] !== undefined) {
              h = headerMap[c]
            } else {
              h = c
            }
            var render
            if (renderMap !== undefined &&
                    renderMap[c] !== undefined) {
              render = renderMap[c]
            }
            var renderHeader
            if (renderHeaderMap !== undefined &&
                renderHeaderMap[c] !== undefined) {
              renderHeader = renderHeaderMap[c]
            }
            var fixed
            if (fixedMap !== undefined &&
              fixedMap[c] !== undefined) {
              fixed = fixedMap[c]
            }

            var width
            if (widthMap !== undefined &&
                widthMap[c] !== undefined) {
              width = widthMap[c]
            } else if (widthMap !== undefined && widthMap['default'] !== undefined ) {
              width = widthMap['default']
            }
            return {
              title: h,
              key: c,
              sortable: true,
              render: render,
              renderHeader: renderHeader,
              width: width,
              fixed: fixed
            }
          }),
          data: data
        }
      },
      methods: {
        downloadClick: function (encoding) {
          debugger
          downloadCsv(cols, data, encoding)
        }
      }
    })
    v
  } else {
    debugger
    var tblHtml = createTable(title)
    var $tbl = $(tblHtml)
    var colNames = _.map(cols, function (x) {
      if (headerMap !== undefined && headerMap[x] !== undefined) {
        return headerMap[x]
      } else {
        return x
      }
    })
    var $thead = createTableHeader(colNames, {}, true)
    var $tbody = $(createTableBody())
    for (var i = 0; i < data.length; i++) {
      var values = []
      for (var j = 0; j < cols.length; j++) {
        values.push(data[i][cols[j]])
      }
      $tbody.append(createTableLine('', cols, values, [], {}, true));
    }
    $tbl.find('.custom-table').append($thead)
    $tbl.find('.custom-table').append($tbody)
    $newElem.append($tbl)

    var $downloadButtonUtf8 = $tbl.find('.download-button-utf8')
    $downloadButtonUtf8.on('click', function () {
      downloadCsv(cols, data, 'UTF-8')
    })

    var $downloadButtonGBK = $tbl.find('.download-button-gbk')
    $downloadButtonGBK.on('click', function () {
      downloadCsv(cols, data, 'GBK')
    })
  }
}

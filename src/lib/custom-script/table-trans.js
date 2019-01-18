import _ from 'underscore'
export const collapseTable = function collapseTable (params) {
  var dontMakeToColNameIfOnlyOneMtr = (params.dontMakeToColNameIfOnlyOneMtr===undefined?true:false);
  var dontMakeToColNameIfOnlyUndefined = (params.dontMakeToColNameIfOnlyUndefined===undefined?true:false);
  var forceToZeroIfNoDef = (params.forceToZeroIfNoDef === undefined?true:false);

  var lineMap = {};
  var allowMap = params.allowMap || {};  //如果对一个dim有取值限制，则为[可选值], 否则为undefined
  var possibleForDim = {}; //对于没有limit的dim，在这里统计其可能性
  _.each( params.source.data ,function(line) {
      //主键列表
      var pkVals = _.map( params.pk, function(col){
          return line[col];
      });

      //主键string
      var pkStr = pkVals.join("|||");

      if( lineMap[pkStr] == undefined ) {
          lineMap[pkStr] = {
              pkVals: pkVals,
              newDimMap: {} // 存 newDimStr -> {mtrs}
          };
      }
      var lineObj = lineMap[pkStr];

      //新dim
      var allow = true;
      var newDimParts = _.map(params.collapseBy, function(col){
          var v = line[col];
          if( allowMap[col] != undefined ){
              //有限制
              if( !_.contains(allowMap[col], v) ) {
                  //其值没有被列出
                  allow = false;
              }
          }else{
              //无限制，统计可能性
              if( possibleForDim[col] == undefined ){
                  possibleForDim[col] = [];
              }
              possibleForDim[col] = _.union(possibleForDim[col], v);
              possibleForDim[col].sort();
          }
          return v;
      });

      if( !allow ) {
          console.log("跳过不符合allowMap的行: " + JSON.stringify(line, null, 4) );
          return;
      }

      var newDimStr = newDimParts.join("|||");
      if( lineObj.newDimMap[newDimStr] == undefined ){
          lineObj.newDimMap[newDimStr] = {
              newDimParts: newDimParts,
              mtrs: {}
          } //{mtrs};
      }

      var mtrObj = lineObj.newDimMap[newDimStr];
      //mtrs处理
      _.each(params.mtrs, function(mtr){
          if( mtrObj.mtrs[mtr] == undefined){
              mtrObj.mtrs[mtr] = (line[mtr] == undefined?0:line[mtr]);
          }else{
              mtrObj.mtrs[mtr] += (line[mtr] == undefined?0:line[mtr]);
          }
      });
  });

  //用于新列排序
  var newTableColMap = {};
  var newTableCols = [];
  var newTableColIdx = [];
  function addNewCol( colParts ) {
      var keyStr = colParts.join("|||");
      if( newTableColMap[keyStr] == undefined){
          //新列
          newTableColMap[keyStr] = 1;
          newTableColIdx.push( newTableCols.length );
          newTableCols.push( colParts );
      }
  }

  //生成所有需要满足的组合
  var allCombinitions = [];
  var curCombinition = [];
  function fillCombs(k){
      // debugger;
      var col = params.collapseBy[k];
      if( k >= params.collapseBy.length) {
          allCombinitions.push( {
              combKey: curCombinition.join("|||"),
              comb: curCombinition.concat([])
          } );
      }else{
          var possibleValues = allowMap[col] === undefined ? possibleForDim[col]:allowMap[col];
          if( possibleValues == undefined ) {
              possibleValues = [];
          }
          for(var i=0; i<possibleValues.length; i++ ) {
              curCombinition[k] = possibleValues[i];
              fillCombs(k+1);
          }
          curCombinition.pop();
      }
  }
  fillCombs(0);
  if(params.debug){
      debugger;
  }


  //构造新表格
  var newTable = [];
  // debugger;
  Object.keys(lineMap).forEach( function (lineMapKey){
      // debugger;
      var lineObj = lineMap[lineMapKey];
      var outObj = {};
      //构造主键列
      for(var i=0; i< params.pk.length; i++){
          outObj[params.pk[i]] = lineObj.pkVals[i];
      }
      //构造生成列
      var filledCombinitionKeys = [];
      Object.keys(lineObj.newDimMap).forEach(function(ndmk){
          var newDimObj = lineObj.newDimMap[ndmk];
          //用于看是否以满足所有组合
          var filledCombKey = newDimObj.newDimParts.join("|||");
          filledCombinitionKeys.push(filledCombKey);

          Object.keys(newDimObj.mtrs).forEach(
              function(mtr){
                  var newColParts;
                  if( dontMakeToColNameIfOnlyOneMtr && params.mtrs.length == 1) {
                      newColParts = newDimObj.newDimParts;
                  }else {
                      if( dontMakeToColNameIfOnlyUndefined &&
                          params.collapseBy.length == 1 &&
                          possibleForDim[params.collapseBy[0]] != undefined &&
                          possibleForDim[params.collapseBy[0]].length == 1 &&
                          possibleForDim[params.collapseBy[0]][0] == undefined &&
                          newDimObj.newDimParts.length == 1 &&
                          newDimObj.newDimParts[0] === undefined ) {
                          newColParts = [mtr];
                      }else{
                          newColParts = newDimObj.newDimParts.concat([mtr]);
                      }
                  }
                  addNewCol(newColParts);
                  outObj[newColParts.join(" ")] = newDimObj.mtrs[mtr];
              }
          );
      });
      //如果有未能满足的组合，需要填充0
      _.each( allCombinitions, function(comb) {
          if( !_.contains(filledCombinitionKeys, comb.combKey) ) {
              //不包含
              params.mtrs.forEach(
                  //每个mtr填0
                  function(mtr) {
                      if (dontMakeToColNameIfOnlyOneMtr && params.mtrs.length == 1) {
                          newColParts = comb.comb;
                      }
                      else {
                          if( dontMakeToColNameIfOnlyUndefined &&
                              possibleForDim[params.collapseBy[0]] != undefined &&
                              possibleForDim[params.collapseBy[0]].length == 1 &&
                              possibleForDim[params.collapseBy[0]][0] == undefined &&
                              comb.comb.length == 1 &&
                              comb.comb[0] === undefined ) {
                              newColParts = [mtr];
                          }else {
                              newColParts = comb.comb.concat([mtr]);
                          }
                      }
                      addNewCol(newColParts);
                      outObj[newColParts.join(" ")] = 0;
                  });

          }
      });
      newTable.push( outObj );
  });

  //新列排序
  if( params.debug ) {
      debugger;
  }
  newTableColIdx.sort( function(a,b){
      var colsA = newTableCols[a];
      var colsB = newTableCols[b];

      //递归比较
      function cmp( idx ){
          //排序逻辑要调整
          function score(v){
              if( params.debug ) {
                  debugger;
              }
              if( v == undefined ) {
                  return -1;
              }
              if( idx < params.collapseBy.length ) {
                  //来自collapseBy
                  var col = params.collapseBy[idx];
                  var ordList = ( allowMap[ col ] !== undefined )?allowMap[col]:possibleForDim[col];
                  return _.indexOf(ordList, v);
              }else{
                  //来自mtrs
                  return _.indexOf(params.mtrs, v);
              }

          }
          if( score(colsA[idx]) < score(colsB[idx])) {
              return -1;
          }else if(score(colsA[idx]) > score(colsB[idx]) ) {
              return 1
          }else{
              //递归往后比较
              if( idx+1 < colsA.length && idx+1 < colsB.length) {
                  return cmp(idx + 1);
              }else{
                  if( colsA.length > colsB.length ) {
                      return -1;
                  } else if( colsA.length < colsB.length) {
                      return 1;
                  } else {
                      return 0;
                  }
              }
          }
      }
      return cmp(0);
  });

  if( params.debug ) {
      debugger;
  }
  var newCols = _.map( newTableColIdx, function(idx){
      return newTableCols[idx].join(" "); //新列的parts用" "分隔
  });

  return {
      data: newTable,
      cols: params.pk.concat(newCols)
  }
}

export const appendSum = function(params) {
  var dontMakeToColNameIfOnlyOneMtr = true;
  //检查参数
  if( !_.contains(params.source.cols, params.appendOn ) ) {
      debugger;
      throw "appendOn参数错误!源表不含" + params.appendOn + "列";
  }

  for(var i=0; i<params.mtrs.length; i++) {
      if( !_.contains(params.source.cols, params.mtrs[i]) ) {
          debugger;
          throw "mtrs参数错误!源表不含" + params.mtrs[i] + "列";
      }
  }

  var copySource = JSON.parse(JSON.stringify(params.source));

  //增加用于统计合计的列
  _.each( copySource.data, function(d){
      d[params.appendOn] = "合计";
  });

  var callParams = {
      source: copySource,
      pk: params.pk,
      collapseBy: [params.appendOn],
      mtrs: params.mtrs,
      dontMakeToColNameIfOnlyOneMtr: false
  };

  var callRet = collapseTable(
      callParams
  );

  // debugger;
  //把新增的"合计 mtr"改成"mtr"
  _.each( callRet.data, function(d){
      _.each( params.mtrs, function(mtr){
          var val = d["合计 " + mtr]
          delete d["合计 " + mtr];
          d[mtr] = val;
      });
      d[params.appendOn] = "合计";
  });

  // debugger;
  var retCols = params.pk.concat([params.appendOn]).concat(params.mtrs);
  var retData = params.source.data.concat(callRet.data);
  return {
      data: retData,
      cols: retCols
  }
}

export const appendBase = function(params){
  //检查参数
  for(var i=0; i<params.dims.length;i++){
      var dim = params.dims[i];
      if( params.allowMap[dim] === undefined ) {
          throw "dims参数错误，allowMap未指定" + dim + " 的可选项";
      }
  }

  if( params.mtrs == undefined || params.mtrs.length == 0) {
      throw "mtrs参数错误，必须指定一个有元素的list";
  }

  //深度优先，列举所有dim组合
  var appendCombs = [];
  var curComb = [];
  debugger;
  function fillDim(k){
      if( k >= params.dims.length ) {
          //填满
          appendCombs.push( curComb.concat([]));
      }else{
          var dim = params.dims[k];
          var possibleValues = params.allowMap[dim];
          if( possibleValues == undefined ) {
              debugger;
          }
          for(var i=0; i<possibleValues.length; i++) {
              curComb[k] = possibleValues[i];
              fillDim(k+1);
          }
          curComb.pop();
      }
  }
  fillDim(0);

  //生成数据行
  var appendLines = [];
  for(var i=0; i<appendCombs.length; i++ ) {
      var lineObj = {};
      //每个dim
      var dimComb = appendCombs[i];
      for(var j=0; j<params.dims.length; j++) {
          var dim = params.dims[j];
          lineObj[dim] = dimComb[j];
      }
      //每个mtr
      for(var j=0; j<params.mtrs.length; j++) {
          var mtr = params.mtrs[j];
          lineObj[mtr] = 0;
      }
      appendLines.push( lineObj );
  }

  var retData = params.source.data.concat( appendLines );
  return {
      data: retData,
      cols: params.source.cols
  };
}

export const genCols = function(params) {
  var dims = params.dims;
  var allowMap = params.allowMap;

  for(var i=0; i< params.dims.length; i++ ){
      var dim = params.dims[i];
      if( params.allowMap[dim] == undefined ||
          params.allowMap[dim].length == 0 ){
          throw "allowMap中没有正确配置dim=" + dim;
      }
  }

  //生成所有组合
  var allCombinitions = [];
  var curCombinition = [];
  function fillCombs(k){
      var col = params.dims[k];
      if( k >= params.dims.length) {
          allCombinitions.push( curCombinition.join(" ") );
      }else{
          var possibleValues = allowMap[col];
          if( possibleValues == undefined ) {
              debugger;
          }
          for(var i=0; i<possibleValues.length; i++ ) {
              curCombinition[k] = possibleValues[i];
              fillCombs(k+1);
          }
          curCombinition.pop();
      }
  }
}


/*
usage:

var data = [
{ a: 1, b: 2 },
{ a: 2, b: 3 },
{ a: 2, b: 1 },
{ a: 1, b: 3 },
{ a: 2, b: 2 },
{ a: 1, b: 1 },
];

//way 1
var sortedData = data.sort(orderByProperty('a', 'b'));
//way 2
var sortedData = data.sort(orderByProperty(['a', 'b']));
//way 3 : order by a desc, b
var sortedData = data.sort(orderByProperty('!a', 'b'));
*/
export const orderByProperty = function orderByProperty(prop) {
  var args;
  if( typeof(arguments[0]) == "string" ) {
      args = Array.prototype.slice.call(arguments, 1);
  }else if(typeof(arguments[0]) == "object" && arguments[0] instanceof Array){
      //array
      args = Array.prototype.slice.call(arguments[0], 1);
      prop = arguments[0][0];
  }
  var desc = false;
  if( prop != undefined && prop[0] == '!') {
      desc = true;
      prop = prop.substring(1);
  }
  return function (a, b) {
      if( typeof (a[prop]) == "number" ) {
          var equality = a[prop] - b[prop];
          if( desc ) {
              equality = -equality;
          }
          if (equality === 0 && args.length > 0) {
              return orderByProperty.apply(null, args)(a, b);
          }
          return equality;
      }else if( typeof(a[prop]) == "string") {
          var equality = a[prop] > b[prop]?1: (a[prop] < b[prop]?-1:0);
          if( desc ) {
              equality = -equality;
          }
          if (equality === 0 && args.length > 0) {
              return orderByProperty.apply(null, args)(a, b);
          }
          return equality;
      }
  };
}


export const splitTable = function splitTable (params) {
  var source = params.source
  var splitByCols = []
  if (typeof (params.splitByCol) === 'string') {
    splitByCols.push(params.splitByCol)
  } else {
    splitByCols = params.splitByCol
  }
  var tableList = []
  var m = {}
  _.each(source.data, function (d) {
    var c = _.map(splitByCols, (splitByCol) => {
      return d[splitByCol]
    }).join('_')
    if (m[c] === undefined) {
      m[c] = []
    }
    m[c].push(d)
  })
  // debugger;
  Object.keys(m).forEach(k => {
    tableList.push({
      key: k,
      data: m[k],
      cols: source.cols
    })
  })
  tableList = tableList.sort(orderByProperty('key'))
  return tableList
}

global.drawTableList = function drawTableList (params) {
  var source = params.source
  var splitByCols
  if (typeof (params.splitByCol) === 'string' ) {
    splitByCols = [params.splitByCol]
  } else if (typeof (params.splitByCol) === 'object' && params.splitByCol instanceof Array) {
    splitByCols = params.splitByCol
  }

  _.each(source, function (tbl) {
    drawTable({
      title: params.title + ' 【' + splitByCols.join(' , ') + '】 = 【' + _.map(splitByCols, function (c) { return tbl.data[0][c] }).join(' , ') + '】',
      source: tbl,
      '$target': params['$target'],
      renderMap: params.renderMap,
      renderHeaderMap: params.renderHeaderMap,
      headerMap: params.headerMap,
      widthMap: params.widthMap,
      simple: params.simple
    })
  })
}

global.drawChartList = function drawTableList (params) {
  var source = params.source
  var splitByCols
  if (typeof (params.splitByCol) === 'string') {
    splitByCols = [params.splitByCol]
  } else if (typeof (params.splitByCol) === 'object' && params.splitByCol instanceof Array ) {
    splitByCols = params.splitByCol
  }
  _.each(source, function (tbl) {
    drawChart({
      title: params.title + ' 【' + splitByCols.join(' , ') + '】 = 【' + _.map(splitByCols, function (c) { return tbl.data[0][c] }).join(' , ') + '】',
      source: tbl,
      '$target': params['$target'],
      chartType: params.chartType,
      x: params.x,
      y: params.y,
      yList: params.yList,
      headerMap: params.headerMap
    })
  })
}

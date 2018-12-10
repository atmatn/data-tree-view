export const getSingleV2 = ({ url, type, body }) => {
  let j = JSON.parse(body)
  if (j.id === '123') {
    return {
      'id': 3095,
      'title': '网站每日PV',
      'author': 'bob',
      'body': `
      /*
      ARGS (
        "查询的日期范围" DATE_RANGE -> day
      )
      */

      var sql =
          _.template(
            "select day, count(*) pv from dso.analyzer2_web" +
            " where day between '<%= day.fromDate%>'" +
            " and '<%= day.toDate%>' group by day;"
          ,args);

      function callback(data){
          var A = {
            data: data[0],
            cols: ["day", "pv"]
          };

          drawTable({
            source: A,
            title: "PV for demo_gaocheng",
            "$target": $disp,
            simple: true
          });

          drawChart({
            source: A,
            title: "PV for demo_gaocheng",
            x: "day",
            yList: ["pv"],
            "$target": $disp
          });
      }

      get_presto(sql, callback);
      `,
      argDefs: [{
        'mode': 'NORMAL',
        'prompt': '查询的日期范围',
        'help': '',
        'type': 'DATE_RANGE',
        'id': 'day',
        'meta': null,
        'width': '95%',
        'optional': false
      }]
    }
  } else {
    return {
      'id': 2771,
      'title': 'test_args',
      'author': 'mary',
      'body': `
      /*
      ARGS (
        # "header here"
        "info here"
        "日期范围"  DATE_RANGE (day)
        "日期范围(默认10天)"  DATE_RANGE DEFAULT_LENGTH(10) (dayWithDefaultLength)
        "ldap" STRING (_ldap)

        "操作列表" ["你的操作"] LIST (action)
        "整数列表" INT_LIST ( aList )

        "平台类型" [ "你的平台" ]STRING -> plat
        LINE (
        "课程类别1" CHOICE { "高中" "初中" } -> courseCat1
        "课程类别2" CHOICE { "高中" "初中" } ( courseCat2 )
        )
        LINE WIDTH 3 (
        "课程类别1 OPT" CHOICE OPTIONAL { "高中" "初中" } -> courseCat1Opt
        "课程类别2 OPT" CHOICE OPTIONAL { "高中" "初中" } ( courseCat2Opt )
        "是否显示详情" ["是否显示详情"] BOOL -> showDetail
        "用户名" STRING -> username
        "操作列表" LIST -> actionList
        "课程id列表" INT_LIST -> courseIdList
        )
        "课程类别" CHOICE {"高中" "初中"} -> courseCat
        "课程类别(多选)" MULTI_CHOICE {"高中" "初中" "小学"} ( courseCatMulti )
        "Topic" CHOICE url("/zk/kafka") -> topic
        "你的名字(带提示)" STRING {"lisn","Jack"} (yourName)

        LAYOUT (
          MAIN_TABLE
          L0
          L1(1) | R1(1)
          L2(1) | R2(3)
        )
      )
      */


      var dataArr = [];
      _.each(["day", "dayWithDefaultLength","_ldap", "action", "aList",
      "plat","courseCat1","courseCat2","courseCat1Opt","courseCat2Opt","showDetail",
      "username", "actionList","courseIdList", "courseCat", "courseCatMulti",
      "topic","yourName"], function(x){
        dataArr.push({
          label: x,
          val: args[x],
          obj: args[x+"_obj"]
        })
      });

        drawTable({
          source: {
            data: dataArr,
            cols: ["label","val", "obj"]
          },
          title: "ARGS variables",
          "$target": layouts.MAIN_TABLE
        });



      function drawAt(place){
        drawTable({
          source: {
            data: [{"label": "a", val: "b", obj: "c"}],
            cols: ["label","val", "obj"]
          },
          title: "TABLE for " + place,
          "$target": layouts[place]
        });
      }

      drawAt('L0');
      drawAt('L1');
      drawAt('R1');
      drawAt('L2');
      drawAt('R2');
      `,
      argDefs: [{
        'mode': null,
        'prompt': 'header here',
        'help': null,
        'type': 'HEADING',
        'id': null,
        'meta': '{\'level\':1}',
        'width': '95%',
        'optional': false
      }, {
        'mode': null,
        'prompt': 'info here',
        'help': null,
        'type': 'INFO',
        'id': null,
        'meta': null,
        'width': '95%',
        'optional': false
      }, {
        'mode': 'SQL',
        'prompt': '日期范围',
        'help': "",
        'type': 'DATE_RANGE',
        'id': 'day',
        'meta': null,
        'width': '95%',
        'optional': false
      }, {
        'mode': 'SQL',
        'prompt': '日期范围(默认10天)',
        'help': '',
        'type': 'DATE_RANGE',
        'id': 'dayWithDefaultLength',
        'meta': "{\"val\":10,\"type\":\"default_length\"}",
        'width': '95%',
        'optional': false
      }, {
        'mode': 'SQL',
        'prompt': 'ldap',
        'help': '',
        'type': 'STRING',
        'id': '_ldap',
        'meta': null,
        'width': '95%',
        'optional': false
      }, {
        'mode': 'SQL',
        'prompt': '操作列表',
        'help': '你的操作',
        'type': 'LIST',
        'id': 'action',
        'meta': null,
        'width': '95%',
        'optional': false
      }, {
        'mode': 'SQL',
        'prompt': '整数列表',
        'help': "",
        'type': 'INT_LIST',
        'id': 'aList',
        'meta': null,
        'width': '95%',
        'optional': false
      }, {
        'mode': 'NORMAL',
        'prompt': '平台类型',
        'help': '你的平台',
        'type': 'STRING',
        'id': 'plat',
        'meta': null,
        'width': '95%',
        'optional': false
      }, {
        'mode': 'NORMAL',
        'prompt': '课程类别1',
        'help': "",
        'type': 'CHOICE',
        'id': 'courseCat1',
        'meta': "{\"val\":[\"高中\",\"初中\"],\"type\":\"listed\"}",
        'width': '47%',
        'optional': false
      }, {
        'mode': 'SQL',
        'prompt': '课程类别2',
        'help': "",
        'type': 'CHOICE',
        'id': 'courseCat2',
        'meta': "{\"val\":[\"高中\",\"初中\"],\"type\":\"listed\"}",
        'width': '47%',
        'optional': false
      }, {
        'mode': 'NORMAL',
        'prompt': '课程类别1 OPT',
        'help': "",
        'type': 'CHOICE',
        'id': 'courseCat1Opt',
        'meta': "{\"val\":[\"高中\",\"初中\"],\"type\":\"listed\"}",
        'width': '31%',
        'optional': true
      }, {
        'mode': 'SQL',
        'prompt': '课程类别2 OPT',
        'help': "",
        'type': 'CHOICE',
        'id': 'courseCat2Opt',
        'meta': "{\"val\":[\"高中\",\"初中\"],\"type\":\"listed\"}",
        'width': '31%',
        'optional': true
      }, {
        'mode': 'NORMAL',
        'prompt': '是否显示详情',
        'help': '是否显示详情',
        'type': 'BOOL',
        'id': 'showDetail',
        'meta': null,
        'width': '31%',
        'optional': false
      }, {
        'mode': 'NORMAL',
        'prompt': '用户名',
        'help': "",
        'type': 'STRING',
        'id': 'username',
        'meta': null,
        'width': '31%',
        'optional': false
      }, {
        'mode': 'NORMAL',
        'prompt': '操作列表',
        'help': "",
        'type': 'LIST',
        'id': 'actionList',
        'meta': null,
        'width': '31%',
        'optional': false
      }, {
        'mode': 'NORMAL',
        'prompt': '课程id列表',
        'help': "",
        'type': 'INT_LIST',
        'id': 'courseIdList',
        'meta': null,
        'width': '31%',
        'optional': false
      }, {
        'mode': 'NORMAL',
        'prompt': '课程类别',
        'help': "",
        'type': 'CHOICE',
        'id': 'courseCat',
        'meta': "{\"val\":[\"高中\",\"初中\"],\"type\":\"listed\"}",
        'width': '95%',
        'optional': false
      }, {
        'mode': 'SQL',
        'prompt': '课程类别(多选)',
        'help': "",
        'type': 'MULTI_CHOICE',
        'id': 'courseCatMulti',
        'meta': "{\"val\":[\"高中\",\"初中\",\"小学\"],\"type\":\"listed\"}",
        'width': '95%',
        'optional': false
      }, {
        'mode': 'NORMAL',
        'prompt': 'Topic',
        'help': "",
        'type': 'CHOICE',
        'id': 'topic',
        'meta': "{\"val\":\"/zk/kafka\",\"type\":\"url\"}",
        'width': '95%',
        'optional': false
      }, {
        'mode': 'SQL',
        'prompt': '你的名字(带提示)',
        'help': "",
        'type': 'STRING',
        'id': 'yourName',
        'meta': "{\"val\":[\"lisn\",\"Jack\"],\"type\":\"listed\"}",
        'width': '95%',
        'optional': false
      }, {
        'mode': null,
        'prompt': null,
        'help': null,
        'type': 'LAYOUT',
        'id': null,
        'meta': "[[{\"name\":\"MAIN_TABLE\",\"width\":1}],[{\"name\":\"L0\",\"width\":1}],[{\"name\":\"L1\",\"width\":1},{\"name\":\"R1\",\"width\":1}],[{\"name\":\"L2\",\"width\":1},{\"name\":\"R2\",\"width\":3}]]",
        'width': '95%',
        'optional': false
      }]
    }
  }
}

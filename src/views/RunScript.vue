<template>
  <div>
    <div class="extra">
    <Input type="textarea" :rows="20" :value="JSON.stringify(argDefs,null,4)"/>
    </div>
    <div class="title-line">
    <span class="script-title">{{scriptTitle}}</span> <span class="script-author">（作者：{{author}}）</span>
    </div>
    <br>
    <!-- <Button @click="changeParam">Change Param</Button> -->
    <ArgsScriptParams v-bind:argDefs="argDefs"></ArgsScriptParams>
    <Button @click="doRun">获取数据</Button>
    <div v-if="showProgress">
      执行进度 {{ runState.completed }} / {{ runState.submitted }}
    </div>
    <div ref="content"></div>
    <PrestoProgress></PrestoProgress>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { objEqual } from "../lib/tools";
import axios from "axios";
import ArgsScriptParams from "_c/args/ArgsScriptParams.vue";
import { toIntDay, yesterdayDateStr } from "@/lib/date-extension.js";
import $ from "jquery"
import _ from '@/lib/myunderscore.js'
import underscore from '@/lib/myunderscore.js'
import * as customScriptApi from '@/lib/custom-script'
import * as dateApi from '@/lib/date-extension'
import { startRun, currentRunState, wrapScript } from '@/lib/custom-script'
import PrestoProgress from "_c/PrestoProgress.vue"
import { toPercent, limitFraction, autoFormat} from "@/lib/format"
import momentRef from "moment"
import {
  getListFromMeta,
  getStringFromMeta,
  getDefaultLengthFromMeta
} from "@/lib/util.js";

export default {
  components: {
    ArgsScriptParams,
    PrestoProgress
  },
  data: function() {
    // debugger
    return {
      myScriptId: "",
      myParams: {},
      argDefs: [],
      scriptBody: "",
      scriptTitle: "",
      author: "",
      showProgress: false,
      runState: {}
    };
    // return {
    //     myScriptId: this.$store.state.currentScriptId,
    //     myParams: JSON.parse(JSON.stringify(this.$store.state.currentScriptParams))
    // }
  },
  mounted: function() {
    this.reload();
    setInterval( () => {
      // debugger
      var runState = currentRunState()
      console.log(`runState submitted = ${runState.submitted}`)
      if( runState.submitted > 0 ) {
        if (runState.completed < runState.submitted) {
          this.showProgress = true
          this.runState = runState
        } else {
          this.showProgress = false
          this.runState = {}
        }
      }
    }, 1000)
  },
  props: {
    scriptId: String,
    params: Object
  },
  beforeRouteEnter(to, from, next) {
    // debugger
    //不能用this, 可以 next ( vm => {  vm是组件实例})
    // next( vm => {
    //   vm.myParams = JSON.parse(JSON.stringify(to.query))
    // })
    next();
  },
  beforeRouteLeave(to, from, next) {
    // debugger
    // next(false)
  },
  computed: {
    ...mapState(["currentScriptId", "currentScriptParams"])
  },
  watch: {
    currentScriptId(val, oldVal) {
      //current script id changed
      console.log("current script id from " + oldVal + " to " + val);
      // console.log(this.$route)

      this.reload();
    },
    currentScriptParams(val, oldVal) {
      // debugger
      //current script params changed
      console.log("current script params from " + oldVal + " to " + val);
      var equalToSavedParams = objEqual(val, this.myParams);
      if (!equalToSavedParams) {
        this.reload();
      }
    }
  },
  methods: {
    ...mapActions(["updateScriptParams"]),
    changeParam() {
      var x = Math.random();
      // 更新组件内参数
      this.myParams.param_a = x;
    },
    prepareForRun() {
      var argDefs = this.argDefs
      var userParams = this.myParams
      var $disp = $(this.$refs.content)
      var args = {};
      var layouts = {};
      // var debugging = true;
      for(var i=0; i<argDefs.length; i++) {
          var argDef = argDefs[i];
          var dataPropName;
          if( argDef.mode == "NORMAL") {
              dataPropName = argDef.id
          }else{
              dataPropName = argDef.id + "_obj";
          }
          if( argDef.type == 'DATE_RANGE' ) {
              var d = userParams[argDef.id];
              var m = d.match(/^(.*)to(.*)$/);
              if( m != null ) {
                  if( argDef.mode == "SQL") {
                      var sqlData = _.template("<%= col%> between '<%=fromDate%>' and '<%=toDate%>'",
                          {
                              col: argDef.id,
                              fromDate: m[1],
                              toDate: m[2]
                          });
                      args[argDef.id] = sqlData;
                  }

                  args[dataPropName] = {
                      fromDate: m[1],
                      toDate: m[2]
                  }
              }
          }else if( argDef.type == 'STRING' || argDef.type == 'CHOICE') {
              var d = userParams[argDef.id];
              if( argDef.mode == "SQL") {
                  if( d !== '') {
                      //非空
                      var sqlData = _.template("<%= col%> = '<%=d%>'",
                          {
                              col: argDef.id,
                              d: d
                          });
                  }else{
                      //空，表示不做限制
                      var sqlData = "1 = 1";
                  }
                  args[argDef.id] = sqlData;
              }
              args[dataPropName] = d;
          }else if( argDef.type == 'BOOL') {
              var d = userParams[argDef.id];
              if( argDef.mode == "SQL") {
                  if( d !== '') {
                      //非空
                      if( d === "true") {
                          var sqlData = _.template("<%= col%> ",
                              {
                                  col: argDef.id
                              });
                      }else{
                          var sqlData = _.template("not <%= col%> ",
                              {
                                  col: argDef.id
                              });
                      }
                  }else{
                      //空，表示不做限制
                      var sqlData = "1 = 1";
                  }
                  args[argDef.id] = sqlData;
              }
              args[dataPropName] = d;

          }else if( argDef.type == 'LIST' || argDef.type == 'INT_LIST' || argDef.type== 'MULTI_CHOICE') {
              var d = userParams[argDef.id];
              if( argDef.mode == "SQL") {
                  if( d !== '') {
                      //非空
                      var sqlData = _.template("<%= col%> in ( <%=dList.join(',')%> )",
                          {
                              col: argDef.id,
                              dList: _.map(d.split(","), function (x) {
                                  if( argDef.type == 'INT_LIST' ) {
                                      return "" + x;
                                  }else{
                                      return "'"+x+"'";
                                  }
                              })
                          });
                  }else{
                      //空，表示不做限制
                      var sqlData = "1 = 1";
                  }
                  args[argDef.id] = sqlData;
              }

              if( d !== '') {
                  if (argDef.type == 'INT_LIST') {
                      args[dataPropName] = _.map(d.split(","), function (x) {
                          return parseInt(x)
                      });
                  } else {
                      args[dataPropName] = d.split(",");
                  }
              }else{
                  args[dataPropName] = [];
              }
          }else if (argDef.type == 'LAYOUT' ) {
              var layoutLines = JSON.parse(argDef.meta);
              var $layoutPart = $("<div>").css({
                  // borderStyle: "solid"
              });
              _.each(layoutLines, function(layoutLine){
                  var $layoutLine = $("<p>");
                  var widthTotal = 0;
                  _.each(layoutLine, function(layoutItem){
                      widthTotal += layoutItem.width;
                  });
                  _.each(layoutLine, function(layoutItem)  {
                      var $layoutItem = $("<span>").css({
                          display: 'inline-block',
                          padding: "2px",
                          width: parseInt(100.0 / widthTotal * layoutItem.width) + '%'
                      });
                      $layoutLine.append($layoutItem);

                      //for debug
                      // if( debugging ) {
                      //     $layoutItem.append($("span").text(layoutItem.name));
                      // }
                      layouts[layoutItem.name] = $layoutItem;
                  });
                  $layoutPart.append($layoutLine);
              });
              $disp.append($layoutPart);
          }
      }
      return {
        args,
        layouts
      }
    },
    doRun() {
      // 将界面上的参数读出来
      let _ = underscore
      var params = {}
      var argDefs = this.argDefs
      for(var i=0; i<argDefs.length; i++) {
          var arg = argDefs[i];
          if( arg.type == 'DATE_RANGE' ) {
                params[arg.id] =
                      arg.val.fromDate
                      + "to" + arg.val.toDate;
          }else if( arg.type == "STRING") {
              params[arg.id] = arg.val || '';
          }else if( arg.type == "LIST" ||
              arg.type == "INT_LIST") {
              params[arg.id] =
                  _.map(arg.val, function(x){return x.trim(); } ).join(",");
          }else if( arg.type == "CHOICE") {
              params[arg.id] = arg.val || '';
          }else if( arg.type == "MULTI_CHOICE") {
              params[arg.id] = arg.val.join(",");
          }else if( arg.type == "BOOL") {
              // var val = arg.$elem.is(':checked');
              params[arg.id] = arg.val;
          }
      }

      this.myParams = params

      // 更新URL
      this.updateScriptParams({
        params: {
          ...this.myParams
        }
      });

      // 这里处理args和layout
      // debugger

      let {
            drawTable,
            drawChart,
            get_presto,
            get_hive,
            get_pgsql,
            collapseTable,
            orderByProperty,
            appendBase,
            appendSum,
            runJs,
            set_snippet
              } = customScriptApi
      let { args, layouts } = this.prepareForRun()
      let { dateFormat } = dateApi
      let moment = momentRef
      let lib = {
        format: {
          toPercent: toPercent,
          limitFraction: limitFraction,
          autoFormat: autoFormat
        }
      }
      let $disp = $(this.$refs.content)

      startRun()
      eval(wrapScript(this.scriptBody, params, this.myScriptId))


      // 假设下面的是结果
      // this.$refs.content.innerText = "结果:" + this.myParams.param_a;
    },
    initializeArgDefs({ argDefs, userParams }) {
      for (var i = 0; i < argDefs.length; i++) {
        var arg = argDefs[i];

        if (arg.type == "HEADING") {
          //pass
        } else if (arg.type == "INFO") {
          //pass
        } else {
          //pass
        }
        if (arg.type == "DATE_RANGE") {
          var param = userParams[arg.id];
          if (param == undefined || param == "") {
            var defaultLength = getDefaultLengthFromMeta(arg.meta, 4);
            arg.val = {
              fromDate: Date.nextDateStr(
                Date.yesterdayDateStr(),
                -(defaultLength - 1)
              ),
              toDate: Date.yesterdayDateStr()
            };
            // console.log("arg.val=" + JSON.stringify(arg.val));
          } else {
            var m = param.match("^(.*)to(.*)$");
            if (m != null) {
              arg.val = {
                fromDate: m[1],
                toDate: m[2]
              };
            }
          }
        } else if (arg.type == "STRING") {
          var param = userParams[arg.id];
          if (param !== undefined) {
            arg.val = param;
          }
        } else if (arg.type == "LIST" || arg.type == "INT_LIST") {
          // if( arg.mode == 'SQL' ) {
          //     $("<span>（每行一个值，两端的空格会自动去除；不填表示不做限制）</span>").appendTo($elem);
          // }else{
          //     $("<span>（每行一个值，两端的空格会自动去除）</span>").appendTo($elem);
          // }
          // var $txt = $("<textarea>").css("height","6em").appendTo($elem);
          var param = userParams[arg.id];
          if (param !== undefined) {
            // $txt.val( param.split(",").join("\n") );
            arg.val = param == "" ? [] : param.split(",");
          } else {
            arg.val = [];
          }
          // arg.$elem = $txt;
        } else if (arg.type == "CHOICE") {
          var param = userParams[arg.id];
          var vals = getListFromMeta(arg.meta);
          var setToDefault = false;
          if (param !== undefined) {
            if (_.contains(vals, param)) {
              arg.val = param;
            } else {
              //设置为空其实也有问题，改为设置为默认值
              if (!arg.optional) {
                setToDefault = true;
                argsVue.$Message.warning({
                  content: "参数" + arg.id + "非法，将为您设为默认值。",
                  duration: 5
                });
              }
            }
          } else {
            if (!arg.optional) {
              setToDefault = true;
            }
          }
          if (setToDefault) {
            //默认值
            if (vals && vals.length > 0) {
              arg.val = vals[0];
            } else {
              argsVue.$Message.warning({
                content: "参数" + arg.id + "没有可选项！您可能缺少权限！",
                duration: 5
              });
              arg.val = "";
            }
          }
        } else if (arg.type == "MULTI_CHOICE") {
          var param = userParams[arg.id];
          if (param !== undefined) {
            var vals = param.split(",");
            arg.val = _.intersection(vals, getListFromMeta(arg.meta));
          } else {
            arg.val = [];
          }
        } else if (arg.type == "BOOL") {
          // var $sel = $("<input>").attr('type','checkbox').appendTo($elem);
          var param = userParams[arg.id];
          if (param !== undefined) {
            if (param === "true" || param === true) {
              // $sel.attr('checked', 'checked');
              arg.val = true;
            } else {
              arg.val = false;
            }
          } else {
            arg.val = false;
          }
          // arg.$elem = $sel;
        }
      }
    },
    reload: function() {
      this.myParams = JSON.parse(JSON.stringify(this.currentScriptParams));
      this.myScriptId = this.currentScriptId;
      // 清空结果
      this.$refs.content.innerHTML = "";
      if (this.myScriptId === "") {
        return;
      }
      // 读取script
      axios
        .request({
          url: "/api/args-script/single",
          method: "GET",
          params: {
            id: this.currentScriptId
          }
        })
        .then(res => {
          let argDefs = res.data.argDefs;
          argDefs.forEach(x => (x.val = null));
          this.initializeArgDefs({ argDefs, userParams: this.myParams });
          this.argDefs = argDefs;
          this.scriptBody = res.data.body;
          this.scriptTitle = res.data.title;
          this.author = res.data.author;
        });
    }
  }
};
</script>

<style lang="less">
.echarts {
  margin-left: 20px;
}
#dataSelector h3 {
  margin-left: 300px;
}
p * {
  vertical-align: top;
}
</style>
<style scoped lang="less">
.title-line {

}
.script-title {
  color: blue;
  font-size: 32px;
}

</style>


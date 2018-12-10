<template>
  <div>
    <Input type="textarea" :rows="20" :value="JSON.stringify(argDefs,null,4)"/>
    <div class="title-line">
    <span class="script-title">{{scriptTitle}}</span> <span class="script-author">（作者：{{author}}）</span>
    </div>
    <br>
    <!-- <Button @click="changeParam">Change Param</Button> -->
    <ArgsScriptParams v-bind:argDefs="argDefs"></ArgsScriptParams>
    <Button @click="doRun">获取数据</Button>
    <div ref="content"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { objEqual } from "../lib/tools";
import axios from "axios";
import ArgsScriptParams from "_c/args/ArgsScriptParams.vue";
import { toIntDay, yesterdayDateStr } from "@/lib/date-extension.js";
import $ from "jquery";
import {
  getListFromMeta,
  getStringFromMeta,
  getDefaultLengthFromMeta
} from "@/lib/util.js";

export default {
  components: {
    ArgsScriptParams
  },
  data: function() {
    // debugger
    return {
      myScriptId: "",
      myParams: {},
      argDefs: [],
      scriptBody: "",
      scriptTitle: "",
      author: ""
    };
    // return {
    //     myScriptId: this.$store.state.currentScriptId,
    //     myParams: JSON.parse(JSON.stringify(this.$store.state.currentScriptParams))
    // }
  },
  mounted: function() {
    this.reload();
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
    doRun() {
      // 将界面上的参数读出来
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

      // 这里执行脚本
      debugger;
      
      // 假设下面的是结果
      this.$refs.content.innerText = "结果:" + this.myParams.param_a;
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
          url: "/api/my-script/single-v2",
          method: "POST",
          data: {
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


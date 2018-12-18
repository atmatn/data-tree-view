<template>
  <div id="prestoStatus">
    <div class="running-presto-query" v-if="show && queryList.length > 0">
      <p>
        <span class="ptitle">Presto查询</span>
        <button @click="closePanel">关闭</button>
      </p>
      <ul>
        <li v-for="q in queryList">
          <a target="_blank" v-bind:href="'/presto/queryDetail/' + q.queryId">{{q.queryId}}</a>
          <a v-if="q.state == 'RUNNING'" @click="killQuery(q.queryId)">
            <Icon type="close-round"></Icon>
          </a>
          <Progress v-bind:status="q.progressStatus" :percent="q.queryStats.progressPercentage"></Progress>
          <span>{{q && q.queryStats && q.queryStats.elapsedTime}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import _ from "@/lib/myunderscore";
import { orderByProperty } from "@/lib/custom-script";
import axios from "axios";

var progressStatusMap = {
  RUNNING: "active",
  FAILED: "wrong",
  FINISHED: "success"
};

export default {
  name: "PrestoProgress",
  data: function() {
    return {
      msg: " mama~ ",
      queryList: [],
      showRecentCompleted: true,
      show: true,
      closeTime: 0
    };
  },
  methods: {
    killQuery: function(queryId) {
      $.ajax({
        url: "/presto/killQuery/" + queryId
      });
    },
    closePanel: function() {
      this.show = false;
      this.closeTime = new Date().getTime();
    }
  },
  mounted: function() {
    console.log("mounted");
    var lastHasRunningQuery = false;
    var lastCheck = 0;
    var pageStartTime = new Date().getTime();
    var nInterval = setInterval(() => {
      var now = new Date().getTime();
      console.log("lastHasRunningQuery=" + lastHasRunningQuery);
      var durationFromLastCheck = now - lastCheck;
      console.log("durationFromLastCheck=" + durationFromLastCheck);
      if (lastHasRunningQuery || durationFromLastCheck > 5000) {
        lastCheck = now;
        axios
          .request({
            url: "/api/presto/my-queries",
            method: "get"
          })
          .then(res => {
            // debugger;
            var d = res.data;
            var k1 = this;
            // var d = JSON.parse(d);
            // prestoStatusPanel.queryList = [];
            var newList = [];
            lastHasRunningQuery = false;
            var allCompleted = true;
            d.forEach(x => {
              var k2 = this;
              // if (x.session.user == window.username) {
              if (true) {
                var createTime = new Date(x.queryStats.createTime).getTime();
                // debugger;
                var c = this.showRecentCompleted && createTime >= pageStartTime;
                var durationFromPageStartTime = createTime - pageStartTime;
                // console.log("queryId=" + x.queryId + " state=" + x.state + " createTime=" + createTime + " pageStartTime=" + pageStartTime  + " durationFromPageStartTime = " + durationFromPageStartTime);
                // var c = true;
                if (
                  c ||
                  (x.state != "FAILED" &&
                    (x.queryStats.progressPercentage == undefined ||
                      x.queryStats.progressPercentage < 100))
                ) {
                  if (x.state == "RUNNING") {
                    lastHasRunningQuery = true;
                  }
                  if (x.state != "FINISHED") {
                    allCompleted = false;
                  }
                  var durationFromLastClose = createTime - this.closeTime;
                  // console.log(x.queryId + " durationFromLastClose=" + durationFromLastClose);
                  //本机跟机房的时间可能有点差异，宽恕10秒
                  if (this.show == false && durationFromLastClose >= -10000) {
                    this.show = true;
                  }
                  x.queryStats.progressPercentage =
                    x.queryStats.progressPercentage == undefined
                      ? 0
                      : Math.round(x.queryStats.progressPercentage);
                  x.createTime = createTime;
                  x.progressStatus = progressStatusMap[x.state];
                  x.durationFromPageStartTime = durationFromPageStartTime;
                  newList.push(x);
                }
              }
            });
            newList.sort(orderByProperty("!createTime"));
            this.queryList = newList;
            // console.log("allCompleted=" + allCompleted);
            if (newList.length > 0 && allCompleted) {
              setTimeout(() => {
                var k3 = this;
                this.closePanel();
              }, 3000);
            }
          });
      }
    }, 1000);
  }
};
</script>

<style scoped lang="less">
.running-presto-query {
  display: inline-block;
  position: fixed;
  width: 18em;
  right: 0;
  bottom: 0;
  overflow: auto;
  max-height: 15em;
  background-color: #bde8e2;
}
.running-presto-query .ptitle {
  font-size: 1.5em;
}
</style>

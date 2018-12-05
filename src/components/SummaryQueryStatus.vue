<template>
    <div
    class="running-query"
    v-if="show && queryList.length > 0">
      <div>
        <span class="ptitle">查询列表</span>
        <button @click="closePanel">关闭</button>
      </div>
      <ul>
        <li class="q-line" v-for="(q, idx) in queryList">
          <a @click="clickQuery(idx)">{{q.queryId}}</a>
          <Progress
            v-bind:status="q.status"
            :percent="q.percent"></Progress>
          <span>
            {{q.elapsed}}
          </span>
        </li>
      </ul>
      <Modal v-model="showQueryDetail">
        <div>查询详情</div>
        <Input type="textarea" :autosize="{minRows: 2,maxRows: 20}" :readonly="true"  v-model="showingQuery"/>
      </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import {limitFraction} from '@/lib/format'
export default {
  name: 'SummaryQueryStatus',
  data: function () {
    return {
      queries: [],
      show: true,
      firstQueryId: '',
      hasRunning: false,
      noRunningTimes: 0,
      showQueryDetail: false,
      showingQuery: ''
    }
  },
  mounted: function () {
    var cb = () => {
      axios.get('/api/summary-query/queries').then(res=> {
        this.queries = res.data
        if( this.queries.length > 0) {
          // 如果最前面的queryId变了，则再次显示
          if( this.firstQueryId !== this.queries[0].queryId ) {
            this.show = true
          }
          this.firstQueryId = this.queries[0].queryId
          this.hasRunning = this.queries.some( x => {
            return x.status === 'running'
          })
          if( !this.hasRunning ) {
            this.noRunningTimes++
          } else {
            this.noRunningTimes = 0
          }
          console.log('hasRunning = ' + this.hasRunning)
        }
      })
      setTimeout (cb, this.hasRunning ? 1000: 5000)
    }

    setTimeout( cb, 5000)
  },
  methods: {
    closePanel: function () {
      this.show = false
    },
    clickQuery: function (idx) {
      this.showingQuery = JSON.stringify(this.queries[idx], null, 4)
      this.showQueryDetail = true
    }
  },
  computed: {
    queryList: function(){
      // debugger
      var retList = this.queries.map( x => {
        var st = undefined
        if(x.status == 'running') {
          st = 'active'
        } else if(x.status == 'error') {
          st = 'wrong'
        } else if(x.status == 'success') {
          st = 'success'
        } else {
          st = 'normal'
        }

        var elapsed
        if( x.elapsedSecs < 60 ) {
          elapsed = `${x.elapsedSecs} 秒`
        } else {
          elapsed =`${limitFraction(x.elapsedSecs / 60)} 分`
        }

        var started = (x.waitingItems + x.completedItems) > 0
        var percent = started ? limitFraction(x.completedItems / (x.waitingItems + x.completedItems) * 100) : 0
        return {
            queryId: x.queryId,
            status: st,
            percent,
            elapsed,
            started
        }
      })
      return retList
    }
  }
}
</script>

<style scoped lang="less">
.running-query {
	display: inline-block;
	position: fixed;
	width: 18em;
	right: 0;
	bottom: 0;
	overflow: auto;
	max-height: 15em;
	background-color: #bde8e2;
}


.running-query .ptitle{
	font-size: 1.5em;
}

</style>

<style lang="less">
.running-query .ivu-progress-outer {
  width: 90%;
}
</style>

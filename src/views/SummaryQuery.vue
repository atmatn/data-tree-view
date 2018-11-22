<template>
  <div>
    <!--Button @click="debug">Debug</Button-->
    <h1 class="h1">聚合查询工具</h1>
    <p>
      <div class="h">数据源</div>
      <Select filterable @on-change="onChangeDataSource" v-model="dataSource" style="width:400px">
            <Option v-for="item in dataSourceList"
            :value="item.value"
            :key="item.value">{{ item.value }}
            </Option>
      </Select>
    </p>
    <div v-if="dataSource != ''">
      <p>
        <div class="h">日期</div><DatePicker v-model="daterange" type="daterange" placeholder="Select date" style="width: 400px"></DatePicker>
      </p>
      <p>
        <div class="h">过滤条件</div>
        <p v-if="filters.length == 0">
          无
        </p>
        <p v-if="filters.length > 0">
          <p v-for="(item,idx) in filters">
            <span class="filter-dim">{{item.dim}}</span> : <span v-if="item.operator=='='">{{item.dimVal}}</span>
            <span v-if="item.operator=='like'">包含“{{item.dimVal}}”（忽略大小写）</span>
            <Button @click="filters.splice(idx, 1)" class="btn-del">删除</Button>
          </p>
        </p>
      </p>
      <p>
        <div class="h">参数</div>
        <div><Input v-model="dimNameFilter" placeholder="搜索参数" style="width: 300px"></Input></div>
        <div class="dim-list">
        <span v-if="item.value.indexOf(dimNameFilter.toLowerCase()) >= 0" v-for="item in dimList">
          <a @click="dimClick(item.value)" class="dim-item">{{item.value}}</a>
        </span>
        </div>
      </p>
      <p>
        <Modal v-model="showModalDimVals"
          :title="(curDim + '参数值 （'+ toDateStr + '）')"
          @on-visible-change="clearUpModal">
          <DataSampledWarning :isDataSampled="isDimValsSampled" :dataSampleType="dimValsSampleType" :preciseSql="dimValsPreciseSql" :bigFont="false">

          </DataSampledWarning>
          <Table height="500" :columns="dimValCols" :data="filterdDimValsAggData">

          </Table>
        </Modal>
      </p>
      <div v-if="uidFieldList.length > 0">
        <div class="h">用户标识</div>
        <Select filterable @on-change="onChangeUidField" v-model="uidField" style="width:400px">
            <Option v-for="item in uidFieldList"
            :value="item.value"
            :key="item.value">{{ item.value }}
            </Option>
        </Select>
      </div>
      <p v-if="dateRangeAggData.length > 0">
        <hr/>
        <div class="h agg-result">查询结果</div>
        <DataSampledWarning :isDataSampled="isRangeAggDataSampled" :dataSampleType="aggDataSampleType" :preciseSql="aggDataPreciseSql">

        </DataSampledWarning>
        <!-- <div v-if="isRangeAggDataSampled">
          <Alert type="warning">
            <span v-if="isRangeAggDataSampled" class="warn-sampled">已采样{{aggDataSampleType}}计算
            <Tooltip max-width="400" :transfer="true">
              <Icon type="ios-help-circle-outline" />
              <div slot="content">
                  <p align="center">什么是“采样计算”</p>
                  <p>为了提高查询速度，当前查询使用了 1/N 的用户数据来估算结果。</p>
                  <p>算法：</p>
                  <p>1. 取 1/N 用户的数据，计算出 PV 和 UV。</p>
                  <p>2. 计算结果再乘以 N 作为输出。</p>
              </div>
            </Tooltip>
            <Button class="precise-button"><span class="precise-link" @click="onPreciseLinkClick">我想全量计算当前查询</span></Button>
            </span>
          </Alert>
        </div> -->
        <div ref="dateRangeAggDisp" :class="{'date-range-agg-disp':true,'sampled-data':isRangeAggDataSampled}">

        </div>
        <!--Table :columns="dateRangePvUvCols" :data="dateRangePvUvData">

        </Table-->
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { drawTable, drawChart } from '@/lib/custom-script.js'
import $ from 'jquery'
import { Input, Button } from 'iview'
import DataSampledWarning from '_c/DataSampledWarning.vue'

export default {
  components: {
    DataSampledWarning
  },
  data() {
    var toDate = moment().add(-1, 'days')
    var fromDate = moment().add(-9, 'days')

    return {
      dataSourceList: [],
      dataSource: '',
      uidFieldList: [],
      uidField: '',
      dimNameFilter: '',
      daterange: [fromDate.toDate(), toDate.toDate()],
      dimList: [],
      // dateRangePvUvCols: [
      //    { title: '日期', key: 'day' },
      //    { title: 'UV', key: 'uv' },
      //    { title: 'PV', key: 'pv' }
      // ],
      dimValCols: [
        {
          title: '参数值',
          key: this.curDim,
          width: 300,
          render: (h,params) => {
            return h('span', {
              class: {
                'dim-val-label': true,
                'dim-val-null': params.row[this.curDim] === null
              },
              on: {
                click: () => {
                  console.log('clicked dim val: ' + params.row.dim_val)
                  this.addEqFilterWrapper({
                    dim: this.curDim,
                    dimVal: params.row[this.curDim]
                  })
                }
              },
              domProps: {
                'title': '添加到过滤条件'
              }
            }, params.row[this.curDim] || '(is null)')
          },
          renderHeader: (h, col) => {
            // debugger
            return (
              <span>
              <span>{col.column.title}</span>
              <Input style="width:200px" v-model={this.dimValFilter} placeholder="搜索参数值"></Input>
              {(this.dimValFilter != '' && !this.dimValFilterIsNull)?<Button on-click={this.addLikeFilterWrapper.bind(this, {dim: this.curDim, dimVal: this.dimValFilter})}>将【包含“{this.dimValFilter.toLowerCase()}”（忽略大小写）】<br/>添加到【过滤条件】</Button>:<span></span>}
              </span>

            )
          }
        },
        {title: 'UV', key: 'uv'},
        {title: 'PV', key: 'pv'}
      ],
      filters: [],
      dimValsAggData: [],
      dateRangeAggData: [],
      // dim vals modal
      isDimValsSampled: false,
      dimValsPreciseSql: '',
      dimValsSampleType: '',
      curDim: '',
      showModalDimVals: false,
      dimValFilter: '',
      // date range
      isRangeAggDataSampled: false,
      aggDataSampleType: '',
      aggDataPreciseSql: '',
    }
  },
  computed: {
    basicAggsAndMtrs () {
      var mtrs = ['pv']
      var aggs = [
        {
            name: 'pv',
            type: 'pv'
        }
      ]

      if( this.uidField != null && this.uidField != '' ) {
        aggs.push(
          {
            name: 'uv',
            type: 'uv',
            uidField: this.uidField
          }
        )
        mtrs.push('uv')
      }
      return {
        aggs,
        mtrs
      }
    },
    dimValFilterIsNull: function(){
      // 过滤条件是 is null
      return (this.dimValFilter.length > 0 &&
      this.dimValFilter.match(/^\s*is\s*null\s*$/i) != null)
    },
    filterdDimValsAggData: function(){
      debugger
      if( this.dimValFilter.length > 0 ) {
        // 写了过滤条件
        if (this.dimValFilterIsNull){
          // 只有是 is null，才会显示null
          return this.dimValsAggData.filter( s => s[this.curDim] === null || s[this.curDim] === undefined)
        } else {
          return this.dimValsAggData.filter( s => s[this.curDim] && s[this.curDim].toLowerCase().indexOf(this.dimValFilter.toLowerCase()) >= 0)
        }
      } else {
        return this.dimValsAggData
      }
    },
    fromDateStr: function() {
      return moment(this.daterange[0]).format('YYYY-MM-DD')
    },
    toDateStr: function() {
      return moment(this.daterange[1]).format('YYYY-MM-DD')
    }
  },
  mounted: function() {
    axios.request({
      url: '/api/summary-query/datasources',
      method: 'get'
    }).then( res => {
      // debugger
      // var retList = res.data.dataSources.map( x => ({
      //   value: x
      // }))
      var retList = res.data.dataSources
      this.dataSourceList = retList

      // this.updatePvUvList()
    })

    // 变色功能
    // setInterval( () => {
    //   this.blink = !this.blink
    // }, 500)
  },
  methods: {
    debug () {
      debugger
    },
    onPreciseLinkClick() {
      // this.$Message.info('请在弹出页面中点击“查询”！');
      var prefixMsg = "--请点击“执行”，之后过段时间点击“刷新”看看有没有出结果~\n"
      var encodedeSql = encodeURIComponent(prefixMsg + this.aggDataPreciseSql)
      window.open('http://analyzer2.corp.youdao.com/hive-async-query.html?sql=' + encodedeSql,'_blank');
    },
    clearUpModal(){
      this.dimValFilter = ''
    },
    onChangeDataSource: function(val){
      console.log("datasource changed to: " + val)
      axios.post(
        '/api/summary-query/dims',
        {
          dataSource: val
        }
      ).then( res => {
        // debugger
        var dimList = res.data.dimList
        this.dimList = dimList
        console.log('dim list: ' + JSON.stringify(this.dimList ))
        this.uidFieldList = res.data.uidConf.uidFieldList.map(x=>{
          return {value: x}
        })
        if( this.uidFieldList.length > 0 ) {
          this.uidField = res.data.uidConf.defaultUidField
        } else {
          this.uidField = ''
        }
        this.updatePvUvList()
      })
    },
    onChangeUidField: function(val) {
      console.log("uidField changed to: " + val)
      this.updatePvUvList()
    },
    dimClick: function (dim) {
      console.log('click dim:' + dim);
      this.curDim = dim

      // update: this.dimValData
      axios.post(
        '/api/summary-query/date-range-agg',
        {
          dataSource: this.dataSource,
          groupByList: [dim],
          filters: this.filters,
          dateRange: {
            from: this.toDateStr,
            to: this.toDateStr
          },
          //es6 map spread 语法
          ...this.basicAggsAndMtrs
        }
      ).then( res => {
        // debugger
        console.log(res.data.dateRangeAggData)
        this.isDimValsSampled = res.data.isSampled
        this.dimValsSampleType = res.data.sampleType
        this.dimValsPreciseSql = res.data.preciseSql || ''
        this.dimValsAggData = res.data.dateRangeAggData
        this.showModalDimVals = true
      })
    },
    addEqFilterWrapper: function({dim, dimVal}) {
      this.addEqFilter({dim, dimVal})
      this.showModalDimVals = false
      this.dimNameFilter = ''
    },
    addEqFilter: function({dim, dimVal}) {
      this.filters.push({
        dim: dim,
        dimVal: dimVal,
        operator: '='
      })
    },
    addLikeFilterWrapper: function({dim, dimVal}) {
      this.addLikeFilter({dim, dimVal})
      this.showModalDimVals = false
      this.dimNameFilter = ''
    },
    addLikeFilter: function({dim, dimVal}) {
      this.filters.push({
        dim: dim,
        dimVal: dimVal,
        operator: 'like'
      })
    },
    updatePvUvList() {
      // debugger
      console.log('update agg list')
      if( this.dataSource == '' ) {
        return
      }

      axios.post('/api/summary-query/date-range-agg', {
        dataSource: this.dataSource,
        filters: this.filters,
        dateRange: {
          from: moment(this.daterange[0]).format('YYYY-MM-DD'),
          to: moment(this.daterange[1]).format('YYYY-MM-DD'),
        },
        groupByList: [],
        //es6 map spread 语法
        ...this.basicAggsAndMtrs
      }).then( res => {
        // debugger
        var list = res.data.dateRangeAggData
        this.dateRangeAggData = list.sort( (a,b) => {
          if( a.day > b.day ) return -1
          else if( a.day < b.day ) return 1
          else return 0
        })
        var $disp = $(this.$refs.dateRangeAggDisp)
        $disp.empty()
        // debugger
        drawChart({
          title: '',
          source: {
            //es6 array spread 语法
            cols: ['day', ...this.basicAggsAndMtrs.mtrs],
            data: list
          },
          x: 'day',
          yList: this.basicAggsAndMtrs.mtrs,
          $target: $disp
        })
        drawTable({
          title: '',
          source: {
            //es6 array spread 语法
            cols: ['day', ...this.basicAggsAndMtrs.mtrs],
            data: list
          },
          $target: $disp,
          simple: false
        })
        this.isRangeAggDataSampled = res.data.isSampled
        this.aggDataSampleType = res.data.sampleType
        this.aggDataPreciseSql = res.data.preciseSql || ''
      })
    }
  },
  watch: {
    "filters": function(){
      console.log('filters changed!')
      this.updatePvUvList()
    },
    "daterange": function(){
      console.log('daterange changed!')
      this.updatePvUvList()
    },
    // "dataSource": function(){
    //   console.log('dataSource changed!')
    //   this.updatePvUvList()
    // }
  }
}
</script>

<style scoped lang="less">
  .dim-list {
    display: flex;
    width: 90%;
    flex-wrap: wrap;
  }
  .dim-item {
    margin-right: 5px;
  }
  .filter-dim {
    font-size: 18px;
  }
  .btn-del {
    margin-left: 10px;
  }
  .h {
    font-size: 24px;
    display: inline-block;
    margin-right: 1em;
    // margin-top: 1em;
  }
  .sampled-data {
    // background-color: red;
  }
  .date-range-agg-disp {
    // width: 90%;
  }
  .agg-result {
    text-align: center;
  }
  hr {
    margin-top: 1em;
  }
  // .lighting{
  //   color: red;
  // }
  .precise-link {
    color: black;
    font-size: 24px;
  }
  .precise-button {
    margin-left: 2em;
    margin-top: 1em;
  }
</style>

<style lang="less">
  .charts {
    width: 100%;
    height: 100%;
  }
  .dim-val-label {
    color: red;
  }
  .dim-val-null {
    color: lightgray;
  }
  .dim-val-label:hover{
    cursor: pointer;
  }
  .h2{
    font-size: 24px;
  }
  .h1{
    font-size: 36px;
  }
</style>

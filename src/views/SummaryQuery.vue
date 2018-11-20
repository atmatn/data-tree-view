<template>
  <div>
    <!--Button @click="debug">Debug</Button-->
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
            {{item.dim}} = {{item.dimVal}}
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
          :title="(curDim + '参数值')"
          @on-visible-change="clearUpModal">
          <Table height="500" :columns="dimValCols" :data="filterdDimValsPvUvData">

          </Table>
        </Modal>
      </p>
      <p>
        <div ref="dateRangePvUvDisp">

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
import { Input } from 'iview'

export default {
  components: {
  },
  data() {
    var toDate = moment().add(-1, 'days')
    var fromDate = moment().add(-9, 'days')

    return {
      dataSourceList: [],
      dataSource: '',
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
          key: 'dim_val',
          render: (h,params) => {
            return h('span', {
              class: {
                'dim-val-label': true
              },
              on: {
                click: () => {
                  console.log('clicked dim val: ' + params.row.dim_val)
                  this.addFilter({
                    dim: this.curDim,
                    dimVal: params.row.dim_val
                  })
                  this.showModalDimVals = false
                }
              }
            }, params.row.dim_val)
          },
          renderHeader: (h, col) => {
            // debugger
            return (
              <span><span>{col.column.title}</span>
              <Input style="width:200px" v-model={this.dimValFilter} placeholder="搜索参数值"></Input></span>
            )
          }
        },
        {title: 'UV', key: 'uv'},
        {title: 'PV', key: 'pv'}
      ],
      filters: [],
      dimValsPvUvData: [],
      dateRangePvUvData: [],
      curDim: '',
      showModalDimVals: false,
      dimValFilter: ''
    }
  },
  computed: {
    filterdDimValsPvUvData: function(){
      debugger
      return this.dimValsPvUvData.filter( s => s.dim_val.toLowerCase().indexOf(this.dimValFilter.toLowerCase()) >= 0)
    }
  },
  mounted: function() {
    axios.request({
      url: '/api/summary-query/datasources',
      method: 'get'
    }).then( res => {
      // debugger
      var retList = res.data.dataSources.map( x => ({
        value: x
      }))
      this.dataSourceList = retList

      this.updatePvUvList()
    })
  },
  methods: {
    debug () {
      debugger
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
        var dimList = res.data.dimList.map( x => {return { value: x }})
        this.dimList = dimList
        console.log('dim list: ' + JSON.stringify(this.dimList ))
      })
    },
    dimClick: function (dim) {
      console.log('click dim:' + dim);
      this.curDim = dim
      // update: this.dimValData
      axios.post(
        '/api/summary-query/dim-vals-pv-uv',
        {
          dataSource: this.dataSource,
          curDim: dim,
          filters: this.filters
        }
      ).then( res => {
        // debugger
        console.log(res.data.dimValsPvUvData)
        this.dimValsPvUvData = res.data.dimValsPvUvData
        this.showModalDimVals = true
      })
    },
    addFilter: function({dim, dimVal}) {
      this.filters.push({
        dim: dim,
        dimVal: dimVal,
        operator: '='
      })
      this.dimNameFilter = ''
    },
    updatePvUvList() {
      console.log('update pv uv list')
      if( this.dataSource == '' ) {
        return
      }
      axios.post('/api/summary-query/date-range-pv-uv', {
        dataSource: this.dataSource,
        filters: this.filters,
        dateRange: {
          from: moment(this.daterange[0]).format('YYYY-MM-DD'),
          to: moment(this.daterange[1]).format('YYYY-MM-DD'),
        }
      }).then( res => {
        // debugger
        var list = res.data.dateRangePvUvData
        this.dateRangePvUvData = list
        var $disp = $(this.$refs.dateRangePvUvDisp)
        $disp.empty()
        // debugger
        drawChart({
          title: '概要数据',
          source: {
            cols: ['day','uv','pv'],
            data: list
          },
          x: 'day',
          yList: ['uv','pv'],
          headerMap: {
            'uv': 'UV',
            'pv': 'PV'
          },
          $target: $disp
        })
        drawTable({
          title: '概要数据',
          source: {
            cols: ['day','uv','pv'],
            data: list
          },
          headerMap: {
            'uv': 'UV',
            'pv': 'PV'
          },
          $target: $disp,
          simple: false
        })
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
    "dataSource": function(){
      console.log('dataSource changed!')
      this.updatePvUvList()
    }
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
  .h {
    font-size: 24px;
    display: inline-block;
    margin-right: 1em;
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
  .dim-val-label:hover{
    cursor: pointer;
  }
</style>

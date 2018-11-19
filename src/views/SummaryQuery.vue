<template>
  <div>
    <p>
      数据源：
      <Select @on-change="onChangeDataSource" v-model="dataSource" style="width:400px">
            <Option v-for="item in dataSourceList"
            :value="item.value"
            :key="item.value">{{ item.value }}
            </Option>
      </Select>
    </p>
    <p>
      参数：
      <span v-for="item in dimList">
        <a @click="dimClick(item.value)" class="dim-item">{{item.value}}</a>
      </span>
    </p>
    <p>
      <Modal v-model="showModalDimVals"
        :title="(curDim + '参数值')">
        <Table :columns="dimValCols" :data="dimValsPvUvData">

        </Table>
      </Modal>
    </p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      dataSource: "",
      dataSourceList: [],
      dimList: [],
      dimValCols: [
        {title: '参数值', key: 'value'},
        {title: 'UV', key: 'uv'},
        {title: 'PV', key: 'pv'}
      ],
      filters: [],
      dimValsPvUvData: [],
      curDim: '',
      showModalDimVals: false
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
    })
  },
  methods: {
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
        debugger
        console.log(res.data.dimValsPvUvData)
        this.dimValsPvUvData = res.data.dimValsPvUvData
        this.showModalDimVals = true
      })
    }
  }
}
</script>

<style scoped lang="less">
  .dim-item {
    margin-right: 5px;
  }
</style>

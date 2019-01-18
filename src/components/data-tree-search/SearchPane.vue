<template>
  <div>
    <Row>
      <Col span="5">
        <Button type="primary" :width="60">搜索</Button>
      </Col>
      <Col span="19">
        <Select
          v-model="selectedNodeId"
          style="width:190px"
          @on-change="onChange"
          filterable
          clearable
          :transfer="true"
        >
          <OptionGroup v-for="item in dataTreeSearchList" :value="item.id" :label="item.product.title">
            <Option v-for="itemss in item.items" :value="itemss.id" :label="itemss.title"></Option>
          </OptionGroup>
        </Select>
      </Col>
    </Row>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
// import store from '@/store.js'

export default {
  data() {
    return {
      // onChange: [],
      // val: '',
      arr: [],
      selectedNodeId: ''
    }
  },
  computed: {
    ...mapState({
      // turnOn: 'turnOn',
      // turnLight: 'turnLight',
      dataTreeSearchList: 'dataTreeSearchList',
      indexMap: 'indexMap',
      indexParentMap: 'indexParentMap',
      TreeNodes: 'dataTreeNodes'
    }),
  },
  methods: {
    onChange() {
      //var nodeId = []
      if (
        this.selectedNodeId !== null &&
        this.selectedNodeId !== '' &&
        this.selectedNodeId !== undefined
      ) {
        this.$emit("open-item", {
          nodeId: this.selectedNodeId
        })
      }
    },
    // ...mapActions(['openScript']),
    // ...mapActions(['reloadDataTree'])
  }
}
</script>

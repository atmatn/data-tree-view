<template>
  <div>
    <Row>
      <Col span="4">
        <Button type="primary">搜索</Button>
      </Col>
      <Col span="20">
        <Select
          v-model="selectedNodeId"
          style="width:190px"
          @on-change="onChange"
          filterable
          clearable
          :transfer="true"
          @on-clear="clear"
        >
          <OptionGroup v-for="item in this.arr" :value="item.id" :label="item.product.title">
            <Option v-for="itemss in item.items" :value="itemss.id" :label="itemss.title"></Option>
          </OptionGroup>
        </Select>
      </Col>
    </Row>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
// import store from '@/store.js'

export default {
  data() {
    return {
      // onChange: [],
      // val: '',
      arr: [],
      dataTreeSearchList: this.$store
        .dispatch('getDataTreeSearchList')
        .then(arr => {
          this.arr = arr
        }),
      selectedNodeId: ''
    }
  },
  computed: {
    // ...mapState({
    //   turnOn: 'turnOn'
    // }),
    // ...mapState({
    //   turnLight: 'turnLight'
    // }),
    ...mapState({
      indexMap: 'indexMap'
    }),
    ...mapState({
      indexParentMap: 'indexParentMap'
    }),
    ...mapState({
      TreeNodes: 'dataTreeNodes'
    })
  },
  methods: {
    onChange() {
      var self = this
      console.log('selectedNodeId:' + this.selectedNodeId)
      if (
        this.selectedNodeId !== null &&
        this.selectedNodeId !== '' &&
        this.selectedNodeId !== undefined
      ) {
        this.$store
          .dispatch('getDataTreeAncestorIdList', { id: this.selectedNodeId })
          .then(arr => {
            if (arr.length === 1) {
              this.$store.commit('updateExpandChain', {
                status: [arr[0], this.selectedNodeId]
              })
            } else {
              this.$store.commit('updateExpandChain', { status: arr })
            }
            this.$store.commit('updateCurrentActiveNode', { status: this.selectedNodeId })
            if (this.indexMap[this.selectedNodeId].type === 'args-script') {
              this.openScript({
                scriptId: this.indexMap[this.selectedNodeId].scriptId,
                params: this.indexMap[this.selectedNodeId].scriptParams
              })
            }
            if (this.indexMap[this.selectedNodeId].type === 'direct-link') {
              window.open(this.indexMap[this.selectedNodeId].linkUrl)
            }
            this.$nextTick(() => {
              //debugger
              console.log(
                document.getElementsByClassName(
                  'ivu-menu-item ivu-menu-item-active ivu-menu-item-selected'
                )
              )
              var myElement = document.getElementsByClassName(
                'ivu-menu-item-selected'
              )[0]
              var parentElement = document.getElementsByClassName('my-menu')[0]
              debugger

              var findOffsetTop = function(el) {
                var offset = el.offsetTop
                if (el !== parentElement) {
                  offset += findOffsetTop(el.parentNode)
                }
                return offset
              }
              var topPos = findOffsetTop(myElement)
              console.log(topPos)
              parentElement.scrollTop = topPos;
            })
          })
      }
    },
    ...mapActions(['openScript']),
    ...mapActions(['reloadDataTree']),
    clear() {
      // this.reloadDataTree()
    }
  }
}
</script>

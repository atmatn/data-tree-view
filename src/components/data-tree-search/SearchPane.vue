<template>
  <div>
    <Row>
      <Col span="4">
        <Button type="primary">搜索</Button>
      </Col>
      <Col span="20">
        <Select
          v-model="bySelected"
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
// import store from '@/store.js'

export default {
  data() {
    return {
      // onChange: [],
      // val: '',
      arr: [],
      bySelected: ''
    }
  },
  computed: {
    ...mapState({
      turnOn: 'turnOn',
      turnLight: 'turnLight',
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
        this.bySelected !== null &&
        this.bySelected !== '' &&
        this.bySelected !== undefined
      ) {
        this.$store
          .dispatch('getDataTreeAncestorIdList', { id: this.bySelected })
          .then(arr => {
            if (arr.length === 1) {
              this.$store.commit('updateTurnOn', {
                status: [arr[0],this.bySelected]
              })
            } else {
              this.$store.commit('updateTurnOn', { status: arr })
            }
            this.$store.commit('updateTurnLight', { status: this.bySelected })
            if (this.indexMap[this.bySelected].type === 'args-script') {
              this.openScript({
                scriptId: this.indexMap[this.bySelected].scriptId,
                params: this.indexMap[this.bySelected].scriptParams
              })
            }
            if (this.indexMap[this.bySelected].type === 'direct-link') {
              window.open(this.indexMap[this.bySelected].linkUrl)
            }
            // var index = this.TreeNodes.indexOf(this.indexMap[arr[0]])
            // if (arr.length > 1) {
            //   var indexs = this.TreeNodes[index].children.indexOf(
            //     this.indexMap[arr[1]]
            //   )
            //   var temp = this.TreeNodes[index].children[0]
            //   this.TreeNodes[index].children[0] = this.TreeNodes[index].children[indexs]
            //   this.TreeNodes[index].children[indexs] = temp
            // }
            // var temp = this.TreeNodes[0]
            // this.TreeNodes[0] = this.TreeNodes[index]
            // this.TreeNodes[index] = temp
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
    ...mapActions(['reloadDataTree'])
  }
}
</script>

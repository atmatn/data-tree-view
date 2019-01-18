<template>
  <div>
    <Row>
      <Col span="5">
        <Button type="primary" :width="60">搜索</Button>
      </Col>
      <Col span="19">
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

              var findOffsetTop = function(el, containerElement) {
                let offset = 0
                let no = 1
                while (el.offsetParent === null ) {
                  el = el.parentNode
                }
                while (el !== containerElement.offsetParent) {
                  console.log(`no ${no} offsetTop ${el.offsetTop} offsetParent ${el.offsetParent}`)
                  offset += el.offsetTop
                  el = el.offsetParent
                  no++
                }
                return offset
              }
              var topPos = findOffsetTop(myElement, parentElement)
              console.log(topPos)

              if( parentElement.scrollHeight - topPos < 100) {
                // 如果是在底部，那尽可能往下再滚滚
                topPos += 100
              } else {
                // 上面留一些空间
                topPos = topPos - 300
              }
              // UI不知道为何还没更新，如果项目处于最底部，会没展示出来。
              // 先加个timeout来workaround
              setTimeout( () => {
                parentElement.scrollTop = topPos;
              }, 300)
            })
          })
      }
    },
    ...mapActions(['openScript']),
    ...mapActions(['reloadDataTree'])
  }
}
</script>

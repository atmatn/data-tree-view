<template>
  <div>
    <div>
      <SearchPane @open-item="openItem"/>
    </div>
    <Menu
      :style="{overflow: 'auto', height: '80vh'}"
      :class="{'my-menu': true}"
      theme="dark"
      :active-name="currentSelectedNodeId"
      :open-names="expandIdChain"
      ref="side_menu"
    >
      <div v-if="dataTreeNodes">
        <MySubMenu v-for="item in dataTreeNodes" :model="item" :class="{ parent: true, 'active-menu-item': (item.id === currentSelectedNodeId)}" :currentSelectedNodeId="currentSelectedNodeId"></MySubMenu>
      </div>
      <div v-else>
        <h1 style="color:red">暂无数据
          <br>请联系管理员！
        </h1>
      </div>
    </Menu>
    <ShowNoPermsSwitch></ShowNoPermsSwitch>
    <!--转换开关-->
  </div>
</template>

<script>
import MySubMenu from '@/components/data-tree-menu/MySubMenu.vue'
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import ShowNoPermsSwitch from './ShowNoPermsSwitch.vue'
import SearchPane from '@/components/data-tree-search/SearchPane.vue'
export default {
  data() {
    return {
      expandIdChain: [],
      currentSelectedNodeId: '',
      onChangeStatus: [],
      flagForSelect: false
    }
  },
  created() {
    // console.log('23333333333333:' + this.$router.history.current.query.scriptId)
    // this.$store.commit('updateExpandChain', { status: [1, 5] })
    // this.$store.commit('updateCurrentActiveNode', { status: 8 })
  },
  components: { MySubMenu, SearchPane, ShowNoPermsSwitch },
  computed: {
    ...mapState({
      dataTreeNodes: 'dataTreeNodes'
    }),
    ...mapState({
      indexMap: 'indexMap'
    }),
    ...mapState({
      whichAnchor: 'whichAnchor'
    })
  },
  methods: {
    openItem({nodeId}) {
      this.$store
        .dispatch('getDataTreeAncestorIdList', { id: nodeId })
        .then(arr => {
          let selectedNode = this.indexMap[nodeId]
          let expandIdChain = _.cloneDeep(arr)
          if(selectedNode.type === 'folder' || selectedNode.type === 'product') {
            // 选中的是folder或product
            expandIdChain.push(nodeId)
          }
          // this.$store.commit('updateExpandChain', { status: expandChain })
          // this.$store.commit('updateCurrentActiveNode', { status: this.nodeId })
          if (selectedNode.type === 'args-script') {
            this.openScript({
              scriptId: this.indexMap[nodeId].scriptId,
              params: this.indexMap[nodeId].scriptParams
            })
          }
          if (this.indexMap[nodeId].type === 'direct-link') {
            window.open(this.indexMap[nodeId].linkUrl)
          }
          this.updateTreeUI({
            expandIdChain,
            currentSelectedNodeId: nodeId
          })
        })
    },
    updateTreeUI({expandIdChain, currentSelectedNodeId}) {
      let self = this
      // debugger
      this.expandIdChain = expandIdChain
      this.currentSelectedNodeId = currentSelectedNodeId

      this.$nextTick(() => {
        // debugger
        this.$refs.side_menu.updateOpened()
        this.$refs.side_menu.updateActiveName()
        this.$nextTick( () => {
          // 滚动到相应位置

          let currentSelectedNode = this.indexMap[currentSelectedNodeId]
          if (currentSelectedNode.type === 'product') {

          } else if (currentSelectedNode.type === 'folder') {

          } else {

          }

          var myElement = document.getElementsByClassName(
            'active-menu-item'
          )[0]
          var parentElement = document.getElementsByClassName('my-menu')[0]
          
          var findOffsetTop = function(el, containerElement) {
            let offset = 0
            let no = 1
            while (el && el.offsetParent === null) {
              el = el.parentNode
            }
            if (el === null || el === undefined) {
              return 0
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
    },
    // getOn(status) {
      //this.turnOn =status
      // this.$nextTick(() => {
      //   this.$refs.side_menu.updateOpened()
      //   this.$refs.side_menu.updateActiveName()
      // })

      // 处理的是粘贴网址，打开对应scriptId的目录树的项
      // if (
      //   this.flagForSelect === false &&
      //   this.$route.query.scriptId !== undefined
      // ) {
      //   console.log(this.$route.query.scriptId)
      //   this.$store.dispatch('getScriptSearchList').then(arr => {
      //     for (var i = 0; i < arr.length; i++) {
      //       if (arr[i].id === this.$route.query.scriptId) {
      //         // console.log(arr[i].node);
      //         var nodeId = arr[i].node.id
      //         this.$store
      //           .dispatch('getDataTreeAncestorIdList', { id: arr[i].node.id })
      //           .then(arr => {
      //             if (arr.length === 1) {
      //               this.$store.commit('updateExpandChain', {
      //                 status: [arr[0], arr[i].node.id]
      //               })
      //             } else {
      //               this.$store.commit('updateExpandChain', { status: arr })
      //             }
      //             this.$store.commit('updateCurrentActiveNode', { status: nodeId })
      //             if (this.indexMap[nodeId].type === 'args-script') {
      //               this.openScript({
      //                 scriptId: this.indexMap[nodeId].scriptId,
      //                 params: this.indexMap[nodeId].scriptParams
      //               })
      //             }
      //           })
      //       }
      //     }
      //   })
      //   this.flagForSelect = true

        // 滚到对应的项
        // this.$nextTick(() => {
        //   //debugger
        //   console.log(
        //     document.getElementsByClassName(
        //       'ivu-menu-item ivu-menu-item-active ivu-menu-item-selected'
        //     )
        //   )
        //   var myElement = document.getElementsByClassName(
        //     'ivu-menu-item-selected'
        //   )[0]
        //   var parentElement = document.getElementsByClassName('my-menu')[0]
        //   debugger

        //   var findOffsetTop = function(el) {
        //     var offset = el.offsetTop
        //     if (el !== parentElement) {
        //       offset += findOffsetTop(el.parentNode)
        //     }
        //     return offset
        //   }
        //   var topPos = findOffsetTop(myElement)
        //   console.log(topPos)
        //   parentElement.scrollTop = topPos
        // })
      // }
    // },
    ...mapActions(['openScript'])
  }
}
</script>
<style lang="less">
// .active-menu-item {
//   border-style: solid;
//   border-color: red;
//   color: red;
//   background-color: red;
// }
.active-menu-item .ivu-menu-submenu-title {
  border-style: solid;
  border-color: green;
  color: green;
  background-color: green;
}
</style>
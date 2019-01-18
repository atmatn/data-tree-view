<template>
  <div>
    <div>
      <SearchPane/>
    </div>
    <Menu
      :style="{overflow: 'auto', height: '80vh'}"
      :class="{'my-menu': true}"
      theme="dark"
      :active-name="turnLight"
      :open-names="turnOn"
      ref="side_menu"
    >
      <div v-if="TreeNodes">
        <MySubMenu v-for="item in TreeNodes" :model="item" :name="getOn(item.title)" class="parent"></MySubMenu>
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
      dataTreeNodes: this.$store.dispatch('reloadDataTree'),
      onChangeStatus: [],
      flagForSelect: false
    }
  },
  created() {
    // console.log('23333333333333:' + this.$router.history.current.query.scriptId)
    // this.$store.commit('updateTurnOn', { status: [1, 5] })
    // this.$store.commit('updateTurnLight', { status: 8 })
  },
  components: { MySubMenu, SearchPane, ShowNoPermsSwitch },
  computed: {
    ...mapState({
      TreeNodes: 'dataTreeNodes'
    }),
    ...mapState({
      turnOn: 'turnOn'
    }),
    ...mapState({
      turnLight: 'turnLight'
    }),
    ...mapState({
      indexMap: 'indexMap'
    }),
    ...mapState({
      whichAnchor: 'whichAnchor'
    })
  },
  methods: {
    getOn(status) {
      //this.turnOn =status
      this.$nextTick(() => {
        this.$refs.side_menu.updateOpened()
        this.$refs.side_menu.updateActiveName()
      })
      if (
        this.flagForSelect === false &&
        this.$route.query.scriptId !== undefined
      ) {
        console.log(this.$route.query.scriptId)
        this.$store.dispatch('getScriptSearchList').then(arr => {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].id === this.$route.query.scriptId) {
              // console.log(arr[i].node);
              var nodeId = arr[i].node.id
              this.$store
                .dispatch('getDataTreeAncestorIdList', { id: arr[i].node.id })
                .then(arr => {
                  if (arr.length === 1) {
                    this.$store.commit('updateTurnOn', {
                      status: [arr[0], arr[i].node.id]
                    })
                  } else {
                    this.$store.commit('updateTurnOn', { status: arr })
                  }
                  this.$store.commit('updateTurnLight', { status: nodeId })
                  if (this.indexMap[nodeId].type === 'args-script') {
                    this.openScript({
                      scriptId: this.indexMap[nodeId].scriptId,
                      params: this.indexMap[nodeId].scriptParams
                    })
                  }
                })
            }
          }
        }),
          (this.flagForSelect = true)
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
          parentElement.scrollTop = topPos
        })
      }
    },
    ...mapActions(['openScript'])
  }
}
</script>

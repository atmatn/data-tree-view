<template>
  <div>
    <div>
      <SearchPane/>
    </div>
    <Menu :style="{overflow: 'auto', height: '80vh'}" theme="dark" :active-name="turnLight" :open-names="turnOn" ref="side_menu">
      <div v-if="TreeNodes">
        <MySubMenu v-for="item in TreeNodes" :model="item" :name="getOn(item.title)"></MySubMenu>
      </div>
      <div v-else>
        <h1 style="color:red">暂无数据
          <br>请联系管理员！
        </h1>
      </div>
    </Menu>
    <switchs></switchs>
    <!--转换开关-->
  </div>
</template>

<script>
import MySubMenu from '@/components/menu/MySubMenu.vue'
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import switchs from '@/components/switch/switch.vue'
import SearchPane from '@/components/data-tree-search/SearchPane.vue'
export default {
  data() {
    return {
      dataTreeNodes: this.$store.dispatch('reloadDataTree'),
      onChangeStatus: []
    }
  },
  created() {
    // console.log('23333333333333:' + this.$router.history.current.query.scriptId)
    // this.$store.commit('updateTurnOn', { status: [1, 5] })
    // this.$store.commit('updateTurnLight', { status: 8 })
  },
  components: { MySubMenu, SearchPane, switchs },
  computed: {
    ...mapState({
      TreeNodes: 'dataTreeNodes'
    }),
    ...mapState({
      turnOn: 'turnOn'
    }),
    ...mapState({
      turnLight: 'turnLight'
    })
  },
  methods: {
    getOn(status) {
      //this.turnOn =status
      this.$nextTick(() => {
        this.$refs.side_menu.updateOpened()
        this.$refs.side_menu.updateActiveName()
      })
      // debugger
      // console.log('23333333333333:'+this.$router.history.current.query.scriptId)
      // var sid=this.$router.history.current.query.scriptId
      // console.log(typeof sid)
      //  store
      //     .dispatch('getDataTreeAncestorIdList', { id: sid })
      //     .then(arr => {
      //       // if (arr.length === 1) {
      //       //   this.$store.commit('updateTurnOn', {
      //       //     status: [arr[0],sid]
      //       //   })
      //       // } else {
      //       //   this.$store.commit('updateTurnOn', { status: arr })
      //       // }
      //       // this.$store.commit('updateTurnLight', { status: sid })
      //     })
      // return status;
    }
  }
}
</script>

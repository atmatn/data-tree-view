<template>
<div>
  <div>
  <selects/>
  </div>
  <Menu theme="dark" active-name="1">
    <div v-if="TreeNodes">
          <submenu v-for="item in TreeNodes" :model="item" :name="item" ></submenu>
    </div>
    <div v-else>
        <h1 style="color:red">暂无数据</br>请联系管理员！</h1>
    </div>
  </Menu>
  <!-- <h3>查看无执行权限的项</h3><Switch size="large" v-model="this.switch" @on-change="change()"/> -->
    <switchs></switchs>
</div>
</template>

<script>
import submenu from '@/components/menu/submenu.vue';
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import selects from '@/components/select/select.vue'
import switchs from '@/components/switch/switch.vue'
export default {
    data(){
            return{
              //switch: false,
              dataTreeNodes:this.$store.dispatch('reloadDataTree')
            }
          },
    components:{submenu,selects,switchs},
    computed:{
          // change (status) {
          //       this.$Message.info('开关状态：' + status);
          //   },
         ...mapState({
      TreeNodes: "dataTreeNodes"
    })

    }
}
</script>

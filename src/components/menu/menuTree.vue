<template>
<div>
  <Menu theme="dark" active-name="1">
    <div v-if="TreeNodes">
          <submenu v-for="item in TreeNodes" :model="item" :name="item" ></submenu>
    </div>
    <div v-else>
        <h1 style="color:red">暂无数据</br>请联系管理员！</h1>
    </div>
  </Menu>
</div>
</template>

<script>
import submenu from '@/components/menu/submenu.vue';
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
// import axios from 'axios'
export default {
    components:{submenu},
    computed:{
         ...mapState({
      TreeNodes: "dataTreeNodes"
    })
    },
     data(){
            return{
              dataTreeNodes:this.$store.dispatch('reloadDataTree')
            }
          }
}
</script>

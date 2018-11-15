<template>
<div>
  <Menu theme="dark" active-name="1">
    <div v-if="dataTreeNodes === ''">
          <submenu v-for="item in dataTreeNodes" :model="item"></submenu>
    </div>
    <div v-else>
        <h1 style="color:red">暂无数据</br>请联系管理员！</h1>
    </div>
  </Menu>
</div>
</template>

<script>
import submenu from '@/menu/submenu.vue';
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
export default {
     components:{submenu},
data(){
 return {
    dateTreeNodes:'hello',
        }
    },
    computed:{
    //   getDataTree: function () {
    //     return axios.get('/api/data-tree').then( res => {
    //     this.DataTree = res.data.treeNodes
    //   })
    //  }
     ...mapState({
      dataTreeNodes: "dataTreeNodes"
    })
    }
}
</script>

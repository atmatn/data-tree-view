<template>
<div>
  <Menu theme="dark" active-name="1">
    <div v-if="getDataTree">
          <test3 v-for="item in DataTree" :model="item"></test3>
    </div>
    <div v-else>
        <h1 style="color:red">暂无数据</br>请联系管理员！</h1>
    </div>
  </Menu>
</div>
</template>

<script>
import test3 from '@/test/test3.vue';
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
//import {getDataTree} from '@/mock/index.js'
export default {
     components:{test3},
data(){
 return {
    DataTree:'hello',
        }
    },
    computed:{
      getDataTree: function () {
        return axios.get('/api/data-tree').then( res => {
        this.DataTree = res.data.treeNodes
      })

     }
    }
}
</script>

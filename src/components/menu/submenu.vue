<template>
  <div v-if="model.type !== 'product'&&model.type !== 'folder'&&model.type ==='args-script'">
    <MenuItem @click.native="openScript({scriptId: model.id, params: {'param_a': model.scriptParams.param_a, 'param_b': model.scriptParams.param_b }})">{{model.title}}</MenuItem>
  </div>
  <div v-else-if="model.type !== 'product'&&model.type !== 'folder'&&model.type ==='direct-link'">
    <MenuItem @click.native="childrenClick()">{{model.title}}</MenuItem>
  </div>
  <div v-else>
     <submenu :name="model.title" >
      <template slot="title">{{model.title}}</template>
      <div v-if="isFolder"><treeMenu v-for="item in model.children" :model="item"></treeMenu></div>
    </submenu>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
 name: 'treeMenu',
 props: ['model'],
//  render (h){  //render函数构建导航菜单
//    return this.model.type !== 'product'&&this.model.type !== 'folder'?h(
//      'MenuItem',
//      {},
//      this.model.title
//    ):h(
//      'Submenu',
//      {
//        domProps:{
//                   name:this.model.title
//                 }
//      },
//      [
//        h(
//           'template',
//           {
//             solt:'title'
//           },
//             this.model.title
//        ),
//        h(
//           'div',
//           isFolder? this.model.children.map(
//                           (item,index)=>h(
//                       'treeMenu',
//                        {
//                          domProps:{model:item}
//                        }
//                         )
//                     ):null
//        )
//      ]
//    )
//  },
 data(){
   return {
     isFolder: true,
          }
      },
 computed: {
 isFolder: function() {
 return this.model.children && this.model.children.length
                      }
          },
  methods:{
    childClick () {
         window.location.href=this.model.linkUrl
      },
    ...mapActions(["openScript"])
  }
}
</script>

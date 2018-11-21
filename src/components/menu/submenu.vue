<template>
  <div v-if="model.type !== 'product'&&model.type !== 'folder'&&model.type ==='args-script'">
    <div v-if="model.currentUserExecutable=== false">
        <MenuItem :name="model.id">
            <Poptip  title="缺少下列权限":content="model.executable_perms" placement="right">
                {{model.title}}<icon type="md-lock"/>
            </Poptip>
        </MenuItem>
    </div>
    <div v-else>
        <MenuItem :name="model.id" @click.native="openScript({scriptId: model.id, params: {'param_a': model.scriptParams.param_a, 'param_b': model.scriptParams.param_b }})">{{model.title}}</MenuItem>
    </div>
  </div>
  <div v-else-if="model.type !== 'product'&&model.type !== 'folder'&&model.type ==='direct-link'">
    <div v-if="model.currentUserExecutable=== false">
      <MenuItem :name="model.id">
          <Poptip title="缺少下列权限" :content="model.executable_perms" placement="right">
              {{model.title}}<icon type="md-lock"/>
          </Poptip>
      </MenuItem>
    </div>
    <div v-else>
      <MenuItem :name="model.id" @click.native="childClick">{{model.title}}</MenuItem>
    </div>
  </div>
  <div v-else>
      <div v-if="model.currentUserExecutable === true&&model.children.length === 0">
          <MenuItem :name="model.id">{{model.title}}(空)</MenuItem>
      </div>
      <div v-else>
          <submenu :name="model.title" >
                <template slot="title">{{model.title}}</template>
                <div v-if="isFolder"><treeMenu v-for="item in model.children" :model="item"></treeMenu></div>
          </submenu>
      </div>


  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
 name: 'treeMenu',
 props: ['model'],
 computed: {
//  check(){
//     for(var i=0;i<this.model.executable_perms.length;i+=1){
//         if(this.model.executable_perms[i]==='ke_core'){
//           return true;
//         }
//     }
//   },
 isFolder() {
 return this.model.children && this.model.children.length
                      }
          },
  methods:{
    childClick () {
         window.open(this.model.linkUrl)
      },
    ...mapActions(["openScript"])
  },
  data(){
    return {}
  }
}
</script>

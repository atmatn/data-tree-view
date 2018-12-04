<template>
<div>
  <Tree :data="TreeNodes" :render="renderContent"></Tree>
  <h3>{{tips}}</h3>
  <forms :model="addForm" v-model="model" :functions="functions"></forms>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import forms from '@/components/form/form.vue'
export default {
    components:{forms},
    props:['model'],
    data(){
            return{
             dataTreeNodes:this.$store.dispatch('reloadDataTree'),
             tips:'欢迎来到编辑页面！',
             addForm:'',
             functions:''
            }
          },
    computed:{
         ...mapState({
      TreeNodes: "dataTreeNodes"
    })
    },
    methods: {
            renderContent (h, { root, node, data }) {
                return h('span', [
                            h('span',
                    [
                        data.currentUserVisible===false||data.currentUserExecutable===false?null:h('span', data.title+' '),
                        data.currentUserVisible===false?null:(data.type==='product'||data.type==='folder'?h('Button',
                        {props:{type:'primary'},on:{click:()=>{this.add(data)}}},
                        data.title+'-新增'
                        ):null),
                        data.type!=='product'&&data.type!=='folder'&&data.containsExecutableForCurrentUser === true?h('Button',
                        {props:{type: 'info'}},
                        data.title+'-复制'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'success'}},
                        data.title+'-更名'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'warning'}},
                        data.title+'-移动'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'error'}},
                        data.title+'-管理权限'
                        ):null,
                        data.type!=='product'&&data.type!=='folder'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'dashed'}},
                        data.title+'-设置属性'
                        ):null,
                    ]),
                ]);
            },
            add (data) {
              this.tips='当前项:'+data.title+'-新增';
              this.addForm=data;
              this.functions='add';
              return{
                render: h=>{
                  'div',
                  {},
                  'hello'
                }
              }
            }
        }
}
</script>

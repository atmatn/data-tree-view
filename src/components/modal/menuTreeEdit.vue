<template>
<div>
  <Button type="default" @click="addProduct()">添加新产品</Button>
  <Tree :data="TreeNodes" :render="renderContent"></Tree>
  <h3>{{tips}}</h3>
  <forms  :model="addForm" v-model="model" :functions="functions"></forms>
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
                        data.currentUserVisible===false||data.currentUserExecutable===false?null:h('span', [
                          h('Button',
                          {props:{type:'primary'}},
                          data.title+' '
                          ),
                          ]),
                        data.currentUserVisible===false?null:(data.type==='product'||data.type==='folder'?h('Button',
                        {props:{type:'text'},on:{click:()=>{this.add(data)}},style:{color:'red'}},
                        data.title+'-新增'
                        ):null),
                        data.type!=='product'&&data.type!=='folder'&&data.containsExecutableForCurrentUser === true?h('Button',
                        {props:{type: 'text'},style:{color:'green'}},
                        data.title+'-复制'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'text'},on:{click:()=>{this.rename(data)}},style:{color:'blue'}},
                        data.title+'-更名'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'text'},style:{color:'purple'}},
                        data.title+'-移动'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'text'},style:{color:'orange'}},
                        data.title+'-管理权限'
                        ):null,
                        data.type!=='product'&&data.type!=='folder'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'text'},style:{color:'pink'}},
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
            },
            addProduct(){
              this.tips='添加新产品';
              this.addForm='';
              this.functions='addProduct';
              return{
                render: h=>{
                  'div',
                  {},
                  'hello'
                }
              }
            },
            rename(data){
              this.tips='当前项:'+data.title+'-更名';
              this.addForm=data;
              this.functions='rename';
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

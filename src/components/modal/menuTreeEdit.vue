<template>
<div>
  <Button type="default" @click="addProduct()">添加新产品</Button>
  <Tree :data="TreeNodes" :render="renderContent"></Tree>
  <h3>{{tips}}</h3>
  <forms  :model="addForm" v-model="model" :functions="functions" :perms="perm" :attrs="attrs" :permsList="this.perms"></forms>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import forms from '@/components/form/form.vue'
import axios from 'axios'
export default {
    components:{forms},
    props:['model'],
    data(){
            return{
             dataTreeNodes:this.$store.dispatch('reloadDataTree'),
             tips:'欢迎来到编辑页面！',
             addForm:'',
             functions:'',
             perm:'',
             attrs:'',
             permsList:this.$store.dispatch('reloadPermsList'),
             buttonType:'primary'
            }
          },
    computed:{
       ...mapState({
      allow: "allow"
    }),
         ...mapState({
      TreeNodes: "dataTreeNodes"
    }),
         ...mapState({
      perms: "permsList"
    })
    },
    methods: {
            renderContent (h, { root, node, data }) {
                return h('span', [
                            h('span',
                    [
                        data.currentUserVisible===false||data.currentUserExecutable===false?null:
                        h('span', [
                          h('Button',
                          {props:{type:(data.type === 'product'?'primary':data.type === 'folder'?'info':data.type === 'args-script'?'success':data.type ==='direct-link'?'warning':'')}},
                          data.title+' '
                          ),
                          ]),
                        data.currentUserVisible===false?null:(data.type==='product'||data.type==='folder'?h('Button',
                        {props:{type:'text'},on:{click:()=>{this.add(data)}},style:{color:'red'}},
                        '新增'
                        ):null),
                        data.type!=='product'&&data.type!=='folder'&&data.containsExecutableForCurrentUser === true?h('Button',
                        {props:{type: 'text'},on:{click:()=>{this.copy(data)}},style:{color:'green'}},
                       '复制'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'text'},on:{click:()=>{this.rename(data)}},style:{color:'blue'}},
                        '更名'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true&&(data.children=== undefined||data.children.length===0)?h('Button',
                        {props:{type: 'text'},on:{click:()=>{this.delete(data)}},style:{color:'black'}},
                        '删除'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'text'},on:{click:()=>{this.move(data)}},style:{color:'purple'}},
                        '移动'
                        ):null,
                        data.type!=='product'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'text'},on:{click:()=>{this.getPerms(data)}},style:{color:'orange'}},
                        '管理权限'
                        ):null,
                        data.type!=='product'&&data.type!=='folder'&&data.currentUserManageable === true?h('Button',
                        {props:{type: 'text'},on:{click:()=>{this.getAttrs(data)}},style:{color:'pink'}},
                        '设置属性'
                        ):null,
                    ]),
                ]);
            },
            add (data) {
              this.tips='当前项:'+data.title+'-新增';
              this.addForm=data;
              this.functions='add';
              this.$store.commit('updateAllow',{status:false});
            },
            addProduct(){
              this.tips='添加新产品';
              this.addForm='';
              this.functions='addProduct';
              this.$store.commit('updateAllow',{status:false});
            },
            rename(data){
              this.tips='当前项:'+data.title+'-更名';
              this.addForm=data;
              this.functions='rename';
              this.$store.commit('updateAllow',{status:false});
            },
            delete(data){
              this.tips='当前项:'+data.title+'-删除';
              this.addForm=data;
              debugger
              //console.log('2333333333333333333333'+data.children)
              this.functions='delete';
              this.$store.commit('updateAllow',{status:false});
            },
            move(data){
              this.tips='当前项:'+data.title+'-移动';
              this.addForm=data;
              this.functions='move';
              this.$store.commit('updateAllow',{status:false});
            },
            copy(data){
              this.tips='当前项:'+data.title+'-复制';
              this.addForm=data;
              this.functions='copy';
              this.$store.commit('updateAllow',{status:false});
            },
            getPerms(data){
              this.tips='当前项:'+data.title+'-管理权限';
              this.addForm=data;
              this.functions='setPerms';
              console.log(data.id);
              axios.request({
              url: '/api/data-tree/edit/get-perms',
              method: 'post',
              data:{
                  id:data.id,
              }
              }).then(res => {
                if(res.data.permList !==null&&res.data.permList !==''&&res.data.permList !==undefined){
                    this.perm=res.data.permList
                    console.log('获取权限成功');
                }else{
                    console.log('获取权限失败');
                }
                            })
               this.$store.commit('updateAllow',{status:false});
            },
            getAttrs(data){
              this.tips='当前项:'+data.title+'-设置属性';
              this.addForm=data;
              this.functions='setAttrs';
              console.log(data.id);
              axios.request({
              url: '/api/data-tree/edit/get-attrs',
              method: 'post',
              data:{
                  id:data.id,
              }
              }).then(res => {
                if(res.data.attrs !==null&&res.data.attrs !==''&&res.data.attrs !==undefined){
                    this.attrs=res.data.attrs
                    console.log('获取属性成功');
                }else{
                    console.log('获取属性失败');
                }
                            })
               this.$store.commit('updateAllow',{status:false});
            }
        }
}
</script>

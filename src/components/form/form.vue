<template>
<div>
<Form v-if="functions==='add'">
  <formItem>
      请选择要添加的类型:
        <RadioGroup v-model="type">
           <!-- <Radio label='product'/> -->
           <Radio v-if="model.type==='product'||model.type==='folder'"label='folder'/>
           <Radio v-if="model.type==='folder'"label='direct-link'/>
           <Radio v-if="model.type==='folder'"label='args-script'/>
        </RadioGroup>
        <br/>
        <Input v-model.trim="itemName" placeholder="请输入要添加的名称..." style="width: 300px" />
      <div v-if="type" style="color:green">
        您当前选择了:{{this.type}}&nbsp;,&nbsp;parentId:{{model.id}}&nbsp;,&nbsp;itemName:{{this.itemName}}
      </div>
      <br/>
    <Button v-if="allow===false" @click="save()"type="primary">保存</Button>
    <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div>
  </formItem>
</Form>
<Form v-if="functions==='addProduct'">
  <formItem>
    请输入要添加的新产品名称：<input v-model.trim="productName"/>
  </formItem>
  <formItem>
    <Button type="primary" v-if="allow===false" @click="save()">添加产品</Button>
    <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div>
  </formItem>
</Form>
<Form v-if="functions==='rename'">
  <formItem>
      原名称:{{model.title}}<br/>
        <Input v-model.trim="itemName" placeholder="请输入要更改的新的名称..." style="width: 300px" />
      <br/>
    <Button v-if="allow===false" @click="rename()"type="primary">更改</Button>
    <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div>
  </formItem>
</Form>
<Form v-if="functions==='delete'">
  <formItem>
   确定要删除【{{model.title}}】吗？
    <Button v-if="allow===false" @click="deletes()"type="primary">确定</Button>
  </formItem>
</Form>
</div>

</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import axios from 'axios'
export default {
    props:['model','functions'],
    data(){
      return{
        type:'',
        itemName:'',
        success:'',
        productName:''
      }
    },
    computed: {
      ...mapState({
      allow: "allow"
    })
    },
    methods:{
      save(){
        if(this.productName !==null&&this.productName!==''){
           axios.request({
              url: '/api/data-tree/edit/add',
              method: 'post',
              data:{
                  parentId:-1,
                  type:'product',
                  title:this.productName
              }
              }).then(res => {
              //this.$Message.info('新增项的id：'+res.data.id);//测试用
              if(res.data.status === 'error'){
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info(res.data.msg);
                this.success='添加失败';
              }else{
                 this.$Message.info('添加成功');
                 // this.$Message.info(res.data.id);
                 this.success='已添加';
                 this.$store.commit('updateAllow',{status:true});
                 this.$store.dispatch('reloadDataTree')//完成后会从新加载数据
              }
                            })
        }else{
        if(this.type===''||(this.itemName===''||this.itemName.length===0)){
            this.$Message.info('未选择类型或输入的名称为空');
            this.success='未选择类型或输入的名称为空';
            this.$store.commit('updateAllow',{status:false});
        }else{
         axios.request({
              url: '/api/data-tree/edit/add',
              method: 'post',
              data:{
                  parentId:this.model.id,
                  type:this.type,
                  title:this.itemName
              }
              }).then(res => {
              //this.$Message.info('新增项的id：'+res.data.id);//测试用
              if(res.data.status === 'error'){
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info(res.data.msg);
                this.success='添加失败';
              }else{
                 this.$Message.info('添加成功'+'id:'+res.data.id);
                 // this.$Message.info(res.data.id);
                 this.success='已添加';
                 this.$store.commit('updateAllow',{status:true});
                 this.$store.dispatch('reloadDataTree')//完成后会从新加载数据
              }
                            })
         }
         }
      },
      rename(){
            if(this.itemName===''||this.itemName.length===0){
            this.$Message.info('输入的名称为空');
            this.success='输入的名称为空';
            this.$store.commit('updateAllow',{status:false});
            }else{
             axios.request({
              url: '/api/data-tree/edit/rename',
              method: 'post',
              data:{
                  id:this.model.id,
                  title:this.itemName
              }
              }).then(res => {
              if(res.data.isRenamed === true){
                    this.$Message.info('修改成功');
                    this.success='已修改';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
              }else{
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info('修改失败');
                this.success='修改失败';
              }
                            })
            }
      },
      deletes(){
         axios.request({
              url: '/api/data-tree/edit/delete',
              method: 'post',
              data:{
                  id:this.model.id
              }
              }).then(res => {
                console.log(res.data.isDeleted)
              if(res.data.isDeleted === true){
                    this.$Message.info('删除成功');
                    this.success='已删除';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
              }else{
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info('删除失败');
                this.success='删除失败';
              }
                            })
      }
    }
}
</script>



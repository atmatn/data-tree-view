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
    <!-- <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div> -->
  </formItem>
</Form>
<Form v-if="functions==='addProduct'">
  <formItem>
    请输入要添加的新产品名称：<input v-model.trim="productName"/>
  </formItem>
  <formItem>
    <Button type="primary" v-if="allow===false" @click="save()">添加产品</Button>
    <!-- <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div> -->
  </formItem>
</Form>
<Form v-if="functions==='rename'">
  <formItem>
      <!-- 原名称:{{model.title}}<br/> -->
        <Input v-model.trim="itemName" :placeholder="model.title" style="width: 300px" />
      <br/>
    <Button v-if="allow===false" @click="rename()"type="primary">更改</Button>
    <!-- <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div> -->
  </formItem>
</Form>
<Form v-if="functions==='delete'">
  <formItem>
   确定要删除【{{model.title}}】吗？
    <Button v-if="allow===false" @click="deletes()"type="primary">确定</Button>
  </formItem>
</Form>
<Form v-if="functions==='move'">
  <formItem>
    <br/>
    1.当前选择了：{{model.title}}<br/>
    2.要移动到:
    <Select v-model="onChange"style="width:200px"  @on-change="changeVal(onChange)" filterable>
      <OptionGroup  v-for="item in TreeNodes" v-if="item.currentUserVisible === true" :label="item.title">
        <Option v-for="items in item.children" :value="items.id" :key="items.title">{{ items.title }}</Option>
      </OptionGroup>
    </Select>
    <br/>
    <Button v-if="allow===false" @click="moves()"type="primary">移动</Button>
  </formItem>
</Form>
<Form v-if="functions==='copy'">
  <formItem>
    1.要复制的叶子节点:{{model.title}}
    <br/>
    2.请选择要复制到哪一项里面：
   <Select v-model="onChange"style="width:200px"  @on-change="changeVal(onChange)" filterable>
      <OptionGroup  v-for="item in TreeNodes" v-if="item.currentUserVisible === true" :label="item.title">
        <Option v-for="items in item.children" :value="items.id" :key="items.title">{{ items.title }}</Option>
      </OptionGroup>
    </Select>
    <br/>
    <br/>
    <Button v-if="allow===false" @click="copys()"type="primary">复制</Button>
  </formItem>
</Form>
<Form v-if="functions==='setPerms'">
  <formItem>
    {{model.title}}的权限:<div v-for="item in this.perms"><div >{{item.value}}:{{item.perms}}</div></div>
    <br/>
    权限列表：
    <Select v-model="permSelected" style="width:300px">
        <Option v-for="perm in this.permsList" :value="perm.value" :key="perm.title">{{perm.title}}:{{perm.value}}</Option>
    </Select>
    <br/>
    <Button @click="setPerms()"type="primary">设置</Button>
  </formItem>
</Form>
<Form v-if="functions==='setAttrs'">
  <formItem>
    {{model.title}}的属性:<div v-for="item in this.attrs">{{item.title}}:{{item.attrVal}}</div>
  </formItem>
  <formItem>
    <!-- 设置当前属性的类型为：
    <RadioGroup v-model="Nowtype">
      <Radio label='direct-link'/>
      <Radio label='args-script'/>
    </RadioGroup> -->
    <Input v-if="model.type === 'direct-link'" :placeholder="model.linkUrl" v-model.trim="urls" />
    <div v-if="model.type === 'args-script'">
      脚本id：<Input :placeholder="model.scriptId" v-model.trim="scriptid" style="width: 300px" value="model.scriptId"/><br/>
      <div v-for="(key,value,index) in model.scriptParams">
      参数名{{index+1}}：<Input :placeholder="value+''" v-model.trim="param_a[index]" style="width: 300px"/>参数值{{index+1}}：<Input :placeholder="key+''" v-model.trim="param_a_value[index]" style="width: 300px" /><br/>
      </div>
    </div>
    <Button type="primary" @click="setAttrs()">保存</Button>
  </formItem>
</Form>
 <div v-if ="allow===false" style="color:red">{{this.success}}</div>
 <div v-if ="allow===true" style="color:green">{{this.success}}</div>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import axios from 'axios'
export default {
    props:['model','functions','perms','attrs','permsList'],
    watch:{
            model:function(newVal,oldVal){
                this.scriptid = newVal.scriptId;
                this.urls=newVal.linkUrl;
                var i=0;
                for(var key in newVal.scriptParams){
                          this.param_a[i]=key;
                          this.param_a_value[i]=newVal.scriptParams[key]
                          i++;
                }
                          }
        },
    data(){
      return{
        type:'',
        itemName:'',
        success:'',
        productName:'',
        urls:'',
        scriptid:'',
        param_a:[],
        param_a_value:[],
        permSelected:'',
        dataTreeNodes:this.$store.dispatch('reloadDataTree'),
        onChange:''
      }
    },
    computed: {
      ...mapState({
      allow: "allow"
    }),
    ...mapState({
      TreeNodes: "dataTreeNodes"
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
              if(res.status !== 200){
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info(res.status);
                this.success='添加失败,请按F12打开控制台查看错误信息';
              }else{
                 this.$Message.info('添加成功');
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
              if(res.status !== 200){
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info(res.data.msg);
                this.success='添加失败,请按F12打开控制台查看错误信息';
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
              if(res.status === 200){
                    this.$Message.info('修改成功');
                    this.success='已修改';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
              }else{
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info('修改失败');
                this.success='修改失败,请按F12打开控制台查看错误信息';
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
               if(res.status === 200){
                    this.$Message.info('删除成功');
                    this.success='删除成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
              }else{
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info('删除失败');
                this.success='删除失败,请按F12打开控制台查看错误信息';
              }
                            })
      },
      moves(){
        if(this.model.type !== 'product'){
          axios.request({
              url: '/api/data-tree/edit/move',
              method: 'post',
              data:{
                  id:this.model.id,
                  parentId:this.onChange
              }
              }).then(res => {
                if(res.status !== 200){
                    this.$Message.info('移动失败');
                    this.success='移动失败,请按F12打开控制台查看错误信息';
                    this.$store.commit('updateAllow',{status:false});
                }else{
                    this.$Message.info('移动成功');
                    this.success='移动成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
                }
                            })
        }
      },
      changeVal(onChange){
          this.onChange=onChange
          // console.log('2333333hh'+this.onChange)
      },
      copys(){

          if(this.model.type !== 'product'&&this.model.type !== 'folder'){
          axios.request({
              url: '/api/data-tree/edit/copy',
              method: 'post',
              data:{
                  id:this.model.id,
                  parentId:this.onChange
              }
              }).then(res => {
                if(res.status !== 200){
                    this.$Message.info('复制失败');
                    this.success='复制失败,请按F12打开控制台查看错误信息';
                    this.$store.commit('updateAllow',{status:false});
                }else{
                    this.$Message.info('复制成功');
                    this.success='复制成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
                }
                            })
        }
      },
      setPerms(){
            //console.log(this.permsList);
            axios.request({
              url: '/api/data-tree/edit/set-perms',
              method: 'post',
              data:{
                  id:this.model.id,
                  permList:[{'value':'executable_perms','perms':this.permSelected}]
              }
              }).then(res => {
                if(res.status !== 200){
                    this.$Message.info('设置失败');
                    this.success='设置失败,请按F12打开控制台查看错误信息';
                    this.$store.commit('updateAllow',{status:false});
                }else{
                    this.$Message.info('设置成功');
                    this.success='设置成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
                    }
                            })
      },
      setAttrs(){
        var attr={};
        if(this.model.type === 'direct-link'){
          var attrLink=[{'attrKey':'linkUrl','attrVal':this.urls}];
            attr=attrLink;
        }else{
            const a=this.param_a[0]
            const b=this.param_a[1]
            var attrVal={};
            attrVal[a]=this.param_a_value[0];
            attrVal[b]=this.param_a_value[1];
           //console.log('21'+this.model.scriptParams.getKey());
            if(this.param_a==='[]'||this.param_a===[]){
              console.log('21')
                var attrScript=[{'attrKey':'scriptId','attrVal':this.$placeholder.value},{'attrKey':'scriptParams','attrVal':attrVal}];
            }else{
                var attrScript=[{'attrKey':'scriptId','attrVal':this.scriptid},{'attrKey':'scriptParams','attrVal':attrVal}];
                attr=attrScript;
            }
        }
              axios.request({
              url: '/api/data-tree/edit/set-attrs',
              method: 'post',
              data:{
                  id:this.model.id,
                  attrs:attr
              }
              }).then(res => {
                 if(res.status !== 200){
                    this.$Message.info('修改失败');
                    this.success='修改失败,请按F12打开控制台查看错误信息';
                    this.$store.commit('updateAllow',{status:false});
                }else{
                    this.$Message.info('修改成功');
                    this.success='修改成功';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')
                    }
                            })
        }
    }
}
</script>



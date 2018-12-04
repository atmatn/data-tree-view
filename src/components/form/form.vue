<template>
<div>
<Form v-if="functions==='add'">
  <formItem>
      请选择要添加的类型:
        <RadioGroup v-model="type">
           <!-- <Radio label='product'/> -->
           <Radio v-if="model.type==='product'" label='folder'/>
           <Radio v-if="model.type==='product'||model.type==='folder'"label='direct-link'/>
           <Radio v-if="model.type==='product'||model.type==='folder'"label='args-script'/>
        </RadioGroup>
        <br/>
        <Input v-model.trim="itemName" placeholder="请输入要添加的名称..." style="width: 300px" />
      <div v-if="type" style="color:green">
        您当前选择了:{{this.type}}&nbsp;,&nbsp;parentId:{{model.id}}&nbsp;,&nbsp;itemName:{{this.itemName}}
      </div>
      <br/>
    <Button @click="save()"type="primary">保存</Button>
    <div v-if ="allow===false" style="color:red">{{this.success}}</div>
    <div v-if ="allow===true" style="color:green">{{this.success}}</div>
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
        success:''
      }
    },
    computed: {
      ...mapState({
      allow: "allow"
    })
    },
    methods:{
      save(){
        if(this.type===''||(this.itemName===''||this.itemName.length===0)){
            this.$Message.info('未选择类型或输入的名称为空');
            this.success='未选择类型或输入的名称为空';
            this.$store.commit('updateAllow',{status:false});
        }else{
         axios.request({
              url: '/api/data-tree/edit/add',
              method: 'post',
              data:{
                  parentId:this.id,
                  type:this.type,
                  name:this.itemName
              }
              }).then(res => {
              //this.$Message.info('新增项的id：'+res.data.id);//测试用
              if(res.data.id !== null&&res.data.id !==''&&res.data.id !==undefined){
                    this.$Message.info('添加成功');
                    this.success='已添加';
                    this.$store.commit('updateAllow',{status:true});
                    this.$store.dispatch('reloadDataTree')//完成后会从新加载数据
              }else if(res.data.id === temp){

              }else{
                this.$store.commit('updateAllow',{status:false});
                this.$Message.info('添加失败');
                this.success='添加失败';
              }
                            })
         }
      }
    }
}
</script>



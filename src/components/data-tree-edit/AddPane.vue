<template>
  <div>
    {{mode}}
    {{currentNode}}
    <div>
      <div>请选择要添加的类型:
        <RadioGroup v-model="type">
          <Radio v-if="currentNode.type==='product'|| currentNode.type ==='folder'" label="folder"/>
          <Radio v-if="currentNode.type==='folder'" label="direct-link"/>
          <Radio v-if="currentNode.type==='folder'" label="args-script"/>
        </RadioGroup>
        <br>名称：
        <Input v-model.trim="itemTitle" placeholder="请输入要添加的名称..." style="width: 300px"/>
        <!-- <div
          v-if="type"
          style="color:green"
        >您当前选择了:{{this.type}}&nbsp;,&nbsp;parentId:{{model.id}}&nbsp;,&nbsp;itemName:{{this.itemName}}</div>-->
        <div v-if="type === 'direct-link'">链接：
          <Input placeholder="请输入要添加的链接..." v-model.trim="directUrl"/>
        </div>
        <div v-if="type === 'args-script'">脚本id：
          <Input placeholder="请输入要添加的脚本id..." v-model.trim="scriptId" style="width: 300px"/>
          <br>
          <div v-for="(item,index) in this.scriptParams">
            <Row>
              参数名{{index+1}}：
              <Input
                placeholder="请输入要添加的参数名..."
                v-model.trim="item.paramName"
                style="width: 250px"
              />
              参数值{{index+1}}：
              <Input
                placeholder="请输入要添加的参数值..."
                v-model.trim="item.paramValue"
                style="width: 250px"
              />
              <Button type="error" @click="scriptParams.splice(index,1)">删除</Button>
            </Row>
            <br>
          </div>
        </div>
        <Button v-if="this.type === 'args-script'" type="primary" @click="scriptParams.push({paramName:'', paramValue:''})">添加参数</Button>
        <br>
        <Button @click="save()" type="primary">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: ['mode', 'id', 'idAndMode'],
  watch: {
    idAndMode: {
      handler: function(newVal) {
        debugger

        if (newVal.mode === 'add') {
          axios
            .post('/api/data-tree/edit/get-node', {
              id: newVal.id
            })
            .then(res => {
              // debugger
              this.currentNode = res.data
            })
          // 清掉，初始化信息
          // axios.request({
          //   url: '/api/data-tree/edit/get-node',
          //   method: 'post',
          //   data: {
          //     id: this.id
          //   }
          // }).then(res => {
          //   this.currentNode = res.data
          // })
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      type: '',
      itemTitle: '',
      directUrl: '',
      scriptId: '',
      scriptParams: [],
      currentNode: {}
    }
  },
  methods: {
    save: function() {
      // ajax save
      if(this.type='folder'&&itemTitle!==''){
        //文件夹类型切不为空
        
      }else if(this.type='direct-link'&&directUrl!==''){
        //链接类型且不为空
      }else if(this.type='args-script'){
        //链脚本类型且不为空
      }else{
        //失败
      }
      axios
          .request({
            url: "/api/data-tree/edit/add",
            method: "post",
            data: {
              parentId: -1,
              type: this.type,
              title: this.itemTitle
            }
          })
          .then(res => {
            if (res.status !== 200) {
              this.$store.commit("updateAllow", { status: false });
              this.$Message.info(res.status);
              this.success = "添加失败,请按F12打开控制台查看错误信息";
            } else {
              this.$Message.info("添加成功");
              this.success = "已添加";
              this.$store.commit("updateAllow", { status: true });
              this.productName = "";
              this.$store.dispatch("reloadDataTree"); //完成后会从新加载数据
            }
          });
      // completed
      this.$emit('completed')
    }
  }
}
</script>

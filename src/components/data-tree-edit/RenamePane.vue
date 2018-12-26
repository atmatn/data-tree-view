<template>
  <div>
    <Input v-model.trim="reName" style="width: 300px"/>
    <br>
    <Button @click="rename()" type="primary">更名</Button>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props:['idAndMode'],
  data(){
    return{
      reName:''
    }
  },
  watch:{
    idAndMode: {
      handler: function(newVal) {
        let self = this
        if (newVal.mode === 'rename') {
           this.$store.dispatch('getNodeTitle', {id: newVal.id}).then( title => {
             self.reName = title
           })
        console.log(newVal);
        }
      },
      immediate: true
    }
  },
  methods:{
    rename(){
      if (this.reName === "" || this.reName.length === 0) {
        this.$Message.info("输入的名称为空");
      } else {
        axios
          .request({
            url: "/api/data-tree/edit/rename",
            method: "post",
            data: {
              id: this.idAndMode.id,
              title: this.reName
            }
          })
          .then(res => {
            if (res.status === 200) {
              this.$Message.info("修改成功");
              this.$emit('completed')
            } else {
              this.$Message.info("修改失败");
            }
          });
      }
    }
  }
}
</script>

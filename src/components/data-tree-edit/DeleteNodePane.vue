<template>
      <div>
        <h5 style="color:red">确定要删除【{{this.delTitle}}】吗？</h5>
        <Button @click="deletes()" type="primary">确定</Button>
      </div>
</template>
<script>
import axios from 'axios'
export default {
  props:['idAndMode'],
  data(){
    return{
      delTitle:''
    }
  },
  watch:{
    idAndMode: {
      handler: function(newVal) {
        let self = this
        if (newVal.mode === 'delete') {
           this.$store.dispatch('getNodeTitle', {id: newVal.id}).then( title => {
             self.delTitle = title
           })
        //console.log(newVal);
        }
      },
      immediate: true
    }
  },
  methods:{
    deletes(){
      axios
        .request({
          url: "/api/data-tree/edit/delete",
          method: "post",
          data: {
            id: this.idAndMode.id
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.$Message.info("删除成功");
            this.$emit('completed')
          } else {
             this.$Message.info("删除失败");
            // this.success = "删除失败,请按F12打开控制台查看错误信息";
          }
        });
    }
  }
}
</script>

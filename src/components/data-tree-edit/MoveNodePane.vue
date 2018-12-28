<template>
  <div>当前要复制的目标为:
    <span style="color:green">{{this.nodeTitle}}</span>
    <br><Row><Col span="8"><h2>请选择要复制到哪一项里面：</h2></Col>
    <!-- <Select v-model="onChange" style="width:200px" @on-change="changeVal(onChange)" filterable>
      <OptionGroup
        v-for="item in TreeNodes"
        v-if="item.currentUserVisible === true"
        :label="item.title"
      >
        <Option
          v-for="items in item.children"
          :value="items.id"
          :key="items.title"
        >{{ items.title }}</Option>
      </OptionGroup>
    </Select>-->
    <Col span="16"><SelectNode v-model="targetNodeId"></SelectNode></Col></Row>
    <br>
    <Button v-if="targetNodeId !== undefined && targetNodeId !== null" @click="doMove()" type="primary">移动</Button>
  </div>
</template>
<script>
import axios from 'axios'
import SelectNode from '@/components/data-tree-edit/SelectNode.vue'
export default {
  props: ['idAndMode'],
  components: { SelectNode },
  data() {
    return {
      nodeTitle: '',
      selected:undefined,
      targetNodeId: null
    }
  },
  watch: {
    idAndMode: {
      handler: function(newVal) {
        debugger
        let self = this
        if (newVal.mode === 'move') {
          this.$store
            .dispatch('getNodeTitle', { id: newVal.id })
            .then(title => {
              self.nodeTitle = title
            })
          //console.log('2333' + newVal)
        }
      },
      immediate: true
    }
  },
  methods: {
    doMove() {
      debugger
        axios
          .request({
            url: "/api/data-tree/edit/move",
            method: "post",
            data: {
              id: this.idAndMode.id,
              parentId: this.targetNodeId
            }
          })
          .then(res => {
            if (res.status !== 200) {
              this.$Message.info("移动失败");
              // this.success = "移动失败,请按F12打开控制台查看错误信息";
              // this.$store.commit("updateAllow", { status: false });
            } else {
              this.$Message.info("移动成功");
              this.$emit('completed')
              // this.success = "移动成功";
              // this.$store.commit("updateAllow", { status: true });
              // this.onChange = "";
              // this.$store.dispatch("reloadDataTree");
            }
          });
      }
      // selected(datas){
      //     console.log('222222222'+datas)
      // }
    }
}
</script>

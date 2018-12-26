<template>
  <div>
    <Modal
      v-model="value"
      :closable="false"
      title="编辑"
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <Button type="primary" @click="changeMode({id: -1, mode: 'add'})" ghost>新增产品</Button>
      <BrowsePane @changeMode="changeMode"></BrowsePane>
      <AddPane v-if="idAndMode.mode==='add'" :idAndMode="idAndMode" @completed="onCompleted"></AddPane>
      <AttrsEditPane v-if="idAndMode.mode==='attrs-edit'" :idAndMode="idAndMode" @completed="onCompleted"></AttrsEditPane>
      <RenamePane v-if="idAndMode.mode==='rename'" :idAndMode="idAndMode" @completed="onCompleted"></RenamePane>
      <DeleteNode v-if="idAndMode.mode==='delete'" :idAndMode="idAndMode" @completed="onCompleted"></DeleteNode>
      <div slot="footer">
        <Button type="error" size="large" @click="close" ghost>关闭</Button>
        <!-- <Button v-if="allow===true" type="primary" size="large" @click="ok">确定</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import BrowsePane from "@/components/data-tree-edit/BrowsePane.vue";
import { mapState, mapActions } from "vuex";
import store from "@/store.js";
import Router from "vue-router";
import AddPane from "@/components/data-tree-edit/AddPane.vue";
import AttrsEditPane from "@/components/data-tree-edit/AttrsEditPane.vue";
import RenamePane from "@/components/data-tree-edit/RenamePane.vue";
import DeleteNode from "@/components/data-tree-edit/DeleteNode.vue";
export default {
  components: { BrowsePane,AddPane,AttrsEditPane,RenamePane,DeleteNode },
  inject: ["reload"],
  props:{value:Boolean},
  data() {
    var s = this
    debugger
    return {
      show: this.value,
      idAndMode: {

      }
      //allow:this.$store.dispatch('changeAllow')
    };
  },
  computed: {
    // ...mapState({
    //   allow: "allow"
    // })
  },
  methods: {
    close: function(){
      this.$emit("input", false)
    },
    changeMode: function({id, mode}) {
      debugger
      console.log(`id=${id} mode=${mode}`)
      this.idAndMode = {
        id: id,
        mode:mode
      }
    },
    onCompleted: function() {
      this.reloadDataTree() //完成后会从新加载数据
      this.changeMode({mode: 'browse'})
    },
    ...mapActions(["reloadDataTree"])
  }
};
</script>
<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
    min-width: 45%;
    overflow-x: auto;
    overflow-y: auto;
  }
}
</style>

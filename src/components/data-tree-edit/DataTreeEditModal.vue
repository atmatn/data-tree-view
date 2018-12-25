<template>
  <div>
    <Modal
      v-model="value"
      :closable="false"
      title="编辑"
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <BrowsePane @changeMode="changeMode"></BrowsePane>
      <AddPane v-if="idAndMode.mode==='add'" :idAndMode="idAndMode" @completed="changeMode({mode: 'browse'})"></AddPane><!--添加功能组件-->
      <div slot="footer">
        <Button type="text" size="large" @click="close">关闭</Button>
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
export default {
  components: { BrowsePane,AddPane },
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
    ...mapState({
      allow: "allow"
    })
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

    }
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

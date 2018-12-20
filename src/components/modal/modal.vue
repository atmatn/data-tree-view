<template>
  <div>
    <Button type="primary" @click="modal1 = true">编辑模式</Button>
    <Modal
      v-model="modal1"
      :closable="false"
      title="编辑"
      :mask-closable="false"
      class-name="vertical-center-modal"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <edits></edits>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import edits from "@/components/modal/edit.vue";
import { mapState, mapActions } from "vuex";
import store from "@/store.js";
import Router from "vue-router";
export default {
  components: { edits },
  inject: ["reload"],
  data() {
    return {
      modal1: false
      //allow:this.$store.dispatch('changeAllow')
    };
  },
  computed: {
    ...mapState({
      allow: "allow"
    })
  },
  methods: {
    ok() {
      if (this.allow === true) {
        this.$Message.info("点击了保存");
        this.modal1 = false;
        //this.$router.go(0);
        this.$store.commit("updateAllow", { status: false });
        this.reload();
      }
    },
    cancel() {
      // if(this.allow === true){
      this.$Message.info("点击了取消");
      this.modal1 = false;
      this.reload();
      // }
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

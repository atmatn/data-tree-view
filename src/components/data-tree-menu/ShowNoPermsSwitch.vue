<template>
  <Row>
    <Col span="15">显示无权限的项:</Col>
    <Col span="9">
      <i-Switch class="form-inline" @on-change="changeWichToShow({status: !switchToShow})"/>
    </Col>
  </Row>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      switchToShow: "switchToShow"
    })
  },
  methods: {
    ...mapActions(["changeWichToShow"])
  }
};
</script>

<template>
  <Row>
    是否显示无执行权限的项:
    <i-Switch class="form-inline" @on-change="changeWichToShow({status: !wichToShow})"/>
  </Row>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed:{
          ...mapState({
      wichToShow: "wichToShow"
    })
        },
    methods: {
            ...mapActions(["changeWichToShow"])
        }
    }
</script>

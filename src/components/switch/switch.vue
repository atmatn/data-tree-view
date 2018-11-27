<template>
    <i-Switch class="form-inline" @on-change="changeWichToShow({status: !wichToShow})"/>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
        // data () {
        //     return {
        //         status: false
        //     }
        // },
    computed:{
          ...mapState({
      wichToShow: "wichToShow"
    })
        },
    methods: {
            // change (status) {
            //     this.$Message.info('是否显示无执行权限的项：' + status);
            // },
            ...mapActions(["changeWichToShow"])
        }
    }
</script>

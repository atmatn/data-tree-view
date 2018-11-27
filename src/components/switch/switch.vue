<template>
    <i-Switch class="form-inline" v-model="switch1" @on-change="change"/>
</template>
<script>
    export default {
        data () {
            return {
                switch1: false
            }
        },
        methods: {
            change (status) {
                this.$Message.info('是否显示无执行权限的项：' + status);
            }
        }
    }
</script>

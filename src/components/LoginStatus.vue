<template>
  <div class="login-status">
    用户: {{loginStatus.username}} <Tooltip content="登出"><a href="/logout"><Icon type="md-exit" /></a></Tooltip>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState(['loginStatus'])
  }
}
</script>

<style scoped lang="less">
.login-status{
  color: white;
}

</style>

<template>
  <div>
    Running script {{myScriptId}} with params {{myParams}}
    <div ref="content"></div>
    <Button @click="changeParam">Change Param</Button>
    <Button @click="doRun">Run</Button>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data : function() {
    debugger
    return {
        myScriptId: this.$store.state.currentScriptId,
        myParams: JSON.parse(JSON.stringify(this.$store.state.currentScriptParams))
    }
  },
  props: {
    scriptId: String,
    params: Object
  },
  beforeRouteEnter (to, from, next) {
    debugger
    //不能用this, 可以 next ( vm => {  vm是组件实例})
    // next( vm => {
    //   vm.myParams = JSON.parse(JSON.stringify(to.query))
    // })
    next()
  },
  beforeRouteLeave (to, from, next) {
    // debugger
    // next(false)
  },
  computed: {
    ...mapState(['currentScriptId','currentScriptParams'])
  },
  watch: {
    currentScriptId (val, oldVal) {
      //current script id changed
      console.log('current script id from ' + oldVal + ' to ' + val)
      // console.log(this.$route)
      this.myParams = JSON.parse(JSON.stringify(this.currentScriptParams))
      this.myScriptId = this.currentScriptId
      // 清空结果
      this.$refs.content.innerHTML('')
    }
  },
  methods: {
    ...mapActions(['updateScriptParams']),
    changeParam(){
      var x = Math.random()
      // 更新组件内参数
      this.myParams.param_a = x
    },
    doRun () {
      // 更新URL
      this.updateScriptParams({
        params: {
          ...this.myParams
        }
      });

      debugger
      // 假设下面的是结果
      this.$refs.content.innerText = '结果:' + this.myParams.param_a

    }
  }
}
</script>

<style>

</style>

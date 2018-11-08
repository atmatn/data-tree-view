<template>
  <div>
    Running script {{scriptId}} with params {{myParams}}
    <div ref="content"></div>
    <Button @click="changeParam">Change Param</Button>
    <Button @click="doRun">Run</Button>
  </div>

</template>

<script>
export default {
  data () {
    return {
        myParams: {}
    }
  },
  props: {
    scriptId: String,
    params: Object
  },
  beforeRouteEnter (to, from, next) {
    debugger
    //不能用this, 可以 next ( vm => {  vm是组件实例})
    next( vm => {
      vm.myParams = JSON.parse(JSON.stringify(to.query))
    })
  },
  beforeRouteLeave (to, from, next) {
    debugger
    next(false)
  },
  methods: {
    changeParam(){
      var x = Math.random()
      // 更新参数
      this.myParams.param_a = x
    },
    doRun () {
      // 更新URL
      this.$router.push({
        name: 'run-script',
        query: {
          param_a: this.myParams.param_a,
          param_b: this.myParams.param_b
        }
      })

      debugger
      // 假设下面的是结果
      this.$refs.content.innerText = '结果:' + this.myParams.param_a

    }
  }
}
</script>

<style>

</style>

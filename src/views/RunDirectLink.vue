<template>
  <div>
    <div v-if="urlAndMode.mode === 'iframe'">
      <iframe :src="urlAndMode.url" class="my-iframe"></iframe>
    </div>
    <div v-if="urlAndMode.mode === 'new-window'">
      已在新窗口打开链接：<a :href="urlAndMode.url">{{urlAndMode.url}}</a>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      urlAndMode: {
        url: '',
        mode: 'iframe'
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('calling: beforeRouteEnter')
    next( vm => {
      // debugger
      vm.reload()
    })
  },
  beforeRouteUpdate (to, from, next) {
    console.log('calling: before route update')
    if (to.params.noReload) {
      // 不用reload
      console.log('do not reload')
      next()
    } else {
      console.log('do reload')
      next()
      this.reload()
    }
  },
  methods: {
    reload: function() {
      this.urlAndMode = {
        url : this.$route.query.url,
        mode : this.$route.query.mode
      }
      if (this.urlAndMode.mode === 'new-window') {
        // debugger
        window.open(this.urlAndMode.url)
      }
    }
  }
}
</script>

<style>
  .my-iframe {
    width: 100%;
    min-height: 85vh;
  }
</style>

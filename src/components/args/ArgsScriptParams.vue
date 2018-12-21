<template>
  <div class="args-input-area">
    <!-- {{argDefs}} -->
    <template v-for="(argDef, idx) in argDefs">
      <ArgItem :value="argDef"></ArgItem>
    </template>
  </div>
</template>

<script>
import ArgItem from './ArgItem.vue'

export default {
  components: {
    ArgItem
  },
  name: 'ArgsScriptParams',
  data: function () {
    return {

    }
  },
  props: {
    argDefs: {
      type: Array
    }
  }
}
</script>

<style lang="less">
.args-input-area {
  display: flex;
  flex-wrap: wrap;
}

</style>

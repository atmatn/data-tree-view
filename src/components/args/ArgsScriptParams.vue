<template>
  <div>
    {{argDefs}}
    <div v-for="(argDef,idx) in argDefs" v-bind:key="idx">
      <ArgItem :value="argDef"></ArgItem>
    </div>
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

<style>

</style>

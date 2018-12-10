<template>
  <div>
    {{argDefs}}
    <div v-for="(argDef,idx) in argDefs" v-bind:key="idx">
      <component v-bind:is="argDef.type" :value="argDef"></component>
      <!-- <d-a-t-e_-r-a-n-g-e v-bind:value="argDef"></d-a-t-e_-r-a-n-g-e> -->
    </div>
  </div>
</template>

<script>
import DateRange from './DateRange.vue'
import ArgString from './ArgString.vue'


export default {
  components: {
    'DATE_RANGE': DateRange,
    'STRING': ArgString
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

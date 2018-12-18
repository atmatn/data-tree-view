<template>
  <span>
    <prompt v-model="value"></prompt>
    <i-select multiple :value="value.val || []" @on-change="onChange" style="width: 200px">
      <i-option v-for="item in getListFromMeta(value.meta)" :value="item" :key="item">{{ item }}</i-option>
    </i-select>
  </span>
</template>

<script>
import { getListFromMeta } from '@/lib/util.js'
import Prompt from './Prompt.vue'
export default {
  name: 'ArgMultiChoice',
  components: {
    Prompt
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  methods: {
    onChange: function(v) {
      this.value.val = v
    },
    getListFromMeta
  },
  watch: {
    // value: function(v){
    //     console.log("mod: " + v);
    //     this.$emit("input", v);
    // }
  }
}
</script>

<style>
</style>

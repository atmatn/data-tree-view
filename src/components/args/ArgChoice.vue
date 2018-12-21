<template>
  <span class="choice-area">
    <prompt v-model="value"></prompt>
    <i-select filterable v-model="value.val" style="width: 200px">
      <i-option v-for="(item,idx) in getListFromMeta(value.meta)" :value="item" v-bind:key="idx">{{ item }}</i-option>
    </i-select>
    <i-button class="reset-button" v-if="value.optional && value.val" @click="value.val = ''">清除</i-button>
  </span>
</template>

<script>
import { getListFromMeta } from '@/lib/util.js'
import Prompt from './Prompt.vue'
export default {
  name: "ArgChoice",
  components: {
    Prompt
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  watch: {
    // value: function(v){
    //     console.log("mod: " + v);
    //     this.$emit("input", v);
    // }
  },
  methods: {
    getListFromMeta
  }
};
</script>

<style>
</style>

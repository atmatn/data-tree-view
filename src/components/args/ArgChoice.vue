<template>
  <span class="choice-area">
    <!-- <div>{{value}}</div> -->
    <prompt v-model="value"></prompt>
    <Select filterable :value="value.val" @input="onSelectChange" style="width: 200px">
      <Option v-for="(item,idx) in valList" :value="item" v-bind:key="idx">{{ item }}</Option>
    </Select>
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
  data: function(){
    let valList = getListFromMeta(this.value.meta)
    return {
      valList : valList
    }
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  watch: {
    // 'value.val': function(v) {
    //   if( v === undefined) {
    //     debugger
    //   }
    //   console.log("value.val: " + JSON.stringify(v) + " this.valList = " + JSON.stringify(this.valList))
    // },
    'value.meta': {
      handler: function(v){
        // console.log("value.meta: " + JSON.stringify(v));
        this.valList = getListFromMeta(this.value.meta)
        // this.$emit("input", v);
      },
      immediate: false
    }
  },
  methods: {
    onSelectChange: function(x){
      // 如果是undefined，不往外送（很奇怪，不知道谁给设的。。。）
      if( x !== undefined) {
        this.value.val = x
      }
    },
    getListFromMeta
  }
}
</script>

<style>
</style>

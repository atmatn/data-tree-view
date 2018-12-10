<template>
  <span>
    <prompt v-model="value"></prompt>
    <i-switch v-model="value.val" style="width: 50px"></i-switch>
  </span>
</template>

<script>
import Prompt from './Prompt.vue'
export default {
  name: 'ArgBool',
  components: {
    Prompt
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  watch: {}
};
</script>

<style>
</style>

<template>
  <h1>页面不存在！{{moreMsg}}</h1>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    moreMsg: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style>

</style>

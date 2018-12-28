<template>
  <div>
    <Button type="info" @click="onClick">从链接快速添加</Button>
    <Modal v-model="showModal" @on-ok="onOk">
      <div>请输入URL: <Input v-model="url"/></div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
const Url = require('url-parse')
const queryString = require('query-string')

export default {
  data() {
    return {
      showModal : false,
      url: ''
    }
  },
  props: {
    refAttrs: Array
  },
  methods: {
    onClick() {
      this.url = 'http://analyzer2.corp.youdao.com/run-script.html?scriptId=remain_general_ng&product=%E7%B2%BE%E5%93%81%E8%AF%BEandroid%E7%AB%AF&expireStrategy=120%E5%A4%A9%E8%BF%87%E6%9C%9F&N=1&vendor=xiaomi&vendor_expand='
      this.showModal = true
    },
    onOk(){
      debugger
      const parsedUrl = new Url(this.url)
      const parsedQuery = queryString.parse(parsedUrl.query)
      const scriptId = parsedQuery.scriptId
      delete parsedQuery.scriptId
      this.refAttrs.find(x=>x.type === 'script_id').attrVal = scriptId
      this.refAttrs.find(x=>x.type === 'script_params').attrVal = parsedQuery
      axios
        .request({
          url: "/api/args-script/single",
          method: "GET",
          params: {
            id: scriptId
          }
        })
        .then(res => {
          this.$emit('setTitle', res.data.title)
        })
    }
  }
}
</script>

<style>

</style>

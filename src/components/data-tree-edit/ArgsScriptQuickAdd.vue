<template>
  <div>
    <Button type="info" @click="onClick">从链接快速添加 args-script</Button>
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
    refAttrs: Array,
    newNodeType: String
  },
  methods: {
    onClick () {
      this.url = ''
      this.showModal = true
    },
    onOk (){
      const parsedUrl = new Url(this.url)
      const parsedQuery = queryString.parse(parsedUrl.query)
      const scriptId = parsedQuery.scriptId
      if(scriptId !== undefined) {
        axios
        .request({
          url: "/api/args-script/single",
          method: "GET",
          params: {
            id: scriptId
          }
        })
        .then(res => {
          this.$emit('setNodeType', {
            type: 'args-script',
            done : () => {
              delete parsedQuery.scriptId
              this.refAttrs.find(x=>x.type === 'script_id').attrVal = scriptId
              this.refAttrs.find(x=>x.type === 'script_params').attrVal = parsedQuery
              this.$emit('setTitle', res.data.title)
            }
          })
        })
        .catch( err => {
          this.$Message.error({
              content: '您填写的URL不是args-script，已经为您调整为 direct-link',
              duration: 10,
              closable: true
          })
          this.$emit('setNodeType', {
            type: 'direct-link',
            done : () => {
              debugger
              this.refAttrs.find(x=>x.type === 'url').attrVal = this.url

              axios.request({
                url: '/api/custom-script/title',
                method: 'get',
                params: {
                  id: scriptId
                }
              }).then( res => {
                this.$emit('setTitle', res.data.title)
              }).catch(err => {
                this.$emit('setTitle', scriptId)
              })


            }
          })
        })
      } else {
        this.$Message.error({
            content: '所填URL不包含scriptId，添加失败！',
            duration: 10,
            closable: true
        });
      }
    }
  }
}
</script>

<style>

</style>

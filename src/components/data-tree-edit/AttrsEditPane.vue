<template>
  <div>
    <AttrsEdit v-model="nodeAttrs"></AttrsEdit>
  </div>
</template>

<script>
import axios from 'axios'
import AttrsEdit from '_c/data-tree-edit/AttrsEdit.vue'
export default {
  components: {
    AttrsEdit
  },
  data: function(){
    return {
      nodeAttrs: []
    }
  },
  props: ['mode', 'id', 'idAndMode'],
  watch: {
    idAndMode: {
      handler: function(newVal) {
        debugger
        let self = this
        if (newVal.mode === 'attrs-edit') {
          axios.request({
            url: '/api/data-tree/edit/get-attrs',
            method: 'post',
            data: {
              id: newVal.id
            }
          }).then( res => {
            this.nodeAttrs = res.data.attrs
          })
        }
      },
      immediate: true
    }
  },
}
</script>

<style>

</style>

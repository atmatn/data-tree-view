<template>
  <div>
    节点: {{nodeTitle}}
    <AttrsEdit v-model="nodeAttrs"></AttrsEdit>
    <Button @click="save()" type="primary">保存</Button>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import AttrsEdit from '_c/data-tree-edit/AttrsEdit.vue'
export default {
  components: {
    AttrsEdit
  },
  data: function(){
    return {
      nodeAttrs: [],
      nodeTitle: ''
    }
  },
  props: ['idAndMode'],
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
          // debugger
          this.getNodeTitle({id:newVal.id}).then( title => {
            this.nodeTitle = title
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getNodeTitle']),
    save: function (){
      axios.request({
        url: "/api/data-tree/edit/set-attrs",
        method: 'post',
        data: {
          id: this.idAndMode.id,
          attrs: this.nodeAttrs
        }
      }).then( res => {
        this.$emit('completed')
      })
    }
  }
}
</script>

<style>

</style>

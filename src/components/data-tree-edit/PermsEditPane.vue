<template>
  <div>
    <h3>管理权限</h3>
    <!-- {{permList}} -->
    节点：{{nodeTitle}}
    <PermsEdit v-model="permList"></PermsEdit>
    <Button @click="save()" type="primary">保存</Button>
  </div>
</template>

<script>
import axios from 'axios'
import PermsEdit from './PermsEdit.vue'
import { mapActions } from 'vuex'

export default {
components: {
    PermsEdit
  },
  props: ['idAndMode'],
  watch: {
    idAndMode: {
      handler: function(newVal) {
        // debugger
        let self = this
        if (newVal.mode === 'perms-edit') {
          axios.request({
            url: '/api/data-tree/edit/get-perms',
            method: 'post',
            data: {
              id: newVal.id
            }
          }).then( res => {
            this.permList = res.data.permList
          })
          this.getNodeTitle({id:newVal.id}).then( title => {
            this.nodeTitle = title
          })
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      permList: [],
      nodeTitle: ''
    }
  },
  methods: {
    ...mapActions(['getNodeTitle']),
    save: function() {
      axios
          .request({
            url: "/api/data-tree/edit/set-perms",
            method: "post",
            data: {
              id: this.idAndMode.id,
              permList: this.permList
            }
          })
          .then(res => {
            if (res.status !== 200) {
              this.$Message.error(JSON.stringify(res.data))
            } else {
              this.$emit('completed')
            }
          }).catch(err => {
            this.$Message.error(JSON.stringify(err))
          })
    }
  }
}
</script>

<style>

</style>

<template>
  <div class="browse-pane">
    <Scroll>
      <Tree :data="dataTreeNodes" :render="renderContent.bind(this)"></Tree>
    </Scroll>
    <!-- <h3>{{tips}}</h3> -->
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
//import forms from '@/components/form/form.vue'
import axios from 'axios'
export default {
  //components: { forms  },
  props: ['model','changeMode'],
  data() {
    return {
      // dataTreeNodes: this.$store.dispatch('reloadDataTree'),
      // tips: '欢迎来到编辑页面！',
      //addForm: '',
      //functions: '',
      oldPerms: [],
      //attrs: '',
      // param_a: [],
      // param_a_value: [],
      // param_b: [],
      // param_b_value: [],
      // permsList: this.$store.dispatch('reloadPermsList'),
      //buttonType: 'primary',
      id:'',//当前选中的node的id
      mode:''//要传递的类型
    }
  },
  computed: {
    ...mapState({
      allow: 'allow'
    }),
    ...mapState({
      allow2: 'allow2'
    }),
    ...mapState({
      dataTreeNodes: 'dataTreeNodes'
    }),
    ...mapState({
      allPermList: 'permsList'
    }),
    ...mapState({
      onSwitch: 'onSwitch'
    })
  },
  methods: {
    renderContent: function(h, { root, node, data }) {
      var self = this
      // debugger
      return h('span', [
        h('span', [
          data.currentUserVisible === false ||
          data.currentUserExecutable === false
            ? null
            : h('span', [
                h(
                  'Button',
                  {
                    props: {
                      type:
                        data.type === 'product'
                          ? 'primary'
                          : data.type === 'folder'
                          ? 'info'
                          : data.type === 'args-script'
                          ? 'success'
                          : data.type === 'direct-link'
                          ? 'warning'
                          : ''
                    }
                  },
                  data.title + ' '
                )
              ]),
          data.currentUserVisible === false
            ? null
            : data.type === 'product' || data.type === 'folder'
            ? h(
                'Button',
                {
                  props: { type: 'text' },
                  on: {
                    click: () => {
                      debugger
                      self.emitChangeMode(data.id, 'add')
                      // this.add(data)
                    }
                  },
                  style: { color: 'red' }
                },
                '新增'
              )
            : null,
          data.type !== 'product' &&
          data.type !== 'folder' &&
          data.containsExecutableForCurrentUser === true
            ? h(
                'Button',
                {
                  props: { type: 'text' },
                  on: {
                    click: () => {
                      self.emitChangeMode(data.id, 'copy')
                    }
                  },
                  style: { color: 'green' }
                },
                '复制'
              )
            : null,
          data.currentUserManageable === true
            ? h(
                'Button',
                {
                  props: { type: 'text' },
                  on: {
                    click: () => {
                      self.emitChangeMode(data.id, 'rename')
                      //this.rename(data)
                    }
                  },
                  style: { color: 'blue' }
                },
                '更名'
              )
            : null,
          data.currentUserManageable === true &&
          (data.children === undefined || data.children.length === 0)
            ? h(
                'Button',
                {
                  props: { type: 'text' },
                  on: {
                    click: () => {
                      self.emitChangeMode(data.id, 'delete')
                    }
                  },
                  style: { color: 'black' }
                },
                '删除'
              )
            : null,
          data.type !== 'product' && data.currentUserManageable === true
            ? h(
                'Button',
                {
                  props: { type: 'text' },
                  on: {
                    click: () => {
                      self.emitChangeMode(data.id, 'move')
                    }
                  },
                  style: { color: 'purple' }
                },
                '移动'
              )
            : null,
          data.currentUserManageable === true
            ? h(
                'Button',
                {
                  props: { type: 'text' },
                  on: {
                    click: () => {
                      // this.getPerms(data)
                      self.emitChangeMode(data.id, 'perms-edit')
                    }
                  },
                  style: { color: 'orange' }
                },
                '管理权限'
              )
            : null,
          data.type !== 'product' &&
          data.type !== 'folder' &&
          data.currentUserManageable === true
            ? h(
                'Button',
                {
                  props: { type: 'text' },
                  on: {
                    click: () => {
                      // this.getAttrs(data)
                      self.emitChangeMode(data.id, 'attrs-edit')
                    }
                  },
                  style: { color: 'pink' }
                },
                '设置属性'
              )
            : null,
          // data.type !== 'product' &&
          // data.type !== 'folder' &&
          data.currentUserManageable === true
            ? h(
                'Button',
                {
                  props: { type: 'default' },
                  on: {
                    click: () => {
                      this.up(data)
                    }
                  }
                },
                '↑'
              )
            : null,
          // data.type !== 'product' &&
          // data.type !== 'folder' &&
          data.currentUserManageable === true
            ? h(
                'Button',
                {
                  props: { type: 'default' },
                  on: {
                    click: () => {
                      this.down(data)
                    }
                  }
                },
                '↓'
              )
            : null
        ])
      ])
    },
    emitChangeMode: function(id, mode){
      debugger
      this.$emit('changeMode', {id, mode})
    },
    up(data) {
      axios
        .request({
          url: '/api/data-tree/edit/move-up',
          method: 'post',
          data: {
            id:data.id,
          }
        })
        .then(res => {
          if (res.status !== 200) {
            this.$Message.info('移动失败')
            this.success = '移动失败,请按F12打开控制台查看错误信息'
          } else {
            this.$Message.info('移动成功')
            this.success = '移动成功'
            this.$store.dispatch('reloadDataTree')
          }
        })
    },
    down(data) {
      axios
        .request({
          url: '/api/data-tree/edit/move-down',
          method: 'post',
          data: {
            id:data.id,
          }
        })
        .then(res => {
          if (res.status !== 200) {
            this.$Message.info('移动失败')
            this.success = '移动失败,请按F12打开控制台查看错误信息'
          } else {
            this.$Message.info('移动成功')
            this.success = '移动成功'
            this.$store.dispatch('reloadDataTree')
          }
        })
    }
  }
}
</script>

<style scoped>
.browse-pane {
  border-style: outset;
  border-width: 1px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>

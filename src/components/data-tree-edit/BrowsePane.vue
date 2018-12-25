<template>
  <div>
    <Scroll>
      <!-- <Button type="primary" ghost @click="addProduct()">添加新产品</Button> -->
      <Tree :data="dataTreeNodes" :render="renderContent.bind(this)"></Tree>
    </Scroll>
    <h3>{{tips}}</h3>
    <!-- <forms
      :model="addForm"
      v-model="model"
      :functions="functions"
      :oldPerms="oldPerms"
      :attrs="attrs"

      :param_a="this.param_a"
      :param_a_value="this.param_a_value"
      :param_b="this.param_b"
      :param_b_value="this.param_b_value"
    ></forms> -->
    <!-- <Add v-if="mode==='add'":id="id" ></Add> -->
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import forms from '@/components/form/form.vue'
import axios from 'axios'
export default {
  components: { forms  },
  props: ['model','changeMode'],
  data() {
    return {
      // dataTreeNodes: this.$store.dispatch('reloadDataTree'),
      tips: '欢迎来到编辑页面！',
      addForm: '',
      functions: '',
      oldPerms: [],
      attrs: '',
      param_a: [],
      param_a_value: [],
      param_b: [],
      param_b_value: [],
      // permsList: this.$store.dispatch('reloadPermsList'),
      buttonType: 'primary',
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
    //     ...mapState({
    //   param_a: "param_a"
    // }),
    //     ...mapState({
    //   param_a_value: "param_a_value"
    // })
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
                      this.copy(data)
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
                      this.rename(data)
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
                      this.delete(data)
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
                      this.move(data)
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
                      this.getPerms(data)
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
                      this.getAttrs(data)
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
    // add(data) {
    //   this.tips = '当前项:' + data.title + '-新增'
    //   this.addForm = data
    //   this.functions = 'add'
    //   this.attrs = []
    //   //console.log('21333333'+this.attrs)
    //   this.$store.commit('updateAllow', { status: false })
    //   //this.$store.commit("updateAllow2", { status: false });
    //   // this.$store.commit("updateParam_a", { status: '' });
    // },
    // addProduct() {
    //   this.tips = '添加新产品'
    //   this.addForm = ''
    //   this.functions = 'addProduct'
    //   this.$store.commit('updateAllow', { status: false })
    // },
    // rename(data) {
    //   this.tips = '当前项:' + data.title + '-更名'
    //   this.addForm = data
    //   this.functions = 'rename'
    //   this.$store.commit('updateAllow', { status: false })
    // },
    // delete(data) {
    //   this.tips = '当前项:' + data.title + '-删除'
    //   this.addForm = data
    //   this.functions = 'delete'
    //   this.$store.commit('updateAllow', { status: false })
    // },
    // move(data) {
    //   this.tips = '当前项:' + data.title + '-移动'
    //   this.addForm = data
    //   this.functions = 'move'
    //   this.$store.commit('updateAllow', { status: false })
    // },
    // copy(data) {
    //   this.tips = '当前项:' + data.title + '-复制'
    //   this.addForm = data
    //   this.functions = 'copy'
    //   this.$store.commit('updateAllow', { status: false })
    // },
    // getPerms(data) {
    //   this.$store.commit('updateOnSwitch', { status: false })
    //   this.tips = '当前项:' + data.title + '-管理权限'
    //   this.addForm = data
    //   this.functions = 'setPerms'
    //   console.log(this.$refs.param_a)
    //   this.perm = []
    //   axios
    //     .request({
    //       url: '/api/data-tree/edit/get-perms',
    //       method: 'post',
    //       data: {
    //         id: data.id
    //       }
    //     })
    //     .then(res => {
    //       if (
    //         res.data.permList !== null &&
    //         res.data.permList !== '' &&
    //         res.data.permList !== undefined
    //       ) {
    //         debugger
    //         //res.data.permList=Array.from(new Set(res.data.permList))
    //         // for (var i = 0; i < res.data.permList.length; i++) {
    //         //   // for (var j = 0; j < res.data.permList[i].perms.length; j++) {
    //         //     this.perm.push({
    //         //       value: res.data.permList[i].value,
    //         //       perms: res.data.permList[i].perms
    //         //     })
    //         //   // }
    //         // }
    //         //this.perm=Array.from(new Set(this.perm))
    //         this.oldPerms = res.data.permList
    //         console.log(this.perm)
    //         console.log('获取权限成功')
    //       } else {
    //         console.log('获取权限失败')
    //       }
    //     })
    //   this.$store.commit('updateAllow', { status: false })
    // },
    // getAttrs(data) {
    //   this.tips = '当前项:' + data.title + '-设置属性'
    //   this.addForm = data
    //   this.functions = 'setAttrs'
    //   this.param_a = []
    //   this.param_a_value = []
    //   this.param_b = []
    //   this.param_b_value = []
    //   axios
    //     .request({
    //       url: '/api/data-tree/edit/get-attrs',
    //       method: 'post',
    //       data: {
    //         id: data.id
    //       }
    //     })
    //     .then(res => {
    //       if (
    //         res.data.attrs !== null &&
    //         res.data.attrs !== '' &&
    //         res.data.attrs !== undefined
    //       ) {
    //         this.attrs = res.data.attrs
    //         console.log('获取属性成功')
    //       } else {
    //         console.log('获取属性失败')
    //       }
    //     })
    //   this.$store.commit('updateAllow', { status: false })
    //   this.$store.commit('updateAllow2', { status: false })
    // },
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

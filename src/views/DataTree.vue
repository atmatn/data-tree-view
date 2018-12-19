<template>
<div class="layout">
  <div>
    <Button @click="setShowDebug({val: false})">Hide Debug</Button><Button @click="setShowDebug({val: true})">Show Debug</Button>
  </div>
  <div v-show="showDebug" class="extra">
    <div>
      <router-link :to="{name: 'summary-query'}">明细查询工具</router-link>
      | <router-link :to="{name: 'exp-home'}">ExpHome</router-link>
    </div>
    <div>
      someData: <Input v-model="someData" style="width: 200px;"/>
      <Button @click="getSomeData">Get Some Data (ajax)</Button>
    </div>
    <div>
      someMsg: <Input v-model="someMsg" style="width: 200px;"/>
      <Button @click="changeSomeMsgInVuex">Change SomeMsg (random)</Button>
    </div>
    <div>
      data-tree-json: <Input type="textarea" :rows="4" v-bind:value="JSON.stringify(dataTreeNodes, null, 4)" style="width: 800px;"/>
      <Button @click="reloadDataTree">Reload Data Tree</Button>
    </div>
    <div>
      Add:
      <Button @click="testAddToFolderNode">Add DirectLink To Folder Node</Button>
      <Button @click="testAddToProductNode">Add DirectLink To Product Node</Button>
      <Button @click="testAddProductNode">Add Product Node</Button>
    </div>
    <div>
      Rename:
      <Button @click="testRenameProductNode">Rename Product Node</Button>
      <Button @click="testRenameFolderNode">Rename Folder Node</Button>
      <Button @click="testRenameLeafNode">Rename Leaf Node</Button>
      <Button @click="testMoveFolderNode">Move Folder Node</Button>
      <Button @click="testMoveLeafNode">Move Leaf Node</Button>
    </div>
    <div>
      Delete:
      <Button @click="testDeleteLeafNode">Delete Leaf Node</Button>
      <Button @click="testDeleteFolderNode">Delete Folder Node</Button>
      <Button @click="testDeleteProductNode">Delete Product Node</Button>
    </div>
    <div>
      Perms:
      <Input type="textarea" v-bind:value="permText" :rows="4" style="width: 800px;"/>
      <br/>
      get-perms
      <Button @click="testGetPerms(1)">Get Product Perms</Button>
      <Button @click="testGetPerms(15)">Get Folder Perms</Button>
      <Button @click="testGetPerms(16)">Get Leaf Perms</Button>
      <br/>
      set-perms
      <Button @click="testSetProductPerms">Set Product Perms</Button>
      <Button @click="testSetFolderPerms">Set Folder Perms</Button>
      <Button @click="testSetLeafPerms">Set Leaf Perms</Button>
      <br/>
      list-perms
      <Button @click="testListPerms">List Perms</Button>
    </div>
    <div>
      Copy: <Button @click="testCopyLeafNode">Copy Leaf Node</Button>
    </div>
    <div>
      Attrs:
      <Input type="textarea" v-bind:value="attrText" :rows="4" style="width: 800px;"/>
      <br/>
      <Button @click="testGetAttrs(16)">Get DirectLink Attrs</Button>
      <Button @click="testGetAttrs(8)">Get ArgsScript Attrs</Button>
      <Button @click="testSetDirectLinkAttrs">Set DirectLink Attrs</Button>
      <Button @click="testSetArgsScriptAttrs">Set ArgsScript Attrs</Button>
    </div>
    <div>
      Run Script (仅在“集成测试”模式有效):
      <router-link :to="{name: 'run-script', query: {'scriptId': 'bring_vendor_analyze', 'showConsumeByBringDay': true} }">bring_vendor_analyze</router-link>
      &nbsp;
      <router-link :to="{name: 'run-script', query: {'scriptId': 'attend_turn_rate', 'category_name': '高中'} }">attend_turn_rate</router-link>
      &nbsp;
      <router-link :to="{name: 'run-script', query: {'scriptId': 'outvendor_repurchase', 'category_name': '高中', 'course_type': '公开课', 'second_name': '安卓精品课APP'} }">outvendor_repurchase</router-link>
      &nbsp;
      <router-link :to="{name: 'run-script', query: {'scriptId': 'ke_kernel', 'category_name': '高中', 'course_type': '公开课', 'second_name': '安卓精品课APP'} }">outvendor_repurchase</router-link>
    </div>
  </div>
        <Layout>
            <Header>
            </Header>
            <Layout :style="{padding: '0 50px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Components</BreadcrumbItem>
                    <BreadcrumbItem>Layout</BreadcrumbItem>
                </Breadcrumb>
                <Content :style="{padding: '0 0', minHeight: '100%', background: '#fff'}">
                    <div v-show="showDebug" class="extra">
                      <Button @click="openScript({scriptId: '123', params: { 'param_a': '1', 'param_b': '2' }})">Open Script 123</Button>
                      <br/>
                      <Button @click="openScript({scriptId: '456', params: {'param_a': 4, 'param_b': 5 } })">Open Script 456</Button>
                    </div>
                    <Layout>
                        <Sider hide-trigger :style="{background: '#fff'}" :width="300">
                              <menuTree></menuTree>
                        </Sider>
                        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                            <router-view/>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
            <Footer class="layout-footer-center">2006-2018 &copy; Youdao</Footer>
        </Layout>
    </div>
</div>
</template>

<script>
import axios from 'axios'
// 参考：https://vuex.vuejs.org/zh/guide/state.html
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import menuTree from '@/components/menu/menuTree.vue'
// import {getDataTree} from '@/mock/index.js'

export default {
  components: {menuTree},
  beforeRouteEnter: function (to, from, next) {
    //debugger
    if( to.name == 'run-script' ) {
      next( function(vm) {
        vm.openScript({
          scriptId: to.query.scriptId,
          params: to.query,
        })
       // vm.$store.commit('updateTurnOn',{status:[to.query.title]})
        //vm.$store.commit('updateTurnLight',{status:'KPI数据'})
      })
    } else {
      next()
    }
  },
  methods: {

    // 较为直接的处理
    getSomeData: function () {
      axios.request({
        url: '/getWelcomeMsg',
        method: 'get'
      }).then( res => {
        this.someData = res.data.msg
      })
    },
    // 通过vuex的action间接处理状态
    ...mapActions(["setSomeMsg"]),
    changeSomeMsgInVuex () {
      this.setSomeMsg('hello ' + Math.round(Math.random() * 100))
    },
    // 通过vuex的处理openScript
    ...mapActions(["openScript"]),
    changeSomeMsgInVuex () {
      this.setSomeMsg('hello ' + Math.round(Math.random() * 100))
    },
    // 通过vuex的处理reload data tree
    ...mapActions(["reloadDataTree"]),
    ...mapActions(["setShowDebug"]),
    testAddToFolderNode () {
      axios.post('/api/data-tree/edit/add', {
        parentId: 15,
        type: 'direct-link',
        title: '新增1'
      })
    },
    testAddToProductNode () {
      axios.post('/api/data-tree/edit/add', {
        parentId: 1,
        type: 'folder',
        title: '新增2'
      })
    },
    testAddProductNode () {
      axios.post('/api/data-tree/edit/add', {
        parentId: -1,
        type: 'product',
        title: '新增3'
      })
    },
    testRenameProductNode () {
      axios.post('/api/data-tree/edit/rename', {
        id: 1,
        title: '更名1'
      })
    },
    testRenameFolderNode () {
      axios.post('/api/data-tree/edit/rename', {
        id: 15,
        title: '更名2'
      })
    },
    testRenameLeafNode () {
      axios.post('/api/data-tree/edit/rename', {
        id: 16,
        title: '更名3'
      })
    },
    testMoveFolderNode(){
      axios.post('/api/data-tree/edit/move', {
        id: 6,
        parentId: 15
      })
    },
    testMoveLeafNode(){
      axios.post('/api/data-tree/edit/move', {
        id: 16,
        parentId: 5
      })
    },
    testGetPerms(id){
      axios.post('/api/data-tree/edit/get-perms', {
        id: id
      }).then( res => {
        this.permText = JSON.stringify(res.data, null, 4)
      })
    },
    testSetProductPerms(){
      axios.post('/api/data-tree/edit/set-perms', {
        id: 1,
        permList: [
          {
            value: 'visiblePerms',
            perms: ['ke_general','new_perm_1']
          }
        ]
      })
    },
    testSetFolderPerms(){
      axios.post('/api/data-tree/edit/set-perms', {
        id: 15,
        permList: [
          {
            value: 'executablePerms',
            perms: ['ke_general','new_perm_2']
          }
        ]
      })
    },
    testSetLeafPerms(){
      axios.post('/api/data-tree/edit/set-perms', {
        id: 16,
        permList: [
          {
            value: 'executablePerms',
            perms: ['ke_general','new_perm_3']
          }
        ]
      })
    },
    testListPerms(){
      axios.post('/api/data-tree/edit/list-perms').then( res => {
        this.permText = JSON.stringify(res.data, null, 4)
      })
    },
    testCopyLeafNode(){
      axios.post('/api/data-tree/edit/copy', {
        id: 16,
        parentId: 5
      })
    },
    testGetAttrs(id){
      axios.post('/api/data-tree/edit/get-attrs', {
        id
      }).then( res => {
        this.attrText = JSON.stringify(res.data, null, 4)
      })
    },
    testSetDirectLinkAttrs(){
      axios.post('/api/data-tree/edit/set-attrs', {
        id: 16,
        attrs: [
          {
            attrKey: 'linkUrl',
            attrVal: 'http://www.youdao.com'
          }
        ]
      })
    },
    testSetArgsScriptAttrs(){
      axios.post('/api/data-tree/edit/set-attrs', {
        id: 8,
        attrs: [
          {
            attrKey: 'scriptId',
            attrVal: '456'
          },
          {
            attrKey: 'scriptParams',
            attrVal: '{"param_a": 10, "param_b": 100}'
          }
        ]
      })
    },
    testDeleteLeafNode() {
      axios.post('/api/data-tree/edit/delete', {
        id: 16
      })
    },
    testDeleteFolderNode() {
      axios.post('/api/data-tree/edit/delete', {
        id: 7
      })
    },
    testDeleteProductNode() {
      axios.post('/api/data-tree/edit/delete', {
        id: 3
      })
    }
  },
  computed: {
    ...mapState({
      someMsg: "someMsg",
      dataTreeNodes: "dataTreeNodes",
      showDebug: 'showDebug'
    })
  },
  data () {
    return {
      someData: "nothing",
      permText: '',
      attrText: ''
    }
  }
}
</script>

<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.layout-footer-center{
    text-align: center;
}
</style>

<style lang="less">
.extra {
    display: inline-block;
    border-style: solid;
    border-color: red;
    z-index: 10000;
    max-height: 600px;
    width: 90%;
    overflow: auto;
}
</style>

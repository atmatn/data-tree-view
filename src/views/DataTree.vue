<template>
<div class="layout">
  <!-- <Scroll height="1000"> -->
  <div>
    <Button @click="setShowDebug({val: false})">Hide Debug</Button><Button @click="setShowDebug({val: true})">Show Debug</Button>
  </div>
  <div v-show="showDebug" class="extra">
    <!-- {{indexMap}} -->
    <!-- xxx{{allPermsList}}yyy -->
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
      Move:
      <Button @click="testMoveUp(1)">testMoveUpProduct</Button>
      <Button @click="testMoveDown(1)">testMoveDownProduct</Button>
      <Button @click="testMoveUp(15)">testMoveUpFolder</Button>
      <Button @click="testMoveDown(15)">testMoveDownFolder</Button>
      <Button @click="testMoveUp(16)">testMoveUpLeaf</Button>
      <Button @click="testMoveDown(16)">testMoveDownLeaf</Button>
    </div>
    <!-- <div>
      <Input type="textarea" :rows="4" v-bind:value="nodeData" style="width: 800px;"/>
      Get Node: <Button @click="testGetNode(1)">testGetNode</Button>
    </div> -->
    <div>
      GetFlattenProductFolders:
      <Input type="textarea" v-bind:value="flattenProductFoldersText" :rows="4" style="width: 800px;"/>
      <Button @click="testGetFlattenProductFolders">testGetFlattenProductFolders</Button>
    </div>
    <div>
      DataTreeSearchList:
      <Input type="textarea" v-bind:value="dataTreeSearchListText" :rows="4" style="width: 800px;"/>
      <Button @click="testGetDataTreeSearchList">testGetDataTreeSearchList</Button>
    </div>
    <div>
      DataTreeAncestorIdList
      <Input type="textarea" v-bind:value="dataTreeAncestorIdListText" :rows="4" style="width: 800px;"/>
      <Button @click="testGetDataTreeAncestorIdList">testGetDataTreeAncestorIdList</Button>
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
              <div class="hdr"><div><h1><a href="/ui/data-tree/home">Analyzer2</a></h1> <a class="old-homepage-link" href="/overview.html">旧首页</a></div><CredentialWarning></CredentialWarning><CommonLink></CommonLink><LoginStatus></LoginStatus></div>
            </Header>
            <Layout :style="{padding: '0 50px', minHeight: '80vh'}">
                <!-- <Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Components</BreadcrumbItem>
                    <BreadcrumbItem>Layout</BreadcrumbItem>
                </Breadcrumb> -->
                <Content :style="{padding: '0 0', minHeight: '100%', background: '#fff'}">
                    <div v-show="showDebug" class="extra">
                      <Button @click="openScript({scriptId: '123', params: { 'param_a': '1', 'param_b': '2' }})">Open Script 123</Button>
                      <br/>
                      <Button @click="openScript({scriptId: '456', params: {'param_a': 4, 'param_b': 5 } })">Open Script 456</Button>
                    </div>
                    <Layout>
                        <Sider hide-trigger :style="{background: '#fff'}" :width="240" v-show="isCollapsed === false">
                              <menuTree></menuTree>
                              <Button type="primary" @click="doShowEditModal()">编辑模式</Button>
                              <DataTreeEditModal v-model="showEditModal"></DataTreeEditModal>
                        </Sider>
                        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                          <Button style="width:45px" @click="hiddenSider" size="small">
                              <Icon v-if="isCollapsed === true" type="ios-arrow-forward" size="small"/>
                              <Icon v-else="isCollapsed === false" type="ios-arrow-back" size="small"/>
                          </Button>
                              <router-view/>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
            <Footer class="layout-footer-center">2006-2018 &copy; Youdao</Footer>
        </Layout>
        <!-- </Scroll> -->
    </div>
</div>
</template>

<script>
import axios from 'axios'
// 参考：https://vuex.vuejs.org/zh/guide/state.html
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'
import MenuTree from '@/components/data-tree-menu/MenuTree.vue'
import DataTreeEditModal from "@/components/data-tree-edit/DataTreeEditModal.vue";
import CredentialWarning from "_c/CredentialWarning.vue"
import LoginStatus from '_c/LoginStatus.vue'
import CommonLink from '@/views/CommonLink.vue'
// import {getDataTree} from '@/mock/index.js'

// debugger


export default {
  components: {MenuTree,DataTreeEditModal,CredentialWarning,LoginStatus,CommonLink},
  beforeRouteEnter: function (to, from, next) {
    //debugger
    if( to.name == 'run-script' ) {
      next( function(vm) {
        vm.openScript({
          scriptId: to.query.scriptId,
          params: to.query,
        })
      })
    } else {
      next()
    }
  },
  mounted() {
  },
  methods: {
    hiddenSider(){
      this.isCollapsed=!this.isCollapsed
    },
    doShowEditModal () {
      // debugger
      this.showEditModal = true
    },
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
    ...mapActions(["getFlattenProductFolders"]),
    ...mapActions(["reloadDataTree"]),
    ...mapActions(["setShowDebug"]),
    ...mapActions(["getDataTreeSearchList"]),
    testGetDataTreeSearchList () {
      this.getDataTreeSearchList().then( res => {
        this.dataTreeSearchListText = JSON.stringify(res, null, 4)
      })
    },
    ...mapActions(["getDataTreeAncestorIdList"]),
    testGetDataTreeAncestorIdList () {
      this.getDataTreeAncestorIdList({id: 17}).then( res => {
        this.dataTreeAncestorIdListText = JSON.stringify(res, null, 4)
      })
    },
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
          },
          {
            value: 'manageablePerms',
            perms: ['mg_perm1']
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
          },
          {
            value: 'manageablePerms',
            perms: ['mg_perm2']
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
            perms: ['ke_general','new_perm_3'],
          },
          {
            value: 'manageablePerms',
            perms: ['mg_perm3']
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
    },
    testMoveUp(id){
      axios.post('/api/data-tree/edit/move-up', {
        id: id
      })
    },
    testMoveDown(id){
      axios.post('/api/data-tree/edit/move-down', {
        id: id
      })
    },
    testGetNode(id){
      axios.post('/api/data-tree/edit/get-node', {
        id: id
      }).then( res => {
        this.nodeData = JSON.stringify(res.data, null, 4)
      })
    },
    testGetFlattenProductFolders() {
      this.getFlattenProductFolders().then( res => {
        this.flattenProductFoldersText = JSON.stringify(res, null, 4)
      })
    }
  },
  computed: {
    ...mapState({
      someMsg: "someMsg",
      dataTreeNodes: "dataTreeNodes",
      showDebug: 'showDebug',
      allPermsList: 'permsList',
      indexMap: 'indexMap'
    })
  },
  data () {
    return {
      someData: "nothing",
      permText: '',
      attrText: '',
      showEditModal: false,
      nodeData: '',
      flattenProductFoldersText: '',
      dataTreeSearchListText: '',
      dataTreeAncestorIdListText: '',
      isCollapsed: false
    }
  }
}
// document.body.parentNode.style.overflow = "hidden";//禁用浏览器的滚动条
</script>

<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: auto;
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
.hdr {
  display: flex;
  justify-content: space-between;
}
.hdr h1 {
  display: inline-block;
  color: white;
  // width: 10em;
}
.old-homepage-link {
  margin-left: 1em;
}
</style>

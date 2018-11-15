<template>
<div class="layout">
  <div class="extra">
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
                    <div class="extra">
                      <Button @click="openScript({scriptId: '123', params: { 'param_a': '1', 'param_b': '2' }})">Open Script 123</Button>
                      <br/>
                      <Button @click="openScript({scriptId: '456', params: {'param_a': 4, 'param_b': 5 } })">Open Script 456</Button>
                    </div>
                    <Layout>
                        <Sider hide-trigger :style="{background: '#fff'}">
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
import menuTree from '@/menu/menuTree.vue'
// import {getDataTree} from '@/mock/index.js'

export default {
  components: {menuTree},
  beforeRouteEnter: function (to, from, next) {
    //debugger
    if( to.name == 'run-script' ) {
      next( function(vm) {
        vm.openScript({
          scriptId: to.query.scriptId,
          params: to.query
        })
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
    ...mapActions(["reloadDataTree"])
  },
  computed: {
    ...mapState({
      someMsg: "someMsg",
      dataTreeNodes: "dataTreeNodes"
    })
  },
  data () {
    return {
      someData: "nothing",
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
.extra {
    display: inline-block;
    border-style: solid;
    border-color: red;
    z-index: 10000;
}
</style>

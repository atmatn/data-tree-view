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
                <!--Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            Item 1
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                            Item 2
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="ios-analytics"></Icon>
                            Item 3
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="ios-paper"></Icon>
                            Item 4
                        </MenuItem>
                    </div>
                </Menu-->
            </Header>
            <Layout :style="{padding: '0 50px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Components</BreadcrumbItem>
                    <BreadcrumbItem>Layout</BreadcrumbItem>
                </Breadcrumb>
                <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
                    <div class="extra">
                      <Button @click="openScript({scriptId: '123', params: { 'param_a': '1', 'param_b': '2' }})">Open Script 123</Button>
                      <br/>
                      <Button @click="openScript({scriptId: '456', params: {'param_a': 4, 'param_b': 5 } })">Open Script 456</Button>
                    </div>
                    <Layout>
                        <Sider hide-trigger :style="{background: '#fff'}">
                            <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                                <Submenu name="1">
                                    <template slot="title">
                                        <Icon type="ios-navigate"></Icon>
                                        Item 1
                                    </template>
                                    <MenuItem name="1-1">Option 1</MenuItem>
                                    <MenuItem name="1-2">Option 2</MenuItem>
                                    <MenuItem name="1-3">Option 3</MenuItem>
                                </Submenu>
                                <Submenu name="2">
                                    <template slot="title">
                                        <Icon type="ios-keypad"></Icon>
                                        Item 2
                                    </template>
                                    <MenuItem name="2-1">Option 1</MenuItem>
                                    <MenuItem name="2-2">Option 2</MenuItem>
                                </Submenu>
                                <Submenu name="3">
                                    <template slot="title">
                                        <Icon type="ios-analytics"></Icon>
                                        Item 3
                                    </template>
                                    <MenuItem name="3-1">Option 1</MenuItem>
                                    <MenuItem name="3-2">Option 2</MenuItem>
                                </Submenu>
                            </Menu>
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

export default {
  beforeRouteEnter: function (to, from, next) {
    debugger
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
      someData: "nothing"
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

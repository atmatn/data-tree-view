<style scoped>
/* .layout{
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
} */
</style>
<template>
<div>
  <!-- xx -->
  <div v-for="(item, index) in list">
                    {{item}}
                  </div>
    <!-- <Layout>

    </Layout> -->
</div>
    <!-- <div class="layout">
        <Layout>
            <Header>

            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                  <div v-for="(item, index) in list">
                    {{item}}
                  </div>
                    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                        <Submenu v-for="item in list" :name="item">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                Item {{item}}
                            </template>
                            <MenuItem :name="item + '-1'">Option 1</MenuItem>
                            <MenuItem :name="item + '-2'">Option 2</MenuItem>
                            <MenuItem :name="item + '-3'">Option 3</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        Content
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div> -->
</template>
<script>
    export default {
      data: function(){
        let list = []
        for(var i=0; i<100; i++) {
          list.push('xxx-' + i)
        }
        return {
          list
        }
      }
    }
</script>

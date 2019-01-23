<template>
  <Dropdown trigger="click" style="margin-left: 20px" :transfer="true" @on-click="openLink($event)">
    <a>常用链接
      <Icon type="ios-arrow-down"></Icon>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem name="/demo-custom-script.html">自定义数据查询</DropdownItem>
      <DropdownItem name="https://note.youdao.com/coshare/index.html?token=49DEB787D4294D9083E8DC2739840971&gid=1419557#/">analyzer2帮助</DropdownItem>
      <DropdownItem name="/log-stream.html">实时日志流</DropdownItem>
      <DropdownItem name="/hive-async-query.html">Hive查询</DropdownItem>
      <DropdownItem name="http://yana.inner.youdao.com/#datasource=your-presto&engine=presto&tab=qlist">Presto查询</DropdownItem>
      <DropdownItem name="https://note.youdao.com/coshare/index.html?token=B05D6FC595E24CE08456A0165D4B57CA&gid=11904670#/">HIVE帮助</DropdownItem>
      <DropdownItem name="http://analyzer-wiki.corp.youdao.com/bin/view/Main/">数据分析WIKI</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
export default {
  methods:{
    openLink:function(event){
      //console.log(event)
      if(event.indexOf('http') == 0) {
        window.open(event)
      } else {
        window.open(window.location.origin + event)
      }
    }
  }
}
</script>


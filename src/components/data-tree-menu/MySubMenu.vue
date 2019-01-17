<template>
  <div v-if="model.type !== 'product'&&model.type !== 'folder'&&model.type ==='args-script'">
    <div v-if="model.currentUserExecutable=== false">
      <NoPermsMenuItem v-if="switchToShow" :model="model"></NoPermsMenuItem>
    </div>
    <div v-else>
      <MenuItem
        :name="model.id"
        :id="model.title"
        @click.native="openScript({scriptId: model.scriptId, params:model.scriptParams})"
      >{{model.title}}</MenuItem>
    </div>
  </div>
  <div v-else-if="model.type !== 'product'&&model.type !== 'folder'&&model.type ==='direct-link'">
    <div v-if="model.currentUserExecutable=== false">
      <NoPermsMenuItem v-if="switchToShow" :model="model"></NoPermsMenuItem>
    </div>
    <div v-else>
      <MenuItem :name="model.id" @click.native="onDirectLinkClick" :id="model.title">{{model.title}}</MenuItem>
    </div>
  </div>
  <div v-else>
    <div
      v-if="model.type !== 'product' && model.children !== undefined && model.children.length === 0"
    >
      <MenuItem :name="model.id">{{model.title}}（空目录）</MenuItem>
    </div>
    <div v-else>
      <div v-if="model.type=== 'product'&&model.currentUserVisible===false">
        <Submenu v-if="switchToShow===true" :name="model.id">
          <template
            v-if="model.children!==undefined&&model.children.length !== 0"
            slot="title"
          >{{model.title}}</template>
          <template v-else slot="title">
            <Poptip
              trigger="hover"
              :title="model.visiblePerms.length===0?'':'需要如下权限之一才能访问'"
              :content="model.visiblePerms.length===0?'该产品未设置访问权限,只有创建者能访问':model.visiblePerms.join(', ')"
              placement="right"
            >
              {{model.title}}
              <icon type="md-lock"/>
            </Poptip>
          </template>
          <div v-if="isFolder">
            <MySubMenu v-for="item in model.children" :model="item"></MySubMenu>
          </div>
        </Submenu>
      </div>
      <div v-else>
        <Submenu :name="model.id">
          <template
            v-if="model.children!==undefined&&model.children.length !== 0"
            slot="title"
          >{{model.title}}</template>
          <template v-else slot="title">{{model.title}}（空产品）</template>
          <div v-if="isFolder">
            <MySubMenu v-for="item in model.children" :model="item"></MySubMenu>
          </div>
        </Submenu>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import NoPermsMenuItem from '@/components/data-tree-menu/NoPermsMenuItem.vue'

export default {
  name: 'MySubMenu',
  props: ['model'],
  components: { NoPermsMenuItem },
  computed: {
    isFolder() {
      return this.model.children && this.model.children.length
    },
    ...mapState({
      switchToShow: 'switchToShow'
    })
  },
  methods: {
    onDirectLinkClick() {
      // window.open(this.model.linkUrl);
      // debugger
      let mode = this.model.openMode || 'iframe'
      this.openDirectLink({
        url: this.model.linkUrl,
        mode
      })
    },
    ...mapActions(['openScript', 'openDirectLink'])
  },
  data() {
    return {
      //openName:this.model.title
    }
  }
}
</script>

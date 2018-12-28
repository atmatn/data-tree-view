<template>
  <div>
    <h3>新增节点</h3>
    <!-- {{currentNodeType}} -> {{newNodeType}} -->
    <div>
      <div>
        <div v-if="currentNodeType !== 'root'">请选择要添加的类型:
          <RadioGroup v-model="newNodeType">
            <Radio v-if="currentNodeType==='product'|| currentNodeType ==='folder'" label="folder"/>
            <Radio v-if="currentNodeType==='folder'" label="direct-link"/>
            <Radio v-if="currentNodeType==='folder'" label="args-script"/>
          </RadioGroup>
          <template v-if="currentNodeType !== 'product'">
            <ArgsScriptQuickAdd class="hint" :refAttrs="newNodeAttrs" @setTitle="setTitle" @setNodeType="setNodeType"></ArgsScriptQuickAdd>
          </template>
        </div>
        <div v-if="newNodeType !== ''" >
          <br>名称：
          <Input v-model.trim="newNodeTitle" placeholder="请输入要添加的名称..." style="width: 300px"/>
        </div>
        <AttrsEdit v-model="newNodeAttrs"></AttrsEdit>
        <Button v-if="newNodeType !== ''" @click="save()" type="primary">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import AttrsEdit from '_c/data-tree-edit/AttrsEdit.vue'
import ArgsScriptQuickAdd from '_c/data-tree-edit/ArgsScriptQuickAdd.vue'
export default {
  components: {
    AttrsEdit,
    ArgsScriptQuickAdd
  },
  props: ['mode', 'id', 'idAndMode'],
  watch: {
    newNodeType: function(newVal) {
      debugger
      let self = this
      this.$store
        .dispatch('getTypeAttrsTemplate', { type: newVal })
        .then(tmpl => {
          self.newNodeAttrs = tmpl
          this.$nextTick( () => {
            if(this.newNodeTypeReadyCallback !== null ) {
              let callback = this.newNodeTypeReadyCallback
              this.newNodeTypeReadyCallback = null
              callback()
            }
          })
        })
    },
    idAndMode: {
      handler: function(newVal) {
        let self = this
        if (newVal.mode === 'add') {
          this.$store.dispatch('getNodeType', { id: newVal.id }).then(type => {
            self.currentNodeType = type
            if (type === 'root') {
              this.newNodeType = 'product'
            } else {
              this.newNodeType = ''
            }
          })
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      newNodeType: '',
      newNodeTitle: '',
      currentNodeType: '',
      newNodeAttrs: [],
      newNodeTypeReadyCallback: null
    }
  },
  methods: {
    setTitle: function(v){
      // debugger
      this.newNodeTitle = v
    },
    setNodeType: function({type, done}) {

      if( this.newNodeType === type) {
        // 不会调用watch，直接执行callback
        done()
      }else{
        this.newNodeTypeReadyCallback = done
        this.newNodeType = type
      }
    },
    save: function() {
      axios
        .request({
          url: '/api/data-tree/edit/add',
          method: 'post',
          data: {
            parentId: this.idAndMode.id,
            type: this.newNodeType,
            title: this.newNodeTitle
          }
        })
        .then(res => {
          if (res.status !== 200) {
            this.$Message.error(JSON.stringify(res.data))
          } else {
            if (this.newNodeAttrs.length > 0) {
              axios
                .request({
                  url: '/api/data-tree/edit/set-attrs',
                  method: 'post',
                  data: {
                    id: res.data.id,
                    attrs: this.newNodeAttrs
                  }
                })
                .then(res => {

                  this.$emit('completed')
                  this.$Message.info('添加成功')
                })
            } else {
              this.$emit('completed')
              this.$Message.info('添加成功')
            }
          }
        })
    }
  }
}
</script>

<style scoped lang="less">
.hint {
  display: inline-block;
}
</style>

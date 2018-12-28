<template>
  <div>
    <div v-for="(item, index) in paramsList">
      <div>
        参数名{{index+1}}：
        <Input placeholder="请输入要添加的参数名..." v-model.trim="item.paramName" style="width: 30%" @on-change="emitChange"/>
        参数值{{index+1}}：
        <Input placeholder="请输入要添加的参数值..." v-model.trim="item.paramValue" style="width: 30%" @on-change="emitChange"/>
        <Button class="del-button" @click="doRemove(index)">删除</Button>
      </div>
    </div>
    <Button @click="doAdd">添加参数</Button>
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data: function() {
    let list = this.transformToList()
    return {
      paramsList: list
    }
  },
  watch: {
    value: function(newVal){
      this.paramsList = this.transformToList()
    }
  },
  methods: {
    transformToList(){
      var list = []
      // debugger
      Object.keys(this.value).forEach(k => {
        list.push({
          paramName: k,
          paramValue: this.value[k]
        })
      })
      return list
    },
    doRemove(index) {
      this.paramsList.splice(index, 1)
      this.emitChange()
    },
    // wrapEmitChange: function(self){
    //   debugger
    //   this.emitChange()
    // },
    emitChange: function() {
      var scriptParams = {}
      this.paramsList.forEach(item => {
        if( item.paramName ==='' ){
          return
        }
        scriptParams[item.paramName] = item.paramValue
      })
      this.$emit('input', scriptParams)
    },
    doAdd: function() {
      // debugger
      this.paramsList.push({ paramName: '', paramValue: '' })
    }
  }
}
</script>

<style scoped>
  .del-button {
    display: inline-block;
    margin-left: 1em;
  }
</style>

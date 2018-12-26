<template>
  <div>
    <!-- value: {{value}}
    selected: {{selected}} -->
    <Select v-model="selected" style="width:200px" @on-change="onChange" clearable filterable>
      <OptionGroup v-for="item in this.arr" :label="item.product.title">
        <Option :value="item.product.id" label="/"></Option>
        <Option v-for="items in item.folders" :value="items.id" :label="'/ ' + items.title"></Option>
      </OptionGroup>
    </Select>
    <!-- 12123{{selected}} null {{typeof(selected)}} -->
  </div>
</template>
<script>
export default {
  props:['value'],
  data: function() {
    return {
      arr: [],
      folderList: this.$store.dispatch('getFlattenProductFolders').then(arr => {
        this.arr = arr
      }),
      selected: this.value
    }
  },
  methods:{
      onChange: function(){
        this.$emit("input", this.selected)
      }
  }
}
</script>

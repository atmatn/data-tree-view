<template>
  <div>
    <!-- value: {{value}}
    selected: {{selected}} -->
    <Select v-model="selected" style="width:200px" @on-change="onChange" clearable filterable>
      <OptionGroup v-for="item in flattenProductFolders" :label="item.product.title">
        <Option :value="item.product.id" label="/"></Option>
        <Option v-for="items in item.folders" :value="items.id" :label="'/ ' + items.title"></Option>
      </OptionGroup>
    </Select>
    <!-- 12123{{selected}} null {{typeof(selected)}} -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props:['value'],
  data: function() {
    return {
      selected: this.value
    }
  },
  methods:{
      onChange: function(){
        this.$emit("input", this.selected)
      }
  },
  computed: {
    ...mapState(['flattenProductFolders'])
  }
}
</script>

<template>
  <div>
    {{this.arr}}
    <Select v-model="this.selected" style="width:200px" filterable>
      <OptionGroup v-for="item in this.arr" :label="item.product.title">
        <Option v-for="items in item.folders" :value="items.title" :label="items.title"></Option>
      </OptionGroup>
    </Select>
  </div>
</template>
<script>
import axios from 'axios'
import store from '@/store.js'
export default {
  props: ['selected'],
  data() {
    return {
      arr: [],
      folderList: store.dispatch('getFlattenProductFolders').then(arr => {
        this.arr = arr
      })
    }
  }
}
</script>

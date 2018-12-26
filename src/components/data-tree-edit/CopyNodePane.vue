<template>
  <div>1.当前要复制的目标为:
    <span style="color:green">{{this.nodeTitle}}</span>
    <br>2.请选择要复制到哪一项里面：
    <!-- <Select v-model="onChange" style="width:200px" @on-change="changeVal(onChange)" filterable>
      <OptionGroup
        v-for="item in TreeNodes"
        v-if="item.currentUserVisible === true"
        :label="item.title"
      >
        <Option
          v-for="items in item.children"
          :value="items.id"
          :key="items.title"
        >{{ items.title }}</Option>
      </OptionGroup>
    </Select>-->
    <SelectNodePane v-model="selected"></SelectNodePane>
    <br>
    <Button @click="copys()" type="primary">复制</Button>
  </div>
</template>
<script>
import axios from 'axios'
import SelectNodePane from '@/components/data-tree-edit/SelectNodePane.vue'
export default {
  props: ['idAndMode'],
  components: { SelectNodePane },
  data() {
    return {
      nodeTitle: '',
      selected:[]
    }
  },
  watch: {
    idAndMode: {
      handler: function(newVal) {
        debugger
        let self = this
        if (newVal.mode === 'copy') {
          this.$store
            .dispatch('getNodeTitle', { id: newVal.id })
            .then(title => {
              self.nodeTitle = title
            })
          console.log('2333' + newVal)
        }
      },
      immediate: true
    }
  },
  methods: {
    copys() {}
  }
}
</script>

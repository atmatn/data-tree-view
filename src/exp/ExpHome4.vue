<template>
  <div>
    <div>
      <h2>ScriptParams</h2>
      {{scriptParams}}
      <ScriptParamsInput v-model="scriptParams"></ScriptParamsInput>
    </div>
    <div>
      <h2>AttrsEdit</h2>
      {{attrList}}
      <AttrsEdit v-model="attrList"></AttrsEdit>
      <Button @click="doChangeModel">change model</Button>
    </div>
    <div>
      <h2>PermsEdit</h2>
      {{permList}}
      <PermsEdit v-model="permList"></PermsEdit>
    </div>
    <div>
      <h2>SelectNode</h2>
      {{selected}}
      <SelectNode v-model="selected"></SelectNode>
    </div>
    <div>
      <h2>Select filterable</h2>
      <Select filterable>
        <OptionGroup :label="group1">
        <Option :value="'v1'" :label="'k1'"></Option>
        <Option :value="'v2'" :label="'k2'"></Option>
        <Option :value="'s2'" :label="'v2'"></Option>
      </OptionGroup>
      </Select>
    </div>
  </div>
</template>

<script>
import ScriptParamsInput from '_c/data-tree-edit/ScriptParamsInput.vue'
import AttrsEdit from '_c/data-tree-edit/AttrsEdit.vue'
import PermsEdit from '_c/data-tree-edit/PermsEdit.vue'
import SelectNode from '@/components/data-tree-edit/SelectNode.vue'
export default {
  components: {
    ScriptParamsInput,
    AttrsEdit,
    PermsEdit,
    SelectNode
  },
  data: function() {
    return {
      scriptParams: {
        p1: 'v1'
      },
      attrList: [
        {
          title: '脚本id',
          attrKey: 'scriptId',
          type: 'script_id',
          attrVal: 'xxx'
        },
        {
          title: '脚本参数',
          attrKey: 'scriptParams',
          type: 'script_params',
          attrVal: { xxx1: 'xxx1_value' }
        },
        {
          title: '目标url',
          attrKey: 'linkUrl',
          type: 'url',
          attrVal: 'http://xxx'
        }
      ],
      permList: [
        {"value": "executable_perms", "perms": ['ke_general'] },
        {"value": "visible_perms","perms":[ 'dict_general'] }
      ],
      selected: undefined
    }
  },
  methods: {
    doChangeModel() {
      this.attrList = [
        {
          title: '脚本idyyy',
          attrKey: 'scriptId',
          type: 'script_id',
          attrVal: 'yyy'
        },
        {
          title: '脚本参数yyy',
          attrKey: 'scriptParams',
          type: 'script_params',
          attrVal: { yyy1: 'yyy1_value', yyy2: 'yyy2_value' }
        },
        {
          title: '目标urlyyy',
          attrKey: 'linkUrl',
          type: 'url',
          attrVal: 'http://yyy'
        }
      ]
    }
  }
}
</script>

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
          attrVal: { xxx: 'xxx', xxx: 'xxx' }
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
  }
}
</script>

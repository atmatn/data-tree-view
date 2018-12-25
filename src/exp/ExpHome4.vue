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
  </div>
</template>

<script>
import ScriptParamsInput from '_c/data-tree-edit/ScriptParamsInput.vue'
import AttrsEdit from '_c/data-tree-edit/AttrsEdit.vue'
export default {
  components: {
    ScriptParamsInput,
    AttrsEdit
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
      ]
    }
  }
}
</script>

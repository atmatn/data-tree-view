<template>
  <div>
    <div v-for="item in value" v-bind:key="item.attrKey">
      <span>{{item.title}}</span>
      <template v-if="item.type === 'script_id'">
        <Input v-model.trim="item.attrVal"/>
      </template>
      <template v-if="item.type === 'script_params'">
        <ScriptParamsInput v-model="item.attrVal"/>
      </template>
      <template v-if="item.type === 'url'">
        <Input v-model.trim="item.attrVal"/>
      </template>
      <template v-if="item.type === 'open_url_mode'">
        <Select v-model="item.attrVal">
          <Option value="iframe">iframe</Option>
          <Option value="new-window">new-window</Option>
        </Select>
      </template>
    </div>
  </div>
</template>

<script>
import ScriptParamsInput from './ScriptParamsInput.vue'
export default {
  components: {
    ScriptParamsInput
  },
  props: {
    value: Array
  }
}
</script>

<style>

</style>

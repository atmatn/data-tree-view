<template>
  <div>
    <prompt v-model="value"></prompt>
    <AutoComplete
      :data="suggestList"
      @on-search="handleSearch"
      style="width: 200px;"
      v-model="value.val"
    ></AutoComplete>
  </div>
</template>

<script>
import Prompt from './Prompt.vue'
export default {
  name: 'ArgString',
  components: {
    Prompt
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      suggestList: []
    };
  },
  methods: {
    handleSearch: function(val) {
      var list = getListFromMeta(this.value.meta);
      var ret = [];
      if (list && list.length > 0) {
        ret = _.filter(list, function(x) {
          return x.toLowerCase().indexOf(val.toLowerCase()) >= 0;
        });
      }
      this.suggestList = ret;
    }
  },
  watch: {
    "value.val": function(v) {
      console.log("mod: " + v);
      this.value.val = v.trim();
      this.$emit("input", v.trim());
    }
  }
};
</script>

<style>
</style>

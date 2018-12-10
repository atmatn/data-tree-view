<template>
  <div>
    <span>
      <prompt v-model="value"></prompt>
      从
      <DatePicker :value="value.val && value.val.fromDate" type="date" @on-change="onChangeFrom" placeholder="选择日期" style="width: 200px"></DatePicker>
      至
      <DatePicker :value="value.val && value.val.toDate" type="date" @on-change="onChangeTo" placeholder="选择日期" style="width: 200px"></DatePicker>
    </span>
  </div>
</template>

<script>
import Prompt from './Prompt.vue'
export default {
  components: {
    Prompt
  },
  name: "ArgDateRange",
  data: function(){
    return {}
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  methods: {
    "onChangeFrom": function(v){
        // debugger;
        console.log("mod: " + v);
        // this.$emit("input", v);
        this.value.val.fromDate = v;
    },
    "onChangeTo": function(v){
        // debugger;
        console.log("mod: " + v);
        // this.$emit("input", v);
        // this.value.val =
        this.value.val.toDate= v;
    }
  }
}
</script>

<style>

</style>

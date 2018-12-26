<template>
  <div>
    <div v-for="(item, index) in value" v-bind:key="item.value">
      {{item.value}}
      <!-- item.perms: {{item.perms}} -->
      <Select v-model="item.perms" style="width:300px" multiple>
        <Option
          v-for="perm in allPermList"
          :value="perm.value"
          :key="perm.value"
        >{{perm.title}} ({{perm.value}})</Option>
      </Select>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: {
    value: Array
  },
  computed: {
    ...mapState({
      allPermList: "permsList"
    })
  },
  mounted: function () {
    console.log(this.allPermList)
  }
}
</script>

<style>

</style>

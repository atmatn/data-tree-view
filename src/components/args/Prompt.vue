<template>
  <span class="prompt">
    <span class="my-label">
      {{this.value.prompt}}
      <sup v-if="haveMsg()">
        <Tooltip :transfer="true" placement="right-end" v-bind:content="infoMsg()">
          <Icon color="black" type="ios-help-outline"></Icon>
        </Tooltip>
      </sup>
    </span>
  </span>
</template>

<script>
export default {
  name: "Prompt",
  props: {
    value: {
      type: Object,
      required: false
    },
    enableSqlHelp: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    haveMsg: function() {
      if (this.value.mode == "SQL" || this.value.help != "") {
        return true;
      } else {
        false;
      }
    },
    infoMsg: function() {
      var msg = [];
      if (this.value.help != "") {
        msg.push(this.value.help);
      } else {
        if (this.enableSqlHelp && this.value.mode == "SQL") {
          if (msg.length > 0) {
            msg.push("；");
          }
          msg.push("不填表示不做限制");
        }
      }
      return msg.join("");
    }
  }
};
</script>

<style lang="less">
.prompt {
}
.prompt .my-label {
  margin-right: 1em;
  min-width: 7em;
  display: inline-block;
  text-align: right;
}
</style>

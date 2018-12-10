<template>
  <div class="arg-list">
    <span>
      <prompt v-model="value"></prompt>
    </span>
    <span v-if="true">
      <span>
        <span v-for="(v, index) in value.val">
          <span @click="setEditing(index)" v-if="index != editingIndex" class="input-item">
            <span>{{value.val[index]}}</span>
            <span class="remove" @click="remove(index)">
              <Icon type="close-round"></Icon>
            </span>
          </span>
          <i-input
            @on-change="onChange(index)"
            class="editing-input-item"
            ref="in"
            size="small"
            @on-blur="setEditing(-1)"
            @on-enter="setEditing(-1)"
            v-model="value.val[index]"
            v-if="index == editingIndex"
          ></i-input>
        </span>
      </span>
      <i-button @click="addItem">添加</i-button>
    </span>
    <span v-bind:class="{'switcher-part': true, 'enabled-ta-mode': taMode}">启用文本模式
      <i-switch @on-change="switchMode" v-model="taMode"></i-switch>
    </span>
    <span v-if="taMode">
      <i-input type="textarea" @on-change="taChange" v-model="taVal" :rows="4"></i-input>
    </span>
  </div>
</template>

<script>
import Prompt from './Prompt.vue'
export default {
  name: 'ArgList',
  components: {
    Prompt
  },
  data: function() {
    return {
      editingIndex: -1,
      taMode: false,
      taVal: ""
    };
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  watch: {
    "value.val": function() {
      console.log("change to: " + JSON.stringify(this.value.val));
      this.taVal = this.value.val.join("\n");
    }
  },
  methods: {
    taChange: function() {
      console.log("newText: " + this.taVal);
      if (this.value.type == "INT_LIST") {
        var tempList = getList(this.taVal);
        var foundInvalid = false;
        this.value.val = _.filter(tempList, function(x) {
          var a = parseInt(x);
          if (isNaN(a)) {
            foundInvalid = true;
            return false;
          } else {
            return true;
          }
        });
        if (foundInvalid) {
          this.$Message.warning("您输入了非数字内容！");
        }
      } else {
        this.value.val = getList(this.taVal);
      }
    },
    switchMode: function(newMode) {
      console.log("newMode: " + newMode);
      // if( newMode == true) {
      //     this.taVal = this.value.val.join("\n");
      // }
    },
    onChange: function(index) {
      console.log("changed index=" + index);
      var v = this.value.val[index];
      if (this.value.type == "INT_LIST") {
        var s = "";
        for (var i = 0; i < v.length; i++) {
          if (v[i] >= "0" && v[i] <= "9") {
            s = s + v[i];
          }
        }
        if (s.length != v.length) {
          this.$Message.warning("您输入了非数字内容！");
        }
        this.value.val[index] = s;
        console.log("set to " + s);
      } else {
        this.value.val[index] = v.trim();
      }
      // debugger;
    },
    addItem: function() {
      this.value.val.push("");
      this.editingIndex = this.value.val.length - 1;
      this.goEdit(true);
    },
    setEditing: function(index) {
      if (index == -1) {
        var val = this.value.val;
        var newVals = _.filter(val, function(x) {
          return x.trim() != "";
        });
        this.value.val = newVals;
      }
      this.editingIndex = index;
      this.goEdit();
    },
    remove: function(index) {
      this.editingIndex = -1;
      this.value.val.splice(index, 1);
    },
    goEdit: function(selectAll) {
      var self = this;
      this.$nextTick(function() {
        // debugger;
        if (self.$refs.in && self.$refs.in.length > 0) {
          self.$refs.in[0].focus();
          // if( selectAll ) {
          //     this.$refs.in[0].select();
          // }
        }
      });
    }
  }
};
</script>

<style>
</style>

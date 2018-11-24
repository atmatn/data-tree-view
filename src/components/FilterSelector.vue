<template>
  <div>
    <div class="line_in1">
      <div class="h">请选择过滤条件</div>
      <div>
        <Input v-model="dimNameFilter" placeholder="搜索参数" style="width: 300px"/>
      </div>
    </div>

    <div class="dim-cat-part" v-for="dimCat in dimCatList" v-bind:key="dimCat.value">
      <div class="dim-cat-name">{{dimCat.value}}：</div>
      <div class="dim-cat-value-part">
        <span class="dim-cat-val"
          v-for="item in dimCat.dimList"
          v-if="item.indexOf(dimNameFilter.toLowerCase()) >= 0"
          v-bind:key="item">
          <a @click="dimClick(item)" class="dim-item">{{item}}</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSelector',
  props: {
    dimCatList: Array,
    dimList: Array
  },
  data : function () {
    return {
      dimNameFilter: '',

    }
  },
  methods: {
    dimClick: function (item) {
      console.log('clicked ' + item)
      this.$emit('dimClick', item)
    }
  }
}
</script>

<style scoped lang="less">
.line_in1 {
  display: flex;
  margin: 1em;
}
.dim-cat-part {
    display: inline-flex;
    width: 90%;
    margin-top: 0.5em;
  // border-bottom-style: solid;
  // border-bottom-width: 1px;
}
.dim-cat-name {
  display: inline-box;
  flex-basis: 15em;
  // width: 20em;
  margin-top: 5px;
  // border-style: solid;
  text-align: right;
  flex-shrink: 0;
}
.dim-cat-value-part {
  display: flex;
  // border-style: solid;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.dim-cat-value-part a:hover {
  color: red;
}
.dim-cat-val {
  display: inline-block;
  flex-basis: 5%;
  border-style: solid;
  border-width: 1px;
  border-color: lightgray;
  margin-left: 1em;
  margin-top: 5px;
  text-align: center;
}
</style>

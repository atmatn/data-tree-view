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
      <draggable class="dim-cat-value-part"  v-model="dimCat.dimList" :options="{group:'people'}"
          @end="datadragEnd($event, dimCat)">
            <transition-group>
                <div v-for="item in dimCat.dimList" :key="item" class = "drag-item dim-cat-val">
                    <a @click="dimClick(item)" class="dim-item">{{item}}</a>
                </div>
            </transition-group>
      </draggable>
      <!-- <div class="dim-cat-value-part">
        <span class="dim-cat-val"
          v-for="item in dimCat.dimList"
          v-if="item.indexOf(dimNameFilter.toLowerCase()) >= 0"
          v-bind:key="item">
          <a @click="dimClick(item)" class="dim-item">{{item}}</a>
        </span>
      </div> -->
    </div>

    <div><Button @click="addCat">添加分类</Button></div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'FilterSelector',
  components: {
    draggable
  },
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
    },
    datadragEnd (evt, dimCat) {
      debugger
      evt.preventDefault()
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.dimCatList)
   },
   addCat(){
     this.dimCatList.push({
       value: 'New Cat',
       dimList: []
     })
   }
  },
  mounted () {
    // 参考https://blog.csdn.net/zhaoxiang66/article/details/81003094
    // 为了防止火狐浏览器拖拽的时候以新标签打开
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
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
  border-bottom-style: solid;
  border-bottom-width: 1px;
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
  min-height: 1em;
  min-width: 10em;
  // border-style: solid;
  flex-wrap: wrap;
  justify-content: flex-start;
}
// vuedraggable在这里会自动生成一个span，把它变大方便拖入
.dim-cat-value-part>span{
  min-height: 1em;
  min-width: 10em;
  // border-style: solid;
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

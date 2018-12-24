<template>
  <div>
    <Row>
      <Col span="4">
        <Button type="primary">搜索</Button>
      </Col>
      <Col span="20">
        <Cascader
          v-model="onChange"
          :data="convertTree()"
          filterable
          :transfer="true"
          style="width:190px"
          ></Cascader>
      </Col>
    </Row>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import store from "@/store.js";

export default {
  data() {
    return {
      onChange: [],
      val: "",
      result:[],
      dataTreeNodes: this.$store.dispatch("reloadDataTree")
      //result: []
    };
  },
  computed: {
    ...mapState({
      TreeNodes: "dataTreeNodes"
    }),
    ...mapState({
      turnOn: "turnOn"
    }),
    ...mapState({
      turnLight: "turnLight"
    })
  },
  methods: {
    // changeVal(val){
    //   // @on-change="changeVal(val)"
    //   // if(this.onChange === undefined||this.onChange ===null){
    //   //   this.onChange=event;
    //   // }else{
    //     this.$store.commit('updateTurnOn',{status:[val.split(":")[0],val.split(":")[1]]})
    //     this.$store.commit('updateTurnLight',{status:val.split(":")[2]})
    //     //console.log('2333'+onChange)
    //  // }
    // },
    convertTree() {
    //   this.result=this.TreeNodes
    //   filterTree(tree)
    //   function filterTree(tree) {
    //   tree.filter((item) => {
    //      let {
    //         id: value,
    //         title: label,
    //         children:children
    //     } = item
    //      if (item.currentUserVisible===true) {
    //          return true
    //      } else if (item.children && item.children.length > 0) {
    //          item.children = filterTree(item.children)
    //          return item.children.length > 0
    //      } else {
    //          return false
    //      }
    // })
    //   }
    //   console.log(this.result)
      //return result
    }
  }
};
</script>

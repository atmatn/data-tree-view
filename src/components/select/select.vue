<template>
  <div>
    <Row>
      <Col span="4">
        <Button type="primary">搜索</Button>
      </Col>
      <Col span="20">
        <Cascader
          v-model="onChange"
          :data="convertTree(TreeNodes)"
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
      onChange: "",
      val: "",
      dataTreeNodes: this.$store.dispatch("reloadDataTree"),
      result: []
    };
  },
  created(){
      var result=[]
      TreeNodes=this.$store.dispatch("reloadDataTree")
      this.TreeNodes.forEach((item) => {
        if (item.currentUserVisible === true || item.currentUserExecutable === true) {
          let {
            id: value,
            title: label
          } = item
          if (item.children) {
            var children = item.children
            if (item.children.length !== 0) {
              console.log(item.children)
              children = Vue.commit('updateResult', children)
            }
          }
          result.push({
            value,
            label,
            children
          })
        }
      })
      console.log(result)
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
    convertTree(tree) {
      //  const result = []
      //   tree.forEach((item) => {
      //     if(item.currentUserVisible === true||item.currentUserExecutable===true){
      //   let {
      //       id: value,
      //       title: label,
      //       } = item
      //   if (item.children){
      //       var children=item.children
      //       if(item.children.length !==0){
      //         console.log(item.children)
      //            children = this.$options.methods.convertTree.bind(this)(children)
      //       }

      //   }
      //   //children = undefined?[]:children
      //   result.push({
      //       value,
      //       label,
      //       children
      //               })
      //         }
      //                 })
      //                 console.log(i+':'+result)
      //              return result
      //this.$store.commit("updateResult", { status: tree });
    }
  }
};
</script>

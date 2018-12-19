<template>
    <div>
      <Row><Col span='4'><Button type="primary">搜索</Button></Col>
      <Col span='20'>
      <!-- <Select v-model="onChange" style="width:190px" clearable filterable placement="bottom-end" :transfer="true">
      <OptionGroup v-for="item in TreeNodes"  v-if="item.currentUserVisible === true&&item.children!==undefined" :value="item.title" :label="item.title">
        <Option v-for="items in item.children" :value="items.title" :label="items.title">
        </Option>
      </OptionGroup>
    </Select> -->
     <Cascader v-model="onChange" :data="getVal()" filterable :transfer="true"></Cascader>
    </Col>
      </Row>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store.js'

export default {
  data(){
          return{
              onChange:'',
              val:'',
              dataTreeNodes:this.$store.dispatch('reloadDataTree'),
          }
        },
        computed:{
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
    methods:{
      changeVal(val){
        // @on-change="changeVal(val)"
        // if(this.onChange === undefined||this.onChange ===null){
        //   this.onChange=event;
        // }else{
          this.$store.commit('updateTurnOn',{status:[val.split(":")[0],val.split(":")[1]]})
          this.$store.commit('updateTurnLight',{status:val.split(":")[2]})
          //console.log('2333'+onChange)
       // }
      },
      getVal(){
         var val=this.TreeNodes;
         var a=true
        //  for(var i in val){
        //     console.log(val[i])
        //     while(a=true){
        //         if(val[i].children!=undefined&&val[i].children.length!=0){

        //         }else{
        //             a=false
        //             return
        //         }
        //     }
        //  }

      //   var keyMap = {
      //             "id" : "value",
      //             "title" : "label"
      //               };
      //  for(var i=0;i<val.length;i++){
      //    var result = val.map(o=>{return{value:o.id, label:o.title}});
      //     console.log(result);
      //  }
          return result
      }
    }
}
</script>

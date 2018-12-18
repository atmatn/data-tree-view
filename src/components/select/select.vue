<template>
    <div>
      <Row><Col span='6'><Button type="primary">搜索</Button></Col>
      <Col span='16'>
      <Select v-model="onChange" style="width:190px" clearable filterable placement="bottom-end" :transfer="true">
      <!-- <OptionGroup v-for="item in TreeNodes"  v-if="item.currentUserVisible === true" :value="item.title" :label="item.title">
      </OptionGroup> -->
    </Select>
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
              dataTreeNodes:this.$store.dispatch('reloadDataTree')
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
      }
    }
}
</script>

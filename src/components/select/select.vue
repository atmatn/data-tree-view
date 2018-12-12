<template>
    <div>
      <!-- <Input size="large" search enter-button placeholder="输入脚本关键字..."/> -->
      <Row><Col span='6'><Button type="primary">搜索</Button></Col>
      <Col span='16'>
      <Select v-model="onChange"style="width:190px"  @on-change="changeVal(onChange)" clearable filterable placement="bottom-end" :transfer="true">
      <OptionGroup  v-for="item in TreeNodes" v-if="item.currentUserVisible === true" :label="item.title">
        <Option v-for="items in item.children" :value="item.title+':'+items.title" :key="items.id">
          {{ items.title }}
          <Option v-if="itemss.currentUserExecutable === true" v-for="itemss in items.children" :value="item.title+':'+items.title+':'+itemss.title" :key="itemss.id">{{itemss.title}}</Option>
        </Option>
      </OptionGroup>
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
      changeVal(onChange){
          this.onChange=onChange.split(":")
          this.$store.commit('updateTurnOn',{status:[onChange.split(":")[0],onChange.split(":")[1]]})
          this.$store.commit('updateTurnLight',{status:this.onChange[2]})
           console.log('2333hh'+this.onChange)
          this.onChange=''
      }
    }
}
</script>

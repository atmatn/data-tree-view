<template>
  <div>
    <Row>
      <Col span="4">
        <Button type="primary">搜索</Button>
      </Col>
      <Col span="20">
        <Select
          v-model="bySelected"
          style="width:190px"
          @on-change="onChange"
          filterable
          clearable
          :transfer="true"
        >
          <OptionGroup v-for="item in dataTreeSearchList" :value="item.id" :label="item.product.title">
            <Option v-for="itemss in item.items" :value="itemss.id" :label="itemss.title"></Option>
          </OptionGroup>
        </Select>
      </Col>
    </Row>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
// import store from '@/store.js'

export default {
  data() {
    return {
      // onChange: [],
      // val: '',
      arr: [],
      bySelected: ''
    }
  },
  computed: {
    ...mapState({
      turnOn: 'turnOn',
      turnLight: 'turnLight',
      dataTreeSearchList: 'dataTreeSearchList'
    })
  },
  methods: {
    onChange() {
      //var nodeId = []
      if (
        this.bySelected !== null &&
        this.bySelected !== '' &&
        this.bySelected !== undefined
      ) {
        this.$store
          .dispatch('getDataTreeAncestorIdList', { id: this.bySelected })
          .then(arr => {
            if (arr.length === 1) {
              this.$store.commit('updateTurnOn', {
                status: [arr[0],this.bySelected]
              })
            } else {
              this.$store.commit('updateTurnOn', { status: arr })
            }
            this.$store.commit('updateTurnLight', { status: this.bySelected })
          })
      }
    }
  }
}
</script>

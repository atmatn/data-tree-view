<template>
  <div>
    <h1>数据源(general datasource)权限配置</h1>
    {{data}}
    <Table :columns="cols" :data="data">
      <template slot-scope="{ row, index }" slot="perms">
        <Select :value="data[index].perms" multiple @on-change="onChange(index, $event)">
           <!-- <Option v-for="item in availablePerms" :value="item.value" :key="item.value">{{ item.title }}</Option> -->
           <Option :value="'p1'" :key="'p1'">p1</Option>
           <Option :value="'p2'" :key="'p2'">p2</Option>
           <Option :value="'p3'" :key="'p3'">p3</Option>
           <Option :value="'p4'" :key="'p4'">p4</Option>
        </Select>
      </template>
    </Table>
  </div>
</template>

<script>
import { Select, Option } from 'iview'

export default {
  data: function() {
    let self = this
    return {
      data: [
        {
          ds: 'ds1',
          perms: ['p1','p2']
        },
        {
          ds: 'ds2',
          perms: ['p3','p4']
        }
      ],
      cols: [
        {title: 'ds', key: 'ds' },
        {
          title: 'perms',
          slot: 'perms'
        },
      ],
      availablePerms: [
        { title: 'p1', value: 'p1' },
        { title: 'p2', value: 'p2' },
        { title: 'p3', value: 'p3' },
        { title: 'p4', value: 'p4' },
      ]
    }
  },
  methods: {
    onChange: function(index, newVal) {
      // debugger
      this.data[index].perms = newVal
    }
  }
}
</script>

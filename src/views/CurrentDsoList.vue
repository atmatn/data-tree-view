<template>
  <div>
    <h1>明细数据源管理</h1>
    <Table :columns="cols" :data="data"></Table>
    <Button @click="toAdd">添加</Button>
    <Modal v-model="showAdd" @on-ok="addNewProduct">
      配置文件 （Product）
      <Select v-model="selectedNewProduct">
        <Option v-for="item in notAddedProductList" :value="item" v-bind:key="item">{{item}}</Option>
      </Select>
      分类（Category）
      <Select v-model="selectedNewProductCategory">
        <Option v-for="item in allCategory" :value="item" v-bind:key="item">{{item}}</Option>
      </Select>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import { Button, Option, Select } from 'iview'
export default {
  components: {
    Button
  },
  data : function () {
    let self = this
    return {
      allProductList: [],
      selectedNewProduct: '',
      selectedNewProductCategory: 'quick',
      showAdd: false,
      allCategory: ['quick','normal','prior','禁用'],
      cols: [
        {
          title: '配置文件 (Product)',
          key: 'product'
        },
        {
          title: '明细数据源表格名 (tblName)',
          key: 'tblName'
        },
        {
          title: '分类',
          key: 'category',
          render: (h, params) => {
            // debugger
            const items = self.allCategory.map((item, index) => {
              // return <Option value={'quick'}>{item}</Option>
              return h('Option',
              {
                props: {
                  value: item
                }
              }, item)
            })
            return (
              <span>
              <Select v-model={self.data[params.index].category} on-on-change={self.changeCategory.bind(this, self.data[params.index].product)}>
                {items}
              </Select>
              </span>
            )
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            // debugger
            return h('div', [
                h('Button', {
                    props: {
                        type: 'text',
                        size: 'small'
                    },
                    on: {
                      'click': self.deleteDso.bind(self, self.data[params.index].product)
                    }
                }, '删除')
            ]);
          }
        }
      ],
      data: []
    }
  },
  mounted: function () {
    this.reload()
    // this.data = [{
    //   'product': 'A',
    //   'category': 'quick'
    // }]
  },
  methods: {
    reload() {
      axios.request({
        url: '/api/current-dso-list/list-dso-products',
        method: 'GET'
      }).then( res => {
        this.data = res.data.dsoProductList
      })

      axios.request({
        url: '/api/current-dso-list/list-products',
        method: 'GET'
      }).then( res => {
        // debugger
        this.allProductList = res.data.productList
      })
    },
    deleteDso (product) {
      // debugger
      console.log('clicked delete')
      this.$Modal.confirm({
          title: '删除',
          content: `<p>确认要删除产品${product}吗？</p>`,
          onOk: () => {
              axios.request({
              method: 'post',
              url: '/api/current-dso-list/delete-dso',
              data: {
                product
              }
            }).then(res=>{
              this.$Message.info('已删除');
              this.reload()
            })
          },
          onCancel: () => {

          }
      });

    },
    changeCategory (product, cat) {
      console.log(`changed product ${product} to cat ${cat}`)
      axios.request({
        method: 'post',
        url: '/api/current-dso-list/change-category',
        data: {
          product,
          category: cat
        }
      }).then( res => {
        this.$Message.info('已修改分类')
        this.reload()
      })
    },
    addNewProduct () {
      console.log('add product: ' + this.selectedNewProduct)
      axios.request({
         method: 'post',
        url: '/api/current-dso-list/add-product',
        data: {
          product: this.selectedNewProduct,
          category: this.selectedNewProductCategory
        }
      }).then( res => {
        this.$Message.info('已添加Product')
        this.reload()
      })
    },
    toAdd () {
      this.selectedNewProduct = this.notAddedProductList.length > 0 ? this.notAddedProductList[0]: ''
      this.selectedNewProductCategory = 'quick'
      this.showAdd = true
    }
  },
  computed: {
    notAddedProductList: function() {
      var added = this.data.map(x => x.product)
      var ret = _.difference(this.allProductList, added)
      return ret
    }
  }
}
</script>

<style>

</style>

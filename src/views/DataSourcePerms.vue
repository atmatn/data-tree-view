<template>
  <div>
    <h1>数据源(general datasource)权限配置</h1>
    <!-- {{data}} -->
    <Table :columns="cols" :data="data">
      <template slot-scope="{ row, index }" slot="perms">
        <Select :value="row.perms" multiple @on-change="onChange(index, $event)">
          <Option
            v-for="item in availablePerms"
            :value="item.value"
            :key="item.value"
          >{{ item.title }}</Option>
        </Select>
      </template>
      <template slot-scope="{ row, index }" slot="actions">
        <Button @click="onDelete(index)">删除</Button>
      </template>
    </Table>
    <Button @click="onToAdd">新增</Button>
    <Modal v-model="showToAdd" @on-ok="addNewDsAndPerms">
      <h2>新增</h2>general DataSource
      <AutoComplete
        :data="matchedDataSources"
        @on-search="handleSearch"
        v-model="toAddNewDataSource"
      />权限
      <Select v-model="selectedNewPerms" multiple>
        <Option
          v-for="item in availablePerms"
          :value="item.value"
          v-bind:key="item.value"
        >{{item.title}}</Option>
      </Select>
    </Modal>
  </div>
</template>

<script>
import { Select, Option } from "iview";
import axios from "axios";
import _ from "underscore";

export default {
  data: function() {
    let self = this;
    return {
      selectedNewPerms: [], // 新增的dataSource对应的PERMS
      matchedDataSources: [], // 搜索提示列表
      toAddNewDataSource: "", // 新增的dataSource
      showToAdd: false, // 显示新增框
      availableDataSources: ["a", "aa", "b", "bb"], //
      data: [],
      cols: [
        { title: "数据源（general datasource）", key: "ds" },
        {
          title: "权限（perms）",
          slot: "perms"
        },
        {
          title: "操作",
          slot: "actions"
        }
      ],
      availablePerms: []
    };
  },
  mounted: function() {
    this.reload();
  },
  methods: {
    addNewDsAndPerms: function() {
      axios
        .request({
          url: "/api/ds-perms/add",
          method: "post",
          data: {
            ds: this.toAddNewDataSource,
            perms: this.selectedNewPerms
          }
        })
        .then(res => {
          // success
          this.reload();
        })
        .catch(err => {
          // fail
          // debugger;
          this.$Modal.error({
            title: "错误",
            content: err.response.data
          });
          this.reload();
        });
    },
    handleSearch: function(str) {
      var matchList = [];
      debugger;
      this.availableDataSources.map(x => {
        if (x.toLowerCase().indexOf(str) >= 0) {
          matchList.push(x);
        }
      });
      this.matchedDataSources = matchList;
    },
    onToAdd: function() {
      this.toAddNewDataSource = "";
      this.selectedNewPerms = [];
      this.showToAdd = true;
    },
    onDelete: function(index) {
      var ds = this.data[index].ds

      this.$Modal.confirm({
        title: "删除",
        content: `确认要删除 ${ds} 的权限配置吗？`,
        onOk: () => {
          axios
            .request({
              url: "/api/ds-perms/delete",
              method: "post",
              data: {
                ds: ds
              }
            })
            .then(res => {
              // success
              this.reload();
            })
            .catch(err => {
              // fail
              // debugger;
              this.$Modal.error({
                title: "错误",
                content: err.response.data
              });
              this.reload();
            });
        },
        onCancel: () => {}
      });
    },
    onChange: function(index, newVal) {
      function eq(a, b) {
        return a.length == b.length && _.difference(a, b).length == 0;
      }
      if (!eq(this.data[index].perms, newVal)) {
        this.data[index].perms = newVal;

        // send to server
        axios
          .request({
            url: "/api/ds-perms/set-perms",
            method: "post",
            data: {
              ds: this.data[index].ds,
              perms: newVal
            }
          })
          .then(res => {
            // success
          })
          .catch(err => {
            // fail
            debugger;
            this.$Modal.error({
              title: "错误",
              content: err.response.data
            });
            this.reload();
          });
      }
    },
    reload: function() {
      axios
        .request({
          url: "/api/ds-perms/all",
          method: "get"
        })
        .then(res => {
          // success
          this.data = res.data.dsPermsList;
        })
        .catch(err => {
          // fail
          debugger;
          this.$Modal.error({
            title: "错误",
            content: err.response.data
          });
        });
      axios
        .request({
          url: "/api/ds-perms/list-perms",
          method: "get"
        })
        .then(res => {
          // success
          this.availablePerms = res.data.perms;
        })
        .catch(err => {
          // fail
          debugger;
          this.$Modal.error({
            title: "错误",
            content: err.response.data
          });
        });
      axios
        .request({
          url: "/api/ds-perms/list-available-ds",
          method: "get"
        })
        .then(res => {
          // success
          this.availableDataSources = res.data.dsList;
        })
        .catch(err => {
          // fail
          debugger;
          this.$Modal.error({
            title: "错误",
            content: err.response.data
          });
        });
    }
  }
};
</script>

<style>
</style>

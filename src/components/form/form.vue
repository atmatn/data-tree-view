<template>
  <div>
    <Form v-if="functions==='add'&&allow===false" @submit.native.prevent>
      <formItem>请选择要添加的类型:
        <RadioGroup v-model="type" @on-change="getLabel($event)">
          <Radio v-if="model.type==='product'||model.type==='folder'" label="folder"/>
          <Radio v-if="model.type==='folder'" label="direct-link"/>
          <Radio v-if="model.type==='folder'" label="args-script"/>
        </RadioGroup>
        <br>
        <Input v-model.trim="itemName" placeholder="请输入要添加的名称..." style="width: 300px"/>
        <div
          v-if="type"
          style="color:green"
        >您当前选择了:{{this.type}}&nbsp;,&nbsp;parentId:{{model.id}}&nbsp;,&nbsp;itemName:{{this.itemName}}</div>
        <Input v-if="this.opens === 'direct-link'&&this.type==='direct-link'" placeholder="请输入要添加的链接..." v-model.trim="urls"/>
        <div v-if="this.opens === 'args-script'&&this.type==='args-script'">脚本id：
          <Input v-if="this.type==='args-script'" placeholder="请输入要添加的脚本id..." v-model.trim="scriptid" style="width: 300px"/>
          <br>
          <div v-for="(item,index) in this.args">
            <Row>
              参数名{{index+1}}：
              <Input
                placeholder="请输入要添加的参数名..."
                v-model.trim="param_b[index]"
                style="width: 250px"
              />
              参数值{{index+1}}：
              <Input
                placeholder="请输入要添加的参数值..."
                v-model.trim="param_b_value[index]"
                style="width: 250px"
              />
              <Button type="error" @click="delAttrs(index)">删除</Button>
            </Row>
            <br>
          </div>
        </div>
        <Button v-if="this.opens === 'args-script'" type="primary" @click="addAttrs()">添加参数</Button>
        <br>
        <Button @click="save()" type="primary">保存</Button>
      </formItem>
    </Form>
    <Form v-if="functions==='addProduct'&&allow===false" @submit.native.prevent>
      <formItem>
        请输入要添加的新产品名称：
        <input v-model.trim="productName">
      </formItem>
      <formItem>
        <Button type="primary" v-if="allow===false" @click="save()">添加产品</Button>
      </formItem>
    </Form>
    <Form v-if="functions==='rename'&&allow===false" @submit.native.prevent>
      <formItem>
        <Input v-model.trim="reName" :placeholder="model.title" style="width: 300px"/>
        <br>
        <Button v-if="allow===false" @click="rename()" type="primary">更改</Button>
      </formItem>
    </Form>
    <Form v-if="functions==='delete'&&allow===false" @submit.native.prevent>
      <formItem>
        确定要删除【{{model.title}}】吗？
        <Button v-if="allow===false" @click="deletes()" type="primary">确定</Button>
      </formItem>
    </Form>
    <Form v-if="functions==='move'&&allow===false" @submit.native.prevent>
      <formItem>
        <br>
        1.当前选择了：{{model.title}}
        <br>2.要移动到:
        <Select v-model="onChange" style="width:200px" @on-change="changeVal(onChange)" filterable>
          <OptionGroup
            v-for="item in TreeNodes"
            v-if="item.currentUserVisible === true"
            :label="item.title"
          >
            <Option
              v-for="items in item.children"
              :value="items.id"
              :key="items.title"
            >{{ items.title }}</Option>
          </OptionGroup>
        </Select>
        <br>
        <Button v-if="allow===false" @click="moves()" type="primary">移动</Button>
      </formItem>
    </Form>
    <Form v-if="functions==='copy'&&allow===false" @submit.native.prevent>
      <formItem>
        1.要复制的叶子节点:{{model.title}}
        <br>2.请选择要复制到哪一项里面：
        <Select v-model="onChange" style="width:200px" @on-change="changeVal(onChange)" filterable>
          <OptionGroup
            v-for="item in TreeNodes"
            v-if="item.currentUserVisible === true"
            :label="item.title"
          >
            <Option
              v-for="items in item.children"
              :value="items.id"
              :key="items.title"
            >{{ items.title }}</Option>
          </OptionGroup>
        </Select>
        <br>
        <br>
        <Button v-if="allow===false" @click="copys()" type="primary">复制</Button>
      </formItem>
    </Form>
    <Form v-if="functions==='setPerms'&&allow===false" @submit.native.prevent>
      <formItem>
        {{model.title}}的权限:
        <div v-for="item in this.perms">{{item.value}}:{{item.perms}}</div>
        <div
          v-if="model.currentUserExecutable!==undefind"
        >currentUserExecutable:{{model.currentUserExecutable}}</div>
        <div
          v-if="model.containsExecutableForCurrentUser!==undefind"
        >containsExecutableForCurrentUser:{{model.containsExecutableForCurrentUser}}</div>
        <div
          v-if="model.currentUserManageable!==undefind"
        >currentUserManageable:{{model.currentUserManageable}}</div>
        <br>
        <div v-if="!onSwitch">
          <Row>
            <Button @click="getParentPerms()" type="primary">继承父节点权限</Button>&nbsp;&nbsp;&nbsp;
            <Button @click="setSelfPerms()" type="primary">单独设置本节点权限</Button>
          </Row>
        </div>
        <div v-if="onSwitch">权限列表：
          <Select v-model="permSelected" style="width:300px">
            <Option
              v-for="perm in this.permsList"
              :value="perm.value"
              :key="perm.title"
            >{{perm.title}}:{{perm.value}}</Option>
          </Select>
          <br>
          <Button @click="setPerms()" type="primary">设置</Button>
        </div>
      </formItem>
    </Form>
        <Scroll v-if="functions ==='setAttrs'" >
    <Form v-if="functions==='setAttrs'&&allow2===false" ref="setAttrs" @submit.native.prevent>
      <formItem>
        {{model.title}}的属性:
        <div v-for="item in this.attrs">{{item.title}}:{{item.attrVal}}</div>
      </formItem>
      <formItem>
        <Input
          v-if="model.type === 'direct-link'"
          :placeholder="model.linkUrl"
          v-model.trim="urls"
        />
        <div v-if="model.type === 'args-script'&&allow2===false">脚本 id：
          <Input
            :placeholder="model.scriptId"
            v-model.trim="scriptid"
            v-if="allow===false"
            style="width: 300px"
            value="model.scriptId"
          />
          <br>
          <div v-for="(key,value,index) in model.scriptParams">
            <Row>
              参数名{{index+1}}：
              <Input :placeholder="value+''" v-model.trim="param_a[index]" style="width: 250px"/>
              参数值{{index+1}}：
              <Input
                :placeholder="key+''"
                v-model.trim="param_a_value[index]"
                style="width: 250px"
              />
              <Button type="error" @click="del4Attrs(model.scriptParams,value,index)">删除</Button>
            </Row>
            <br>
          </div>
        </div>
        <Button v-if="model.type==='args-script'&&allow===false"type="primary" @click="addAttrs(model.scriptParams)">添加参数</Button>
        <br>
        <Button type="primary" @click="setAttrs()">保存</Button>
      </formItem>
    </Form>
    <div v-if="allow===false" style="color:red">{{this.success}}</div>
    <div v-if="allow===true" style="color:green">{{this.success}}</div>
    </Scroll>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import store from "@/store.js";
import axios from "axios";
export default {
  props: ["model", "functions", "perms", "attrs", "permsList","param_a","param_a_value","param_b","param_b_value"],
  watch: {
    model: function(newVal, oldVal) {
      this.scriptid = newVal.scriptId;
      this.urls = newVal.linkUrl;
      this.reName = newVal.title;
      var i = 0;
      for (var key in newVal.scriptParams) {
        this.param_a[i] = key;
        this.param_a_value[i] = newVal.scriptParams[key];
        i++;
      }
    }
  },
  inject: ["reload"],
  data() {
    return {
      opens: "",
      args: new Array(0),
      i: 1,
      type: "",
      itemName: "",
      reName: "",
      success: "",
      productName: "",
      urls: "",
      scriptid: "",
      // param_a: [],
      // param_a_value: [],
      // param_b: [],
      // param_b_value: [],
      permSelected: "",
      dataTreeNodes: this.$store.dispatch("reloadDataTree"),
      onChange: ""
    };
  },
  computed: {
    ...mapState({
      allow: "allow"
    }),
    ...mapState({
      allow2: "allow2"
    }),
    ...mapState({
      TreeNodes: "dataTreeNodes"
    }),
    ...mapState({
      onSwitch: "onSwitch"
    })
  },
  methods: {
    getLabel(event) {
      this.opens = event;
    },
    addAttrs(something) {
      debugger
      if (something === "" || something === null || something === undefined) {
        this.args.push({ value: null });
      } else {
        this.$set(this.model.scriptParams, "空" + this.i, "空" + this.i);
        this.i += 1;
      }
    },
    delAttrs(index) {
      this.args.splice(index, 1);
      this.param_a_value.splice(index, 1);
      this.param_a.splice(index, 1);
    },
    del4Attrs(target, key, index) {
      this.$delete(target, key);
      this.param_a_value.splice(index, 1);
      this.param_a.splice(index, 1);
    },
    setSelfPerms() {
      this.$store.commit("updateOnSwitch", { status: !this.onSwitch });
    },
    getParentPerms() {},
    save() {
      if (this.productName !== null && this.productName !== "") {
        axios
          .request({
            url: "/api/data-tree/edit/add",
            method: "post",
            data: {
              parentId: -1,
              type: "product",
              title: this.productName
            }
          })
          .then(res => {
            if (res.status !== 200) {
              this.$store.commit("updateAllow", { status: false });
              this.$Message.info(res.status);
              this.success = "添加失败,请按F12打开控制台查看错误信息";
            } else {
              this.$Message.info("添加成功");
              this.success = "已添加";
              this.$store.commit("updateAllow", { status: true });
              this.productName = "";
              this.$store.dispatch("reloadDataTree"); //完成后会从新加载数据
            }
          });
      } else {
        if (
          this.type === "" ||
          (this.itemName === "" || this.itemName.length === 0)
        ) {
          this.$Message.info("未选择类型或输入的名称为空");
          this.success = "未选择类型或输入的名称为空";
          this.$store.commit("updateAllow", { status: false });
        } else {
          axios
            .request({
              url: "/api/data-tree/edit/add",
              method: "post",
              data: {
                parentId: this.model.id,
                type: this.type,
                title: this.itemName
              }
            })
            .then(res => {
              if (res.status !== 200) {
                this.$store.commit("updateAllow", { status: false });
                this.$Message.info(res.data.msg);
                this.success = "添加失败,请按F12打开控制台查看错误信息";
              } else {
                this.$Message.info("添加成功" + "id:" + res.data.id);
                this.success = "已添加";
                this.$store.commit("updateAllow", { status: true });
                this.type = "";
                this.itemName = "";
                var attr = {};
                if (this.opens === "direct-link") {
                  var attrLink = [{ attrKey: "linkUrl", attrVal: this.urls }];
                  attr = attrLink;
                } else {
                  if (this.opens === "direct-link") {
                         this.$store.commit("updateAllow2", { status: false });
                  }
                  //console.log('23333L'+this.param_b.length);
                  // if (
                  //   this.param_b.length !== 0 &&
                  //   this.param_b_value.length !== 0
                  // ) {
                    var attrVals = {};
                    for (var i = 0; i < this.param_b.length; i++) {
                      attrVals[this.param_b[i]] = this.param_b_value[i];
                    }
                    console.log('233'+attrVals)
                    if(this.scriptid===''){
                      var attrScript = [
                      { attrKey: "scriptId", attrVal: '' },
                      { attrKey: "scriptParams", attrVal: {'空':'空'} }
                    ];
                    }else if(this.scriptid!==''&&(attrVals==={}||attrVals===undefined)){
                      var attrScript = [
                      { attrKey: "scriptId", attrVal: this.scriptid },
                      { attrKey: "scriptParams", attrVal: {'空':'空'} }
                    ];
                    }else{
                    var attrScript = [
                      { attrKey: "scriptId", attrVal: this.scriptid },
                      { attrKey: "scriptParams", attrVal: attrVals }
                    ];
                    }
                    attr = attrScript;
                    console.log('233'+attrVals)
                  //}
                }
                axios
                  .request({
                    url: "/api/data-tree/edit/set-attrs",
                    method: "post",
                    data: {
                      id: res.data.id,
                      attrs: attr
                    }
                  })
                  .then(res => {
                    if (res.status !== 200) {
                      this.$Message.info("属性添加失败");
                      this.success =
                        "属性添加失败,请按F12打开控制台查看错误信息";
                      this.$store.commit("updateAllow", { status: false });
                    } else {
                      this.$Message.info("属性添加成功");
                      this.param_b = [];
                      this.param_b_value = [];
                      this.args = new Array(0);
                       this.$store.commit("updateAllow2", { status: true });
                    }
                  });
                this.$store.dispatch("reloadDataTree"); //完成后会从新加载数据
              }
            });
        }
      }
    },
    rename() {
      if (this.reName === "" || this.reName.length === 0) {
        this.$Message.info("输入的名称为空");
        this.success = "输入的名称为空";
        this.$store.commit("updateAllow", { status: false });
      } else {
        axios
          .request({
            url: "/api/data-tree/edit/rename",
            method: "post",
            data: {
              id: this.model.id,
              title: this.reName
            }
          })
          .then(res => {
            if (res.status === 200) {
              this.$Message.info("修改成功");
              this.success = "已修改";
              this.$store.commit("updateAllow", { status: true });
              this.reName = "";
              this.$store.dispatch("reloadDataTree");
            } else {
              this.$store.commit("updateAllow", { status: false });
              this.$Message.info("修改失败");
              this.success = "修改失败,请按F12打开控制台查看错误信息";
            }
          });
      }
    },
    deletes() {
      axios
        .request({
          url: "/api/data-tree/edit/delete",
          method: "post",
          data: {
            id: this.model.id
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.$Message.info("删除成功");
            this.success = "删除成功";
            this.$store.commit("updateAllow", { status: true });
            this.$store.dispatch("reloadDataTree");
          } else {
            this.$store.commit("updateAllow", { status: false });
            this.$Message.info("删除失败");
            this.success = "删除失败,请按F12打开控制台查看错误信息";
          }
        });
    },
    moves() {
      if (this.model.type !== "product") {
        axios
          .request({
            url: "/api/data-tree/edit/move",
            method: "post",
            data: {
              id: this.model.id,
              parentId: this.onChange
            }
          })
          .then(res => {
            if (res.status !== 200) {
              this.$Message.info("移动失败");
              this.success = "移动失败,请按F12打开控制台查看错误信息";
              this.$store.commit("updateAllow", { status: false });
            } else {
              this.$Message.info("移动成功");
              this.success = "移动成功";
              this.$store.commit("updateAllow", { status: true });
              this.onChange = "";
              this.$store.dispatch("reloadDataTree");
            }
          });
      }
    },
    changeVal(onChange) {
      this.onChange = onChange;
    },
    copys() {
      if (this.model.type !== "product" && this.model.type !== "folder") {
        axios
          .request({
            url: "/api/data-tree/edit/copy",
            method: "post",
            data: {
              id: this.model.id,
              parentId: this.onChange
            }
          })
          .then(res => {
            if (res.status !== 200) {
              this.$Message.info("复制失败");
              this.success = "复制失败,请按F12打开控制台查看错误信息";
              this.$store.commit("updateAllow", { status: false });
            } else {
              this.$Message.info("复制成功");
              this.success = "复制成功";
              this.$store.commit("updateAllow", { status: true });
              this.onChange = "";
              this.$store.dispatch("reloadDataTree");
            }
          });
      }
    },
    setPerms() {
      axios
        .request({
          url: "/api/data-tree/edit/set-perms",
          method: "post",
          data: {
            id: this.model.id,
            permList: [{ value: "executablePerms", perms: this.permSelected }]
          }
        })
        .then(res => {
          if (res.status !== 200) {
            this.$Message.info("设置失败");
            this.success = "设置失败,请按F12打开控制台查看错误信息";
            this.$store.commit("updateOnSwitch", { status: !this.onSwitch });
            this.$store.commit("updateAllow", { status: false });
          } else {
            this.$Message.info("设置成功");
            this.success = "设置成功";
            this.$store.commit("updateAllow", { status: true });
            this.permSelected = "";
            this.$store.commit("updateOnSwitch", { status: !this.onSwitch });
            this.$store.dispatch("reloadDataTree");
          }
        });
    },
    setAttrs() {
      var attr = {};
      if (this.model.type === "direct-link") {
        var attrLink = [{ attrKey: "linkUrl", attrVal: this.urls }];
        attr = attrLink;
      } else {
        var attrVal = {};
        for (var i = 0; i < this.param_a.length; i++) {
          attrVal[this.param_a[i]] = this.param_a_value[i];
        }
        if (this.param_a === "[]" || this.param_a === []) {
          var attrScript = [
            { attrKey: "scriptId", attrVal: this.$placeholder.value },
            { attrKey: "scriptParams", attrVal: attrVal }
          ];
        } else {
          var attrScript = [
            { attrKey: "scriptId", attrVal: this.scriptid },
            { attrKey: "scriptParams", attrVal: attrVal }
          ];
          attr = attrScript;
        }
      }
      axios
        .request({
          url: "/api/data-tree/edit/set-attrs",
          method: "post",
          data: {
            id: this.model.id,
            attrs: attr
          }
        })
        .then(res => {
          if (res.status !== 200) {
            this.$Message.info("修改失败");
            this.success = "修改失败,请按F12打开控制台查看错误信息";
            this.$store.commit("updateAllow", { status: false });
          } else {
            this.$Message.info("修改成功");
            this.success = "修改成功";
            this.$store.commit("updateAllow", { status: true });
            this.$store.dispatch("reloadDataTree");
          }
        });
    }
  }
};
</script>



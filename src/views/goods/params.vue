<template>
  <div>
    <!-- 面包蟹导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item> 分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert
        title="警告:只允许为三级分类设置相关参数!"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择分类 -->
      <el-row>
        <el-col>
          <span> 选择商品分类:</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="props"
            clearable
            change-hover-select
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        :before-leave="beforeLeave"
      >
        <el-tab-pane label="用户管理" name="many">
          <!-- 按钮 -->
          <el-button
            @click="dialogVisible = true"
            type="primary"
            :disabled="isDisabled"
            size="small"
          >
            添加参数
          </el-button>
          <!-- 表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="expand" label="#">
              <template slot-scope="scope">
                <div>
                  <el-tag
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="item.attr_id"
                    closable
                    @close="tagDle(scope.row, index)"
                  >
                    {{ item }}
                  </el-tag>
                  <!-- 新添vals -->

                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称 " prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <div>
                  <el-button
                    type="primary"
                    @click="getParamsById(row)"
                    icon="el-icon-edit"
                    size="mini"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="delParamsById(row)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--  -->
        <el-tab-pane label="配置管理" name="only">
          <!-- 按钮 -->
          <el-button
            type="primary"
            @click="dialogVisible = true"
            :disabled="isDisabled"
            size="small"
          >
            添加参数
          </el-button>
          <!-- 表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="expand" label="#">
              <template slot-scope="{ row }">
                <div>
                  <el-tag
                    v-for="item in row.attr_vals"
                    :key="item.attr_id"
                    closable
                  >
                    {{ item.attr_name }}</el-tag
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称 " prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <div>
                  <el-button
                    type="primary"
                    @click="getParamsById(row)"
                    icon="el-icon-edit"
                    size="mini"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="delParamsById(row)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>
      <!-- 弹框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="dialogVisible"
        width="50%"
        @close="clear"
      >
        <!-- 弹框消息 -->
        <el-form label-width="80px" :data="addAttributes">
          <el-form-item :label="titleText">
            <el-input v-model="addAttributes.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams(cateID, addAttributes)"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 修改的弹框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="clear"
      >
        <!-- 弹框消息 -->
        <el-form label-width="80px" :data="editAttributes">
          <el-form-item :label="titleText">
            <el-input v-model="editAttributes.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams(cateID, editAttributes)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "params",
  data() {
    return {
      // 修改参数的表格数据
      editAttributes: {
        attr_name: "",
        attr_sel: "many",
        attr_vals: "",
      },
      // 添加参数的表格数据
      addAttributes: {
        attr_name: "",
        attr_sel: "many",
        attr_vals: "",
      },
      // 表格的数据
      tableData: [],
      // tab高亮显示
      activeName: "many",
      // 获取点击连携的id
      selectedKeys: [],
      // 连携选择框的数据
      cateList: [],
      // 连携框的配置对象
      props: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 弹框显示与隐藏
      dialogVisible: false,
      editDialogVisible: false,
    };
  },
  created() {
    this.getGoodsCategories();
  },
  computed: {
    // 控制按钮禁启用
    isDisabled() {
      return this.selectedKeys.length ? false : true;
    },
    // 分类的id
    cateID() {
      // console.log(this.selectedKeys[this.selectedKeys.length-1]);
      return this.selectedKeys[2];
    },
    // 标题文本
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
  methods: {
    //获取商品分类
    async getGoodsCategories() {
      let { data } = await this.$api.getGoodsCategories();
      if (data.meta.status === 200) {
        // console.log(data)
        this.cateList = data.data;
      }
    },
    //获取分类参数
    async getParams(id, sel) {
      let { data } = await this.$api.getParams({ id, sel });
      // console.log(data);
      if (data.meta.status === 200) {
        this.tableData = data.data;

        data.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          // 每个输入框的表单绑定
          // item.inputValue = "";
          this.$set(item, "inputValue", "");
          // 每个vals的表单显示或隐藏
          // item.inputVisible = false;
          this.$set(item, "inputVisible", false);
          // console.log(item.attr_vals);
        });
        // console.log(data.data);
      }
    },
    // 添加动态参数或者静态属性
    async addParams(id, params) {
      let { data } = await this.$api.addParams(id, params);
      // console.log(data);
      if (data.meta.status === 201) {
        this.$message.success(data.meta.msg);
        this.dialogVisible = false;
        this.getParams(id, this.activeName);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 通过id查询params
    async getParamsById(row) {
      // console.log(row);
      this.editDialogVisible = true;
      // this.editAttributes.attr_name = row.attr_name;

      let { data } = await this.$api.getParamsById(row);
      //  console.log(data);
      this.editAttributes.attr_id = row.attr_id;
      if (data.meta.status === 200) {
        // this.editAttributes = row;
        this.editAttributes.attr_name = data.data.attr_name;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 修改商品分类参数
    async editParams() {
      // console.log(this.editAttributes);

      let { data } = await this.$api.putparamsById(
        this.cateID,
        this.editAttributes
      );
      // console.log(data);
      if (data.meta.status === 200) {
        this.editDialogVisible = false;
        this.getParams(this.cateID, this.editAttributes.attr_sel);
        this.$message.success(data.meta.msg);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 删除商品分类参数
    delParamsById(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { data } = await this.$api.delParamsById(row);
          if (data.meta.status === 200) {
            this.$message.success(data.meta.msg);
            this.getParams(this.cateID, row.attr_sel);
          } else {
            this.$message.error(data.meta.msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // selectedKeys值发生变化的回调  获取发送的父类id和 分类层级的方法
    handleChange(value) {
      // console.log(value);
      if (value.length !== 3) {
        this.tableData = [];
        return (this.selectedKeys = []);
      } else {
        // 拿数据发请求
        // console.log(212313);
        this.getParams(this.cateID, this.activeName);
      }

      // console.log(this.addAttributes.id);
      // console.log(this.selectedKeys);
    },
    // 点击tab的回调
    handleClick(tab, event) {
      //   console.log(tab, event);
      this.addAttributes.attr_sel = this.activeName;
      this.editAttributes.attr_sel = this.activeName;
      if (this.selectedKeys.length !== 3) return;
      this.getParams(this.cateID, this.activeName);
    },
    // 弹框关闭的回调
    clear() {
      this.addAttributes.attr_name = "";
      // 点击输入框显示
    },
    // 显示输入框
    showInput(row) {
      // console.log(row);
      row.inputVisible = true;
      // this.tableData.splice(index, 1, row);
      //  Vue.set(vm.json, "sex", "女")
      //  this.$set(row,'inputVisible',true)
      this.$nextTick((_) => {
        // console.log(this.$refs);
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 失去焦点和键盘enter弹起的回调
    async handleInputConfirm(row) {
      console.log(2121212);
      if (row.inputValue.trim().length == 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
      row.inputValue = "";
      console.log(row);
      console.log(row.attr_vals);

      let { data } = await this.$api.eitdParamsById({
        cat_id: row.cat_id,
        attr_id: row.attr_id,
        attr_vals: row.attr_vals.join(","),
        attr_sel: row.attr_sel,
        attr_name: row.attr_name,
      });
      console.log(data);
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 小标签删除事件
    async tagDle(row, index) {
      console.log(row, index);
      row.attr_vals.splice(index, 1);
      // console.log(  row.attr_vals);
      let { data } = await this.$api.eitdParamsById({
        cat_id: row.cat_id,
        attr_id: row.attr_id,
        attr_vals: row.attr_vals.join(","),
        attr_sel: row.attr_sel,
        attr_name: row.attr_name,
      });
      console.log(data);
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    beforeLeave(a, b) {
      console.log(a,b);
      
    },
  },
};
</script>
<style lang="less" scoped>
.el-row {
  margin: 15px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
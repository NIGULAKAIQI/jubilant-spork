<template>
  <div>
    <!-- 面包蟹导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item> 商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 添加分类-->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="getGoodsCategorie"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 树形结构表格 -->
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template slot-scope="{ row }">
            <div>
              <i class="el-icon-success" v-if="row.cat_deleted"></i>
              <i class="el-icon-error" :style="{ color: 'red' }" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="{ row }">
            <div>
              <!-- {{ row }} -->
              <el-tag v-if="row.cat_level == 0">一级</el-tag>
              <el-tag type="success" v-if="row.cat_level == 1">二级</el-tag>
              <el-tag type="info" v-if="row.cat_level == 2">三级</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <!-- 编辑用户按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getGoodsCategoriesById(row.cat_id)"
              >编辑</el-button
            >
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delCate(row, queryInfo.pagenum)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        :current-page.sync="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类弹框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%"
        @close="handleClose"
      >
        <el-form
          :model="addGoodsCategorie"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addGoodsCategorie.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="options"
              :props="props"
              clearable
              change-hover-select
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate(addGoodsCategorie)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改分类弹框 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="handleClose"
      >
        <el-form
          :model="editGoodsCategory"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editGoodsCategory.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="putCate(editGoodsCategory)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      // 渲染表格的数据
      tableData: [],
      // 渲染表格的数据类型
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 3,
      },
      // 总条数
      total: 10,
      // 控制弹框显示隐藏
      dialogVisible: false,
      editDialogVisible: false,
      // 添加商品分类的数据
      addGoodsCategorie: {
        cat_pid: 0, // 分类的父id
        cat_name: "", //添加商品分类的名称
        cat_level: 0,
      },
      // 编辑商品分类的数据
      editGoodsCategory: {},
      // ；连携选择框的数据源
      options: [],
      // 连携框的配置对象
      props: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 获取点击连携的id
      selectedKeys: [],
    };
  },
  created() {
    this.getGoodsCategories(this.queryInfo);
  },
  methods: {
    // 渲染表格的数据
    async getGoodsCategories(queryInfo) {
      let { data } = await this.$api.getGoodsCategories(queryInfo);
      if (data.meta.status === 200) {
        data;
        this.tableData = data.data.result;
        this.total = data.data.total;
      }
    },
    // 获取渲染连携框的数据
    async getGoodsCategorie() {
      this.dialogVisible = true;
      let { data } = await this.$api.getGoodsCategories({ type: 2 });
      if (data.meta.status === 200) {
        data;
        this.options = data.data;
      }
    },
    // 添加分类
    async addCate(addGoodsCategorie) {
      // 传给接口的参数      addGoodsCategorie
      addGoodsCategorie;
      let { data } = await this.$api.addGoodsCategorie(addGoodsCategorie);
      if (data.meta.status === 201) {
        this.$message.success("添加分类成功!!");
        this.dialogVisible = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 删除分类
    delCate(row, page) {
      row;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { data } = await this.$api.delGoodsCategorie(row.cat_id);
          if (data.meta.status === 200) {
            if (this.total % this.queryInfo.pagesize == 1) {
              page = page - 1 ? page - 1 : page;
              // page=page - 1;
            }
            this.queryInfo.pagenum = page;
            this.getGoodsCategories(this.queryInfo);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: data.meta.msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑  根据id查分类
    async getGoodsCategoriesById(id) {
      id;
      this.editDialogVisible = true;
      let { data } = await this.$api.getGoodsCategoriesById(id);
      if (data.meta.status === 200) {
        data;
        this.editGoodsCategory = data.data;
      }
    },
    // 修改商品分类
    async putCate(row) {
      row;
      row.cat_id;
      row.cat_name;
      let { data } = await this.$api.putCate({
        id: row.cat_id,
        cat_name: row.cat_name,
      });
      if (data.meta.status === 200) {
        this.editDialogVisible = false;
        this.$message.success("修改成功");
        this.getGoodsCategories(this.queryInfo);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 显示条数改变的api
    handleSizeChange(val) {
      val;
      this.queryInfo.pagesize = val;
      this.getGoodsCategories(this.queryInfo);
    },
    // 页码改变的api
    handleCurrentChange(val) {
      val;
      this.queryInfo.pagenum = val;
      this.getGoodsCategories(this.queryInfo);
    },
    // selectedKeys值发生变化的回调  获取发送的父类id和 分类层级的方法
    handleChange(value) {
      // (value);
      this.selectedKeys;
      if (value.length === 0) {
        // ("0000000");
        this.addGoodsCategorie.cat_pid = 0;
        this.addGoodsCategorie.cat_level = 0;
      } else {
        // (value.length - 1);
        // 父类id
        this.addGoodsCategorie.cat_pid = value[value.length - 1];
        // (value[value.length - 1]);
        // 分类的层级
        this.addGoodsCategorie.cat_level = value.length;
      }
    },
    // =弹框关闭的调用
    handleClose() {
      this.addGoodsCategorie.cat_name = "";
      this.addGoodsCategorie.cat_pid = 0;
      this.addGoodsCategorie.cat_level = 0;
      this.selectedKeys = [];
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>


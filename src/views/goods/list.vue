<template>
  <div>
    <!-- 面包蟹导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item> 商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 查找框 -->
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="clear"
            v-model="queryInfo.query"
          >
            <!-- 搜索按钮 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods"
            ></el-button> </el-input
        ></el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="toAddGoods">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" width="700" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="150">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="150">
        </el-table-column>
        <el-table-column prop="add_time" label="时间" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <!-- 编辑用户按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="putUser(row.id)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoodsInfo(row.goods_id, queryInfo.pagenum)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="10"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 弹框区 -->

      <!--弹框修改用户的弹框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!--弹框修改用户的表单 -->
        <el-form :model="editFrom" ref="addUserRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 弹框下方的按钮 -->
        <!-- 弹框取消按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <!-- 弹框确认按钮 -->
          <el-button type="primary" @click="putUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色弹框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="roleDialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!--弹框分配角色的表单 -->
        <div>
          <p>
            当前的用户是:<span> {{ userInfo.username }}</span>
          </p>
          <p>
            当前的角色是:<span> {{ userInfo.role_name }}</span>
          </p>
          <p>
            分配角色:<span>
              <el-select v-model="selectRoleId" placeholder="请选择">
                <el-option
                  v-for="item in roleInfo"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                >
                </el-option> </el-select
            ></span>
          </p>
        </div>
        <!-- 弹框下方的按钮 -->
        <!-- 弹框取消按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取 消</el-button>
          <!-- 弹框确认按钮 -->
          <el-button type="primary" @click="putUserRole(userInfo.id)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 带给获取用户列表的请求的参数
      queryInfo: {
        query: "",
        pagenum: 1, //显示的页数
        pagesize: 10, //显示的条数
      },
      // 渲染表格的数据
      goodsList: [],
      // 数据的总条数
      total: 0,
      // 控制新增用户弹框显示和隐藏的数据
      dialogVisible: false,
      // 控制修改用户弹框显示和隐藏的数据
      editDialogVisible: false,
      // 控制分配角色的弹框显示和隐藏的数据
      roleDialogVisible: false,
      // 添加用户表单的值
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 修改用户表单的值
      editFrom: {
        username: "",
        email: "",
        mobile: "",
      },
      // 当前用户的列表信息
      userInfo: {},
      // 角色的列表信息
      roleInfo: [],
      selectRoleId: "",
      // 当前的页数
      page: 1,
    };
  },
  created() {
    // 发起获取用户列表请求
    this.getGoods(this.queryInfo);
  },
  methods: {
    // 获取用户列表的api
    async getGoods(params) {
      let { data } = await this.$api.getGoods(params);
      // (data);
      if (data.meta.status === 200) {
        //获取用户列表成功
        // 赋值给渲染的数据
        data;

        this.goodsList = data.data.goods;
        this.total = data.data.total;
        // (this.userList);
      }
    },
    // 查找商品的api
    searchGoods() {
      this.queryInfo.pagenum = 1;
      this.getGoods(this.queryInfo);
    },
    // 在点击由 clearable 属性生成的清空按钮时触发
    clear() {
      this.queryInfo.pagenum = 1;
      this.getGoods(this.queryInfo);
    },
    // 更新用户状态的api
    async userStatuChange(userinfo) {
      let { data } = await this.$api.putUserStatu(
        userinfo.id,
        userinfo.mg_state
      );
      if (data.meta.status === 200) {
        this.$message.success("更新用户状态成功!!!");
      } else {
        userinfo.mg_state = !userinfo.mg_state;
        this.$message.error("更新用户状态失败!!!");
      }
    },
    // 编辑用户按钮的回调  发送请求 根据id查用户
    async putUser(id) {
      this.editDialogVisible = true;
      // (id);
      // this.editFrom = id
      let { data } = await this.$api.getUserById(id);
      if (data.meta.status === 200) {
        // 获取数据成功
        this.editFrom = data.data;
      }
    },
    // 修改用户信息的api
    async putUserInfo() {
      let { data } = await this.$api.putUserInfo(this.editFrom);
      if (data.meta.status === 200) {
        this.editDialogVisible = false;
        this.$message.success("更新状态成功!");
        this.getUserList(this.queryInfo);
      } else {
        this.$message.error("更新状态失败!");
      }
    },
    // 分配角色的按钮   //获取角色列表
    async getRoles(row) {
      this.userInfo = row;
      this.roleDialogVisible = true;
      let { data } = await this.$api.getRoles();
      if (data.meta.status === 200) {
        this.roleInfo = data.data;
      }
    },
    // 分配角色
    async putUserRole(id) {
      if (this.selectRoleId) {
        let { data } = await this.$api.putUserRole({
          id,
          rid: this.selectRoleId,
        });
        if (data.meta.status === 200) {
          this.selectRoleId = "";
          this.roleDialogVisible = false;
          this.getUserList(this.queryInfo);
          this.$message.success(data.meta.msg);
        } else {
          this.$message.error(data.meta.msg);
        }
      } else {
        this.$message.error("请选择角色!!!");
      }
    },
    // 跳转去添加用户界面
    toAddGoods() {
      this.$router.push("/addgoods");
    },
    // 删除用户按钮的回调  发弹框
    delGoodsInfo(id, page) {
      // (id);

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确认后的操作
          //接收一个id
          let { data } = await this.$api.delGoodsInfo(id);
          if (data.meta.status === 200) {
            if (this.total % this.queryInfo.pagesize == 1) {
              page = page - 1 ? page - 1 : page;
              // page=page - 1;
            }
            this.queryInfo.pagenum = page;
            this.getGoods(this.queryInfo);
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
    // 显示条数改变的api
    handleSizeChange(val) {
      val;
      this.queryInfo.pagesize = val;
      this.getGoods(this.queryInfo);
    },
    // 页码改变的api
    handleCurrentChange(val) {
      val;
      this.queryInfo.pagenum = val;
      this.getGoods(this.queryInfo);
    },
    // before-close 仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    // Dialog 关闭的回调
    close() {
      this.$refs.addUserRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0;
}
</style>
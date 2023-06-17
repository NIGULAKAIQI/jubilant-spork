<template>
  <div>
    <!-- 面包蟹导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">角色管理</a></el-breadcrumb-item>
      <el-breadcrumb-item> 角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 添加用户 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="rolesList" border style="width: 100%">
        <el-table-column type="expand" label="#">
          <!-- 权限展示区 -->
          <template slot-scope="{ row }">
            <div>
              <!-- 一级权限 -->
              <el-row
                v-for="item in row.children"
                :key="item.id"
                class="vcenter"
              >
                <el-col :span="5" class="bdbottom">
                  <el-tag closable @close="closeTag(item.id, row)">
                    {{ item.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级三级权限 -->
                <el-col :span="19" class="bdbottom">
                  <el-row v-for="item2 in item.children" :key="item2.id">
                    <!-- 二级权限 -->
                    <el-col :span="5">
                      <el-tag
                        type="success"
                        closable
                        @close="closeTag(item2.id, row)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="19">
                      <el-tag
                        closable
                        @close="closeTag(item3.id, row)"
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <!-- 编辑用户按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="searchRoles(row.id)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRoles(row.id)"
            ></el-button>
            <!-- 分配权限按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="getRights(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色弹框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!--  弹框内容 -->
        <!-- 新增角色的表单 -->
        <el-form label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="roleInfo.roleName"> </el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleInfo.roleDesc"> </el-input>
          </el-form-item>
        </el-form>
        <!-- 弹框下方的按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole(roleInfo)">确 定</el-button>
        </span>
      </el-dialog>

      <!--弹框修改用户的弹框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!--弹框修改用户的表单 -->
        <el-form label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="editRoleInfo.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRoleInfo.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 弹框下方的按钮 -->
        <!-- 弹框取消按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <!-- 弹框确认按钮 -->
          <el-button type="primary" @click="putRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限弹框 -->
      <el-dialog
        title="提示"
        :visible.sync="rightsDialogVisible"
        width="50%"
        :before-close="handleClose"
        @close="defKeys = []"
      >
        <!-- 树形结构 -->
        <el-tree
          node-key="id"
          ref="treeRef"
          default-expand-all
          :default-checked-keys="defKeys"
          :props="props"
          :data="treeInfo"
          show-checkbox
          @check-change="handleCheckChange"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRights(roleId)">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 渲染表格的数据 角色
      rolesList: [],
      // 控制弹框的数据
      dialogVisible: false,
      editDialogVisible: false,
      rightsDialogVisible: false,
      //   添加角色的数据
      roleInfo: {
        roleName: "",
        roleDesc: "",
      },
      // 当前角色的id值
      roleId: "",
      //   修改角色的数据
      editRoleInfo: {
        roleName: "",
        roleDesc: "",
      },
      // 默认选中的树节点的数据
      defKeys: [],
      // 树形结构数据
      treeInfo: [],
      props: {
        label: "authName",
        children: "children",
        isLeaf: "leaf",
      },
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    //添加角色
    async addRole(params) {
      let { data } = await this.$api.addRoles(params);
      if (data.meta.status === 201) {
        this.$message.success("添加角色成功");
        this.dialogVisible = false;
        this.getRoles();
      } else {
        this.$message.error("添加角色失败:" + data.meta.msg);
      }
    },
    // 查询角色
    async searchRoles(id) {
      this.editDialogVisible = true;
      let { data } = await this.$api.searchRoles(id);
      if (data.meta.status === 200) {
        this.editRoleInfo = data.data;
      }
    },
    // 删除用户按钮的回调  发弹框
    // 删除角色
    delRoles(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确认后的操作
          //   this.delRoles(id);
          //接收一个id
          let { data } = await this.$api.delRoles(id);
          if (data.meta.status === 200) {
            this.getRoles();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除成功!",
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
    // 编辑角色
    async putRoles() {
      let { data } = await this.$api.putRoles(this.editRoleInfo);
      if (data.meta.status === 200) {
        this.$message.success("修改角色成功!");
        this.editDialogVisible = false;
        this.getRoles();
      } else {
        this.$message.error("修改角色失败:" + data.meta.msg);
      }
    },
    // 获取角色列表
    async getRoles() {
      let { data } = await this.$api.getRoles();
      if (data.meta.status === 200) {
        // 获取列表成功
        this.rolesList = data.data;
      }
    },
    //获取权限列表
    async getRights(row) {
      // 获取最新的roleId
      this.roleId = row.id;
      // 开始递归出三级权限
      this.getListId(row, this.defKeys);
      // (row);
      this.rightsDialogVisible = true;
      let { data } = await this.$api.getRights("tree");
      if (data.meta.status === 200) {
        // 获取权限列表成功
        this.treeInfo = data.data;
      }
    },
    // 添加权限
    async addRights(roleId) {
      // 传过去的id
      const arr = [
        // 被选中的id
        ...this.$refs.treeRef.getCheckedKeys(),
        // 半选中的id
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      let rids = arr.join(",");

      // 角色id  被选中的节点
      let { data } = await this.$api.addRights({ roleId, rids });
      if (data.meta.status === 200) {
        this.rightsDialogVisible = false;
        this.roleId = "";
        this.getRoles();
        this.$message.success(data.meta.msg);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 递归获取三级权限的id
    getListId(node, arr) {
      // 如果这个对象没有children属性 把他的id给这个数组
      if (!node.children) {
        return arr.push(node.id);
      }
      // 这个对象有children属性
      // 递归这个对象
      // item 是每一个子属性
      // 子属性接着遍历
      // 遍历到没有children这个属性
      // 没有这个属性就把他的id给这个数组
      node.children.forEach((item) => {
        this.getListId(item, arr);
      });
    },
    // 点击树节点复选框的回调
    handleCheckChange(data, checked, indeterminate) {
      data, checked, indeterminate;
    },
    // 点击权限删除按钮的回调
    closeTag(rightId, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 删除成功
          let { data } = await this.$api.delRole({ rightId, roleId: row.id });
          if (data.meta.status === 200) {
            row.children = data.data;
            // row.children = data.data;
            this.$message({
              type: "success",
              message: "取消权限成功!",
            });
          } else {
            this.$message.error("取消权限成功失败:" + data.meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
      //   this.$refs.addUserRef.resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.el-col:first-child {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>


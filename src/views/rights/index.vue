<template>
  <div>
    <!-- 面包蟹导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item> 权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-table border :data="rightList">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="用户昵称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="{ row }">
            <div>
              <el-tag v-if="row.level == 0">一级</el-tag>
              <el-tag type="success" v-if="row.level == 1">二级</el-tag>
              <el-tag type="info" v-if="row.level == 2">三级</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      // 渲染表格的数据
      rightList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      let { data } = await this.$api.getRights('list');
      if (data.meta.status === 200) {
        // 获取列表成功
        this.rightList = data.data;
      }
    },
  },
};
</script>


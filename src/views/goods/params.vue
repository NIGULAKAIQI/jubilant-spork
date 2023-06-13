<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="cat_id"
      border
      :indent="50"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template slot-scope="{ row }">
          <div>
            <el-switch
              disabled
              v-model="row.cat_deleted"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序">
        <template>
          <div>
            <el-tag>一级</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <!-- 编辑用户按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <!-- 删除用户按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 2,
        pagesize: 3,
      },
      tableData: [],
    };
  },
  created() {
    this.getGoodsCategories(this.queryInfo);
  },

  methods: {
    async getGoodsCategories(queryInfo) {
      let { data } = await this.$api.getGoodsCategories(queryInfo);
      if (data.meta.status === 200) {
        console.log(data);
        this.tableData = data.data.result;
        console.log(this.tableData);
        this.total = data.data.total;
      }
    },
  },
};
</script>
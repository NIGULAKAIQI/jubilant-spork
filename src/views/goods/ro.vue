<template>
  <div>
    <el-tabs
   
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
  </div>
</template>

<script>
export default {
  created() {
    console.log(32112);
  },
  beforeMount() {
    console.log(111);
    },
  data() {
    return {
        activeName:1
    }
  },
  methods: {
    beforeLeave(A, B) {
      console.log(A, B);
    },
  },
};
</script>

<style>
</style>
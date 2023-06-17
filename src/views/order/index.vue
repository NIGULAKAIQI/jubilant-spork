<template>
  <div>
    <!-- 面包蟹导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item> 订单列表</el-breadcrumb-item>
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
              @click="searchOrder"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="{ row }">
            <div>
              <el-tag type="success" v-if="+row.pay_status">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- 修改地址按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogVisible = true"
            ></el-button>
            <!-- 获取订单按钮 -->
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="getKuaiDi"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 5, 8, 10]"
        :page-size="8"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 弹框区 -->

      <!--弹框修改地址的弹框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!--弹框修改地址的表单 -->
        <el-form :model="editFrom" ref="addUserRef" label-width="100px">
          <el-form-item label="省市区/县" prop="email">
            <el-cascader
              v-model="selectedKeys"
              :options="cityData"
              :props="props"
              clearable
              change-hover-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="mobile">
            <el-input v-model="editFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 弹框下方的按钮 -->
        <!-- 弹框取消按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <!-- 弹框确认按钮 -->
          <el-button type="primary" @click="editDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 获取物流弹框 -->
      <el-dialog title="物流信息" :visible.sync="roleDialogVisible" width="50%">
        <!--弹框分配角色的表单 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from "@/citydata/citydata";
export default {
  data() {
    return {
      //
      activities: [],
      // 连携框的配置对象
      props: {
        expandTrigger: "hover",
        value: "value",
        label: "label",
        children: "children",
      },
      // 渲染连携选择框的数据
      cityData,
      // 获取点击连携的id
      selectedKeys: [],
      // 带给获取订单列表的请求的参数
      queryInfo: {
        query: "",
        pagenum: 1, //显示的页数
        pagesize: 8, //显示的条数
        user_id: "", //用户 id
        pay_status: "", //支付状态
        is_send: "", //是否发货
        order_fapiao_title: "", //['个人','公司']
        order_fapiao_company: "", // 公司名称
        order_fapiao_content: "", //发票内容
        consignee_addr: "", //发货地址
      },
      // 渲染表格的数据
      orderList: [],
      // 数据的总条数
      total: 0,
      // 控制新增用户弹框显示和隐藏的数据
      dialogVisible: false,
      // 控制修改地址弹框显示和隐藏的数据
      editDialogVisible: false,
      // 控制分配角色的弹框显示和隐藏的数据
      roleDialogVisible: false,
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
    this.getOrderList(this.queryInfo);
  },
  methods: {
    // 获取物流信息
    async getKuaiDi() {
      this.roleDialogVisible = true;
      let { data } = await this.$api.getKuaiDi();
      if (data.meta.status === 200) {
        this.activities = data.data.data;
      }
    },
    // 获取订单列表的api
    async getOrderList(params) {
      let { data } = await this.$api.getOrders(params);
      // (data);
      if (data.meta.status === 200) {
        //获取用户列表成功ss
        // 赋值给渲染的数据
        this.orderList = data.data.goods;
        this.total = data.data.total;
        // (this.orderList);
      }
    },
    // 搜索订单
    searchOrder() {
      this.queryInfo.pagenum = 1;
      this.getOrderList(this.queryInfo);
    },
    // 在点击由 clearable 属性生成的清空按钮时触发
    clear() {
      this.queryInfo.pagenum = 1;
      this.getOrderList(this.queryInfo);
    },
    // 显示条数改变的api
    handleSizeChange(val) {
      val;
      this.queryInfo.pagesize = val;
      this.getOrderList(this.queryInfo);
    },
    // 页码改变的api
    handleCurrentChange(val) {
      val;
      this.queryInfo.pagenum = val;
      this.getOrderList(this.queryInfo);
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
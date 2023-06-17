<template>
  <div>
    <!-- 面包蟹导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item> 用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <div id="main" style="width: 1000px; height: 600px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      // 合并的图表对象
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  created() {
    // this.getReports();
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 合并数据
    let { data } = await this.$api.getReports();
    let res = { ...myChart.setOption(data.data), ...this.options };
    // 绘制图表

    myChart.setOption(res);
  },
  methods: {
    // 获取图表数据
    async getReports() {
      let { data } = await this.$api.getReports();
      if (data.meta.status === 200) {
        data;
        this;
      }
    },
  },
};
</script>

<style>
</style>
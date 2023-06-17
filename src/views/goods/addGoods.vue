<template>
  <div>
    <!-- 面包蟹导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item> 商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示消息 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条-->
      <el-steps :active="+active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"> </el-step>
      </el-steps>

      <!-- 添加商品表单 -->
      <!-- tabs标签 -->
      <el-form :model="addForm" ref="addFormRes">
        <el-tabs
          v-model="activeName"
          :tab-position="'left'"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称">
              <el-input clearable v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" type="number">
              <el-input clearable v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input clearable v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input clearable v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="分类列表">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="props"
                clearable
                change-hover-select
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-button type="info" @click="backGoods">返回</el-button>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <br />

              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cd"
                  v-for="(cd, index) in item.attr_vals"
                  border
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headers"
              :file-list="fileList"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
            <!-- 显示图片的弹框 -->
            <el-dialog :visible.sync="dialogVisible" title="图片预览">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <el-form-item label="商品描述">
              <el-input v-model="addForm.goods_introduce"></el-input>
            </el-form-item>
            <el-button type="primary" @click="addGoods(addForm)"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "addGoods",
  data() {
    return {
      // 预览的图片地址
      dialogImageUrl: "",
      //控制图片弹框
      dialogVisible: false,
      // 上传的文件列表
      fileList: [],
      // 图片上传地址
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传头像时携带的请求头
      headers: { Authorization: sessionStorage.getItem("token") },
      // 获取的商品列表动态参数
      manyData: [],
      onlyData: [],
      //添加商品的表单对象
      addForm: {
        goods_name: "",
        goods_price: "123",
        goods_number: "12",
        goods_weight: "12",
        pics: [],
        attrs: [],
        goods_cat: [1, 3, 6],
        goods_introduce: "",
      },
      // 渲染连携选择框的数据
      cateList: [],
      // 连携框的配置对象
      props: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 步骤条高亮的参数
      active: "0",
      // 控制默认选择的tabs
      activeName: "0",
      // 获取点击连携的id
      //   selectedKeys: [],
    };
  },
  created() {
    this.getGoodsCategories();
  },
  methods: {
    //获取商品分类
    async getGoodsCategories() {
      let { data } = await this.$api.getGoodsCategories();
      if (data.meta.status === 200) {
        // (data)
        this.cateList = data.data;
      }
    },
    // 获取商品参数
    async getParams(id, sel) {
      let { data } = await this.$api.getParams({ id, sel });
      if (data.meta.status === 200) {
        if (sel === "only") {
          this.onlyData = data.data;
        } else {
          data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          });
          this.manyData = data.data;
          // ( this.manyData);
        }
      }
    },
    // 添加商品
    async addGoods(params) {
      this.manyData.forEach((item) => {
        // (item);
        const atterInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(","),
        };
        // ("对象", atterInfo);
        params.attrs.push(atterInfo);
      });
      this.onlyData.forEach((item) => {
        // (item);
        const atterInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        };
        // ("对象", atterInfo);
        params.attrs.push(atterInfo);
      });
      "发送的对象", params.attrs;

      params.goods_cat =
        typeof params.goods_cat !== "string"
          ? params.goods_cat.join(",")
          : params.goods_cat;
      // this.activeName = "0";
      // this.$refs.addFormRes.resetFields()
      let { data } = await this.$api.addGoods(params);
      if (data.meta.status === 201) {
        this.$message.success(data.meta.msg);
        setTimeout(() => {
          this.$router.push("/goods");
        }, 1000);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    //切换页签的之前的回调
    beforeLeave(activeName) {
      if (this.addForm.goods_name === "") {
        this.$message.error("请选择商品名称");
        return false;
      }
      if (!this.cateId) {
        this.$message.error("请选择商品分类");
        return false;
      }
      // 不是必选参数
      // if (this.manyData.length === 0 && activeName == "4") {
      //   this.$message.error("请选择商品动态参数");
      //   return false;
      // }
      // if (this.onlyData.length === 0 && activeName == "4") {
      //   this.$message.error("请选择商品动态参数");
      //   return false;
      // }
      this.active = activeName;
      switch (activeName) {
        case "1":
          // 获取动态参数
          this.getParams(this.cateId, "many");
          break;
        case "2":
          // 获取静态参数
          this.getParams(this.cateId, "only");
          break;
        default:
          break;
      }
    },
    // selectedKeys值发生变化的回调  获取发送的父类id和 分类层级的方法
    handleChange(value) {
      if (value.length !== 3) {
        return (this.addForm.goods_cat = []);
      } else {
        // 选择了商品分类可以放行
        this.addForm.goods_cat;
        value;
        this.cateId;
      }
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview({ response }) {
      // ("点击文件列表中已上传的文件时的钩子");
      // (response.data.url);
      this.dialogVisible = true;
      this.dialogImageUrl = response.data.url;
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      // response
      // 筛选出名字不等于file.response.data.tmp_path
      this.addForm.pics = this.addForm.pics.filter((item) => {
        // ('item',item);
        return item.pic !== file.response.data.tmp_path;
      });
      this.addForm.pics;
    },
    // 文件上传成功时的钩子
    handleSuccess({ data }) {
      // (data);
      // 文件的临时路径
      // (data.tmp_path);
      this.addForm.pics.push({ pic: `${data.tmp_path}` });
      this.addForm.pics;
    },
    // 返回商品列表
    backGoods() {
      this.$router.push("/goods");
    },
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat[2];
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
</style>
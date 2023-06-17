<template>
  <el-container class="home-container">
    <!--container 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/heima.png" alt="" />
        <span>电商管理后台</span>
      </div>
      <el-button type="info" class="layout"> 退出登录</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          unique-opened
          :default-active="`${$route.path}`"
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <div class="toggle-button" @click="isCollapse = !isCollapse">|||</div>
          <!-- 一级菜单导航  -->
          <el-submenu
            :index="menu.id + ''"
            v-for="menu in menus"
            :key="menu.id"
          >
            <template slot="title">
              <i :class="iconObj[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单导航 -->
            <el-menu-item
              :index="'/' + child.path"
              v-for="child in menu.children"
              :key="child.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span> {{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  created() {
    this.getMenus();
  },
  data() {
    return {
      // 遍历导航菜单的数据
      menus: [],
      // 遍历字体图标的数据
      iconObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-shop",
        102: "el-icon-s-order",
        145: "el-icon-orange",
      },
      // 控制菜单栏是否折叠
      isCollapse: false,
    };
  },
  methods: {
    //  获取菜单导航数据的方法
    async getMenus() {
      let { data } = await this.$api.getMenus();
      // console.log(data);
      if (data.meta.status === 200) {
        // 获取数据成功
        this.menus = data.data;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #363d40;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 10px 0;

  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
      font-size: 18px;
    }
  }
}
.el-aside {
  background-color: #313743;
  .el-menu {
  
    .toggle-button {
      color: #fff;
      text-align: center;
      background-color: #4a5064;
      line-height: 24px;
      font-size: 10px;
      cursor: pointer;
    }
  }
}
.el-main {
  background-color: #e9edf1;
}
</style>
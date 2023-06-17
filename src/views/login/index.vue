<template>
  <div class="login_context">
    <div class="login_box">
      <div class="login-header">
        <h1>登录页</h1>
      </div>
      <div class="login-bd">
        <div class="login-put">
          账号:
          <input
            type="text"
            v-model="userInfo.username"
            placeholder="请输入账号"
          />
        </div>
        <div class="login-put">
          密码:
          <input
            type="password"
            v-model="userInfo.password"
            placeholder="请输入密码"
          />
        </div>
        <el-button type="primary" @click="login(userInfo)">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户登录输入的值
      userInfo: {
        username: "admin",
        password: "123456",
      },
    };
  },
  methods: {
    async login(userInfo) {
      let { data } = await this.$api.login(userInfo);
      if (data.meta.status === 200) {
        // 登录成功执行
        // 提示登录成功的信息
        this.$message.success("登录成功");
        // 把Token存入会话中
        sessionStorage.setItem("token", data.data.token);
        //  进行首页的跳转
        this.$router.push("/home");
        //  (data.data.token);
      } else {
        // 登录失败执行
        this.$message.error("登录失败:" + data.meta.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login_context {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    background: #fff;
    width: 500px;
    height: 300px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 3%;
    // transform: translate(-50%,-50%);
    .login-header {
      text-align: center;
      padding: 20px;
      h1 {
        font-size: 25px;
      }
    }
    .login-bd {
      display: flex;
      flex-direction: column;
      padding: 0 30px;
      .login-put {
        background-color: #fff;
        margin-bottom: 20px;
        line-height: 30px;
        border-bottom: 1px solid #ccc;
        font-size: 20px;
        color: #ccc;
        input {
          border: 0;
          width: 389px;
          height: 45px;
          outline: none;
          &::placeholder {
            color: #ccc;
          }
        }
      }
    }
  }
}
</style>
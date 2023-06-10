import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/login"
import Home from '@/views/home'
import Welcome from '@/views/home/welcome'
import Users from "@/views/user/users"


Vue.use(VueRouter)

const routes = [
  {
    // 重定向
    path: "/",
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: "home",
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: "Welcome",
        component: Welcome,
      },
      {
        path: "/users",
        name:'users',
        component: Users
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from);
  // 跳转的名字不是login执行
  if (to.name !== "login") {
    const token = sessionStorage.getItem("token")
    // 有Token放行,否则去登录页
    if (token) next()
    else { 
      next('/login')
    }
  } else {
    next()
  }
  

})



export default router

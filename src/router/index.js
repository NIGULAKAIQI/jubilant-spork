import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/login"
import Home from '@/views/home'

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
    component: Home
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  console.log(to, from);
  // 跳转的名字不是login执行
  if (to.name !== "login") {
    const token = sessionStorage.getItem("token")
    if (token) next()
    else { 
      next('/login')
    }
  } else {
    next()
  }
  

})



export default router

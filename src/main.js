import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import api from '@/api'
import'@/mock/mockServer'
Vue.config.productionTip = false
Vue.prototype.$api=api

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

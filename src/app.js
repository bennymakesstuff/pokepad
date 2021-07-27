import Vue from 'vue'
import App from '@/views/Main.vue'
import VueRouter from 'vue-router'
import store from '@/store'
import router from '@/router'
import API from './apirequest'

Vue.use(VueRouter)
Vue.use(API)








new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

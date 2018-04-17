import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'lib-flexible/flexible.js'
import axios from './http/index'
import io from 'socket.io-client'

Vue.config.productionTip = false
Vue.prototype.axios = axios
const socket = io('http://192.168.1.111:3000');

Vue.prototype.socket = socket;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

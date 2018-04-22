import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'lib-flexible/flexible.js'
import axios from './http/index'
import io from 'socket.io-client'
import api from './api/index'

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.api = api
const socket = io(api.socket());

Vue.prototype.socket = socket;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toast: {
      isShow: false,
      content: '这是一个toast',
      duration: 1000,
    },
    loginStatus: localStorage.getItem('loginStatus') || false,
    userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')) || {},
    activeTab: localStorage.getItem('activeTab') || 'Chat',
  },
  mutations: {
    SET_TOAST(state, obj) {  // toast
      state.toast = obj;
    },
    SET_LOGIN_STATUS(state, bool) {  // 登录状态
      state.loginStatus = bool;
    },
    SET_USER_INFO(state, obj) { // 用户信息
      state.userInfo = obj;
    },
    SET_ACTIVE_TAB(state, str) {  // 下方tab激活状态
      state.activeTab = str;
    }
  },
  actions: {

  }
})

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
    homeMsg: {},
    groupList: [],
    chatList: localStorage.getItem('chatList') && JSON.parse(localStorage.getItem('chatList')) || [],
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
    },
    SET_HOME_MSG(state, obj) {
      state.homeMsg = obj;
    },
    SET_FRIEND_GROUP(state , obj) {
      state.groupList.push(obj);
    },
    STE_CHAT_LIST(state, obj) {  // 设置聊天页消息
      let chatList = state.chatList;
	  let flag = true;
      for(let i = 0;i< chatList.length ;i++){
		  if(chatList[i].roomId == obj.roomId){
			  flag = false;
			  break;
		  }
	  }
	  if(flag) {
		  chatList.push(obj);
		  state.chatList = chatList;
		  localStorage.setItem('chatList',JSON.stringify(chatList));
	  }
    }
  },
  actions: {

  }
})

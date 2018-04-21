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
        isLoading: false,
    },
    mutations: {
        SET_TOAST(state, obj) { // toast
            state.toast = obj;
        },
        SET_LOGIN_STATUS(state, bool) { // 登录状态
            state.loginStatus = bool;
        },
        SET_USER_INFO(state, obj) { // 用户信息
            state.userInfo = obj;
        },
        SET_ACTIVE_TAB(state, str) { // 下方tab激活状态
            state.activeTab = str;
        },
        SET_HOME_MSG(state, obj) {
            state.homeMsg = obj;
        },
        SET_FRIEND_GROUP(state, obj) {
            state.groupList.push(obj);
        },
        STE_CHAT_LIST(state, array) { // 设置聊天页消息
            state.chatList = array;
        },
        SET_LOADING_STATE(state, bool) {
            state.isLoading = bool;
        }
    },
    actions: {

    }
})
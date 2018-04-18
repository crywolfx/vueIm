import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Chat from './views/Chat.vue'
import Me from './views/Me.vue'
import Chating from './views/Chating.vue'
import Home from './views/Home.vue'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requireAuth: true, 
      },
      children: [
        {
          path: 'chat',
          name: 'chat',
          component: Chat
        },
        {
          path: 'me',
          name: 'me',
          component: Me
        }]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/me',
      name: 'me',
      component: Me,
      meta: {
        requireAuth: true, 
      },
    },
    {
      path: '/chating/:roomid',
      name: 'chating',
      component: Chating,
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
      if (store.state.loginStatus) { // 通过vuex state获取是否登录
          next();
      } else {
          next({
              path: '/login',
          })
      }
  } else {
      if(to.name == 'login'){
        if(!store.state.loginStatus) {
          next();
        }else {
          next({
            path: '/'
          })
        }
      }else {
        next();
      }
  }
})


export default router
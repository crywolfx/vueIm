<template>
<transition name="fade">
    <div class="login">
        <div class="info-content">
            <input class="info-input name"  @input="change()" type="text" placeholder="请输入帐号" v-model="userName">
            <input class="info-input password" @input="change()" type="password" placeholder="请输入密码"  v-model="password">
        </div>
        <div class="go-login" :class="[canLogin ? 'go-login-true' : '']" @click="goLogin()">
            登录
        </div>
        <div class="login-other">
          <router-link to="register" class="go-reg">注册帐号</router-link>
          <div class="go-for">忘记密码</div>
        </div>
    </div>
</transition>
</template>
 <script>
export default {
  name: "Login",
  data() {
    return {
      canLogin: false,
      userName: "",
      password: ""
    };
  },
  watch: {
   
  },
  methods: {
      change() {
          if (this.userName && this.password) {
              this.canLogin = true;
          } else {
              this.canLogin = false;
          }
      },
      goLogin() {
          if (this.canLogin) {
            this.$store.commit('SET_LOADING_STATE',true);
              let userInfo = {
                userName: this.userName,
                password: this.password
              }
              this.axios.post('http://192.168.1.116:3000/user/login', userInfo)
                  .then(res => {
                    this.$store.commit('SET_LOADING_STATE',false);
                      if (res.data.success) {

                         this.$store.commit('SET_LOGIN_STATUS', true);
                         this.$store.commit('SET_USER_INFO', res.data.userInfo);
                         localStorage.setItem('loginStatus', true);
                         localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo));

                          this.$router.push({
                              name: 'chat',
                          })
                      }else {
                         this.$store.commit("SET_TOAST", {
                            isShow: true,
                            content: res.data.msg,
                            duration: 1000
                         });
                      }
                  })
          }
      }
  }
};
</script>

 <style lang="less" scoped>
.fade-enter-active {
  transition: all .2s;
}
.fade-leave-active {
  transition: all .2s;
}
.fade-enter, .fade-leave-active {
  transform: translateX(100%);
  opacity: 1;
}

.login {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: url("../assets/image/login_bg.jpg") no-repeat 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 8;
}

.info-content {
  position: absolute;
  width: 7rem;
  top: 5rem;
  left: 50%;
  transform: translateX(-50%);
}
.info-input {
  width: 100%;
  background: #ffffff;
  outline: none;
  border: none;
  border-radius: 0.3rem;
  height: 0.8rem;
  text-align: center;
}

.password {
  margin-top: 0.6rem;
}

.go-login {
  float: left;
  overflow: hidden;
  color: #ffffffff;
  font-size: 0.45rem;
  width: 7rem;
  height: 1.4rem;
  border-radius: 0.2rem;
  background: #777777;
  line-height: 1.4rem;
  text-align: center;
  position: absolute;
  top: 8rem;
  left: 50%;
  margin-left: -3.5rem;
}

.go-login-true {
  background: #32A8CC;
}
.login-other {
  width: 7.5rem;
  position: absolute;
  top: 9.8rem;
  left: 50%;
  transform: translateX(-50%);
  color: #146275;
  .go-reg {
    float: left;
    color: #146275;
  }
  .go-for {
    float: right;
  }
}
</style>
 
<template>
<transition name="fade">
    <div class="reg">
        <transition name="fade2">
        <div class="info-account" v-show="!isNext">
            <div class="info-content">
                <input class="info-input username"  type="text" placeholder="请输入用户名" @input="change()" v-model="userName">
                <input class="info-input password"  type="password" placeholder="请输入密码" @input="change()" v-model="password">
                <input class="info-input password"  type="password" placeholder="请再次输入密码" @input="change()" v-model="password2">
            </div>
            <div class="go-next" :class="[canNext ? 'go-next-true' : '']" @click="next()">
                下一步
            </div>
            <div class="login-other">
                <router-link to="login" class="go-login">登陆账号</router-link>
            </div>
        </div>
        </transition>
        <transition name="fade3">
        <div class="info-more" v-show="isNext">
            <div class="sex-content">
                <div :class="[sexOnShow == 'male' ? 'sex sex-bg' : 'sex']">
                    <div class="icon icon-male" @click="selectSex('male')"></div>
                    <div class="sex-text">男生</div>
                </div>
                <div :class="[sexOnShow == 'famle' ? 'sex sex-bg' : 'sex']">
                    <div class="icon icon-female" @click="selectSex('famle')"></div>
                    <div class="sex-text">女生</div>
                </div>
            </div>
            <div class="info-content">
                <input class="info-input2"  type="text" placeholder="请输入昵称" @input="change2()" v-model="name">
                <input class="info-input2 age"  type="number" placeholder="请输入年龄" @input="change2()" v-model="age">
            </div>
            <div class="go-reg" :class="[canReg ? 'go-reg-true' : '']" @click="doReg()">
                点击注册
            </div>
          <div class="login-other">
            <div class="go-last" @click="goLast()">上一步</div>
            <router-link to="login" class="go-login">登陆账号</router-link>
          </div>
        </div>
        </transition>
    </div>
</transition>
</template>
 <script>
export default {
    name: "Register",
    data() {
        return {
            isNext: false,
            canNext: false,
            canReg: false,
            userName: "",
            password: "",
            password2: "",
            sexOnShow: "",
            name: "",
            age: ""
        };
    },
    watch: {
        sexOnShow(val) {
            if(this.name && this.age && val){
                this.canReg = true;
            }
        }
    },
    methods: {
        change() {
            if(this.userName && this.password && this.password2){
                this.canNext = true;
            }else{
                this.canNext = false;
            }
        },
        change2() {
            if(this.name && this.age && this.sexOnShow){
                this.canReg = true;
            }else{
                this.canReg = false;
            }
        },
        selectSex(flag) {
            if (flag) {
                this.sexOnShow = flag;
            }
        },
        next() {
              if (this.canNext) {
                if(this.password == this.password2) {
                    this.checkName();
                }else {
                    this.$store.commit("SET_TOAST", {
                        isShow: true,
                        content: "两次密码不一致",
                        duration: 1000
                    }); 
                }
              }
        },
        goLast() {
            this.isNext = false;
        },
        checkName() {
            this.$store.commit('SET_LOADING_STATE',true);
            this.axios
                .post("http://192.168.1.116:3000/user/checkName", {
                    userName: this.userName
                })
                .then(res => {
                    this.$store.commit('SET_LOADING_STATE',false);
                    if (res.data.success) {
                        this.isNext = true;
                    } else {
                        this.$store.commit("SET_TOAST", {
                            isShow: true,
                            content: "该帐号已被注册",
                            duration: 1000
                        });
                    }
                });
        },
        checkInfo() {
            let toastContent = "";
            if (this.age > 120 || this.age < 10) {
                toastContent = "输入的年龄不符合规范";
            }
            if (toastContent) {
                this.$store.commit("SET_TOAST", {
                    isShow: true,
                    content: toastContent,
                    duration: 1000
                });
                return false;
            }else {
                return true;
            }
        },
        doReg() {
            this.$store.commit('SET_LOADING_STATE',true);
            if (this.canReg) {
                if (this.checkInfo()) {
                    let userInfo = {
                        userName: this.userName,
                        password: this.password,
                        sex: this.sexOnShow,
                        nickName: this.name,
                        age: this.age
                    };
                    this.axios.all([
                        this.axios.post('http://192.168.1.116:3000/user/reg', userInfo),
                        this.axios.post('http://192.168.1.116:3000/room/joinroom', { userName: this.userName, roomId: '0001' }),
                        this.axios.post('http://192.168.1.116:3000/room/joinroom', { userName: this.userName, roomId: '0002' }),
                        this.axios.post('http://192.168.1.116:3000/room/joinroom', { userName: this.userName, roomId: '0003' }),
                    ]).then(this.axios.spread( (a,b,c,d) => {
                        this.$store.commit('SET_LOADING_STATE',false);
                         if(a.data.success) {
                             this.$router.push({name:'login'});
                         }
                         if(b.data.success && c.data.success && d.data.success) {
                             this.$store.commit('SET_TOAST', {
                                isShow: true,
                                content: '加入官方默认房间',
                                duration: 1000,
                            })
                         }else {
                             console.error('加入官方默认房间失败');
                         }
                    }))

                }            
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
  transform: translateX(-100%);
  opacity: 1;
}
// 下一步动画
.fade2-enter-active {
  transition: all .2s;
}
.fade2-leave-active {
  transition: all .2s;
}
.fade2-enter , .fade2-leave-active{
  transform: translateX(-100%);
  opacity: 1;
}

// 上一步动画
.fade3-enter-active {
  transition: all .2s;
}
.fade3-leave-active {
  transition: all .2s;
}
.fade3-enter, .fade3-leave-active {
  transform: translateX(100%);
  opacity: 1;
}


.reg {
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

.go-next {
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
  top: 9.5rem;
  left: 50%;
  margin-left: -3.5rem;
}
.go-next-true{
  background: #32A8CC;  
}

.login-other {
    width: 7.5rem;
    position: absolute;
    top: 11.3rem;
    left: 50%;
    transform: translateX(-50%);
    color: #146275;
    .go-login {
        float: right;
        color: #146275;
    }
}
    
.info-more {
    .sex-content {
        width: 6.6rem;
        overflow: hidden;
        float: left;
        position: absolute;
        top: 5rem;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .sex {
        padding: 0.2rem;
        width: 2.9rem;
        float: left;
    }
    .sex-bg {
        background: rgba(242, 107, 109, 0.7);
        border-radius: 50%;
    }
    .icon {
        height: 2.4rem;
        width: 2.4rem;
        margin: 0 auto;
    }
    .icon-male {
        background: url("../assets/image/login_male.svg") no-repeat;
        background-size: cover;
    }
    .icon-female {
        background: url("../assets/image/login_female.svg") no-repeat;
        background-size: cover;
    }
    .icon-bg {
        position: absolute;
        top: 0;
        left: 0;
        height: 2.4rem;
        width: 2.4rem;
        background: #000;
    }
    .sex-text {
        color: #ffffff;
        font-size: 0.5rem;
        text-align: center;
    }
    .info-content {
        position: absolute;
        top: 8rem;
        left: 50%;
        transform: translateX(-50%);
    }
    .info-input2 {
        width: 100%;
        background: #ffffff;
        outline: none;
        border: none;
        border-radius: 0.3rem;
        height: 0.8rem;
        text-align: center;
    }
    .age {
        margin-top: 0.6rem;
    }
    .go-reg {
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
        top: 11rem;
        left: 50%;
        margin-left: -3.5rem;
    }
    .go-reg-true{
        background: #32A8CC;
    }
    .login-other {
        width: 7.5rem;
        position: absolute;
        top: 12.6rem;
        left: 50%;
        transform: translateX(-50%);
        color: #146275;
        .go-login {
            float: right;
            color: #146275;
        }
        .go-last {
            float: left;
            color: #FBE99F;
        }
    }
}
</style>
 
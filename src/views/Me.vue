<template>
<transition name="fade">
  <div class="me">
      <div class="user-image">
          <img @click="isUpload=true" class="user-avatar" :src="userInfo.src ? userInfo.src : defaultImg" alt="">
      </div>
      <div class="userInfo-box">
        <div class="nickName userInfo-item">
          <div class="userInfo-item-content userInfo-item-first">
            <div class="attr">昵称:</div>
            <div class="value">{{userInfo.nickName}}</div>
          </div>
        </div>
        <div class="userName userInfo-item">
          <div class="userInfo-item-content">
            <div class="attr">ID:</div>
            <div class="value">{{userInfo.userName}}</div>
          </div>
        </div>
        <div class="sex userInfo-item">
          <div class="userInfo-item-content">
            <div class="attr">性别:</div>
            <div class="value">{{userInfo.sex}}</div>
          </div>
        </div>
        <div class="age userInfo-item">
          <div class="userInfo-item-content">
            <div class="attr">年龄:</div>
            <div class="value">{{userInfo.age}}</div>
          </div>
        </div>
      </div>
      <div class="logout" @click="logout()">退出登录</div>
      <transition name="bounce">
       <div class="image-upload" v-if="isUpload">
        <div class="image-upload-content">
          <div class="image-upload-ctrl">
            <div class="image-ctrl-left" @click="isUpload=false"></div>
            <div class="image-ctrl-right" @click="imageUpload"></div>
          </div>
          <div class="image-upload-input-box">
             点击上传
            <input class="image-upload-input" type="file" accept="image/*" @change="getFile">
          </div>
		  <div class="image-upload-preview" v-if="previewUrl">
			  <div class="image-upload-imgContent" :style="{backgroundImage:`url(${previewUrl})`}"></div>
		  </div>
        </div>
      </div>
      </transition>
  </div>
</transition>
</template>
<script>
export default {
    name: 'me',
    data() {
        return {
            isUpload: false,
			      imageFiles: null,
            previewUrl: '',
            defaultImg: require('../assets/image/avatar.jpg')
		    }
    },
    components: {},
    beforeRouteEnter: (to, from, next) => {
        let nameArr = to.name.split('');
        nameArr[0] = nameArr[0].toUpperCase();
        let name = nameArr.join('');
        next(vm => {
            vm.$store.commit('SET_ACTIVE_TAB', name);
            localStorage.setItem('activeTab', name);
        })
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }
    },
    methods: {
        getFile(e) {
            this.imageFiles = e.target.files[0];
            this.previewUrl= this.getObjectURL(this.imageFiles);
        },
        imageUpload() {
            this.$store.commit('SET_LOADING_STATE',true);
            let formData = new FormData();
            formData.append('userName', this.userInfo.userName);
            formData.append('file', this.imageFiles)
            this.axios.post(this.api.userUpload(), formData)
                .then(res => {
                  this.$store.commit('SET_LOADING_STATE',false);
                    if (res.data.success) {
                        let newUserInfo = this.userInfo;
                        newUserInfo.src = res.data.data;
                        this.$store.commit("SET_USER_INFO", newUserInfo);
                        localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
                        this.isUpload = false;
                        this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '更换头像成功',
                            duration: 1000,
                        })
                    } else {
                        this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '更换头像失败',
                            duration: 1000,
                        })
                    }
                })
        },
        logout() {
            localStorage.clear();
            this.$store.commit('STE_CHAT_LIST' , []);
            this.$store.commit("SET_LOGIN_STATUS", false);
            this.$store.commit("SET_USER_INFO", {});
            this.$store.commit("SET_ACTIVE_TAB", 'Chat');
            this.$store.commit('SET_TOAST', {
                isShow: true,
                content: '登出成功',
                duration: 1000,
            });
            this.$router.push({
                name: 'login'
            })
        },
        getObjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        },
    }
}
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

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.me {
    box-sizing: border-box;
    padding-top: 1.2rem;
    position: absolute;
    height: 100%;
    width: 100%;
    background: #EBEBEB;
}
.user-image{
  width: 100%;
  height: 4rem;
  background: url("../assets/image/me-bg.png") no-repeat;
  background-size: cover;
  position: relative;
  .user-avatar{
    display: block;
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%)
  }
}
.userInfo-box {
    color: #353535;
    box-shadow: 0, 0 2px 2px hsla(210,5%,84%,.8);
    .userInfo-item {
        background: #ffffff;
        height: 1.4rem;
        line-height: 1.4rem;
        padding: 0 .4rem;
    }
    .userInfo-item-content{
      border-top: 1px solid #DEDEDE;
      .attr {
        float: left;
      }
      .value {
        color: #9B9B9B;
        float: right;
      }
    }
    .userInfo-item-first{
      border: none;
    }

}

.logout {
  color: #353535;
  background: #ffffff;
  height: 1.4rem;
  margin-top: 1rem;
  padding: 0 .4rem;
  line-height: 1.4rem;
  box-shadow: 0 -2px 2px hsla(210,5%,84%,.8), 0 2px 2px hsla(210,5%,84%,.8);
}
.image-upload{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(171, 171, 171, 0.5);
  z-index: 9;
  .image-upload-content{
    height: 50%;
    width: 70%;
    background: #FCFCFC;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: .2rem;
    overflow: hidden;
  }
  .image-upload-ctrl {
    height: 1rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0 .2rem;
	background: #C2C2C2;
	top: 0;
	left: 0;
	position: absolute;
	z-index: 2;
    div {
      height: 1rem;
      width: 1rem;
    }
    .image-ctrl-left {
      float: left;
      background: url("../assets/image/cancel.svg") no-repeat 50% 50%;
      background-size: auto 70%;
    }
    .image-ctrl-right {
      float: right;
      background: url("../assets/image/right.svg") no-repeat 50% 50%;;
      background-size: auto 70%;
    }
  }
  .image-upload-input-box {
    width: 100%;
    height: 1rem;
    background: #B6CDFA;
    color: #fff;
    text-align: center;
    line-height: 1rem;
    font-size: .4rem;
	  position: absolute;
	  z-index: 2;
	  top: 1rem;
  }
  .image-upload-input{
    display: block;
    height: 100%;
    width: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
	  left: 0;
	  z-index: 1;
  }
  .image-upload-preview {
	  top: 0;
	  position: absolute;
	  height: 100%;
	  box-sizing: border-box;
	  padding: 2.2rem .2rem .2rem .2rem;
	  width: 100%;
	  .image-upload-imgContent {
		  height: 100%;
		  width: 100%;
		  background-size: contain;
		  background-repeat: no-repeat;
		  background-position: 50% 50%;
	  }
  }
}
</style>

<template>
  <div class="me">
      <div class="user-image">
          <img @click="isUpload=true" class="user-avatar" :src="userInfo.src ? userInfo.src : ('../assets/image/avatar.jpg')" alt="">
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
      <div class="image-upload" v-if="isUpload">
        <div class="image-upload-content">
          <div class="image-upload-ctrl">
            <div class="image-ctrl-left" @click="isUpload=false"></div>
            <div class="image-ctrl-right" @click="imageUpload"></div>
          </div>
          <input class="image-upload-input" type="file" accept="image/*" @change="getFile">
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name:'me',
  data() {
    return {
      isUpload: false,
      imageFiles: null 
    }
  },
  components: {
  },
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
      this.imageFiles=e.target.files[0];
    },
    imageUpload() {
      let formData = new FormData();
          formData.append('userName', this.userInfo.userName);
          formData.append('file', this.imageFiles)
      this.axios.post('http://192.168.1.116:3000/user/upload/user',formData)
        .then(res => {
           if(res.data.success){
             let newUserInfo = this.userInfo;
             newUserInfo.src = res.data.data;
             this.$store.commit("SET_USER_INFO",newUserInfo);
             localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
             this.isUpload = false;
             this.$store.commit('SET_TOAST',{
                isShow:true,
                content:'更换头像成功',
                duration:1000,
              })
           }else {
              this.$store.commit('SET_TOAST',{
                isShow:true,
                content:'更换头像失败',
                duration:1000,
              })
           }
        })
    },
    logout() {
          localStorage.clear();
          this.$store.commit("SET_LOGIN_STATUS",false);
          this.$store.commit("SET_USER_INFO",{});
          this.$store.commit("SET_ACTIVE_TAB",'Chat');
					this.$store.commit('SET_TOAST',{
						isShow:true,
						content:'登出成功',
						duration:1000,
          });
          this.$router.push({
            name:'login'
          })
    }
  }
}
</script>
<style lang="less" scoped>
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
    background: #36ADD1;
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
  .image-upload-input{
    display: block;
    position: absolute;
    top: 1.6rem;
    left: 50%;
    transform: translateX(-50%)
  }
}
</style>

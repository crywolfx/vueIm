<template>
  <div class="me">
      <div class="user-image">
          <img class="user-avatar" src="../assets/image/avatar.jpg" alt="">
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
  </div>
</template>
<script>

export default {
  name:'me',
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  methods: {
    logout() {
          localStorage.clear();
          this.$store.commit("SET_LOGIN_STATUS",false);
          this.$store.commit("SET_USER_INFO",{});
          this.$store.commit("SET_ACTIVE_TAB",'Chat');
					this.$store.commit('SET_TOAST',{
						isShow:true,
						content:'登出成功',
						duration:1000,
          }),
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
</style>

<template>
<transition name="fade">
  <div class="chat">
    <div class="chat-list">
      <div v-for="(value,index) in roomId">
        <div class="chat-room" @click="goTalk(value)">{{roomName[index]}}<span class="chat-room-ctrl" @click.stop="roomShowFunc(value)"></span>
        <transition name="bounce">
          <div class="chat-room-ctrl-content" v-if="roomShow == value+'true' ">
            <div class="chat-room-clear" @click.stop="clearMsg(value)">删除消息记录</div>
          </div>
        </transition>
        <div class="mask" v-if="roomShow == value+'true'" @click.stop="roomShow= '';flag = false"></div>
        </div>
      </div> 
    </div>
  </div>
</transition>
</template>
<script>
export default {
  name: "Chat",
  data() {
    return {
        count: 0,
        roomId:['default_1','default_2','default_3'],
        roomName: ['官方聊天室1','官方聊天室2','官方聊天室3'],
        roomShow: '',
        flag: false
    };
  },
  components: {

  },
  beforeRouteEnter: (to, from, next) => {
    let nameArr = to.name.split('');
    nameArr[0] = nameArr[0].toUpperCase();
    let name = nameArr.join('');
    next( vm=> {
      vm.$store.commit('SET_ACTIVE_TAB', name);
      localStorage.setItem('activeTab', name);
    })
  },
  mounted() {
    let _this = this;
      this.socket.on('receive msg', data => {
            // console.log(data);
            _this.count++;
            // console.log(_this.count);
       })
  },
  methods: {
    clearMsg(roomId) {
      localStorage.removeItem(`msg_${roomId}`);
      this.roomShow = '';
      this.flag = false;
    },
    roomShowFunc(value) {
      this.flag = !this.flag;
      this.roomShow = value + this.flag;
    },
    goTalk(roomId) {
      this.$router.push({
        name:'chating',
        params: { roomid: roomId }
      })
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

.chat {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #ebebeb;
}
.chat-list{
  padding-top: 1.2rem;
  .chat-room{
    box-sizing: border-box;
    height: 1.5rem;
    background: #FCFCFC;
    line-height: 1.5rem;
    padding: 0 .4rem;
    border-bottom: 1px solid #DEDEDE;
    position: relative;
  }
}
.chat-room-ctrl {
  position: absolute;
  height: 100%;
  width: 1rem;
  right: .4rem;
  top: 0;
  background: url("../assets/image/chat-setting.svg") no-repeat 50% 50%;
  background-size:auto 30%;
  z-index: 7;
}
.chat-room-ctrl-content {
  position: absolute;
  width: 2.5rem;
  top: 1.3rem;
  right: 1rem;
  padding: 0 .2rem;
  z-index: 7;
  background: #C2C2C2;
  border-radius: .2rem;
  box-shadow: 0 -2px 2px hsla(210,5%,84%,.8), 0 2px 2px hsla(210,5%,84%,.8);
  color: #ffffff;
  .chat-room-clear {
    height: 1rem;
    text-align: center;
    line-height: 1rem;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 5;
}
</style>

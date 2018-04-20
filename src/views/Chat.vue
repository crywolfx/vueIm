<template>
<transition name="fade">
  <div class="chat">
    <div class="chat-list">
      <div v-for="(value,index) in chatList">
        <div class="chat-room" @click="goTalk(value.roomId)">
			<div class="chat-room-icon" :style="{backgroundImage:`url(${value.src})`}"></div>
			<div class="chat-room-info">
				<div class="chat-room-name">{{value.roomName}}</div>
				<div class="chat-room-message">{{homeMsg[value.roomId] && homeMsg[value.roomId].count ? '[' + homeMsg[value.roomId].count + '条]' : ''}}{{homeMsg[value.roomId] && homeMsg[value.roomId].nickName ? homeMsg[value.roomId].nickName + ':' : ''}}{{homeMsg && homeMsg[value.roomId] && homeMsg[value.roomId].msg ? homeMsg[value.roomId].msg : ''}}</div>
			</div>
			<span class="chat-room-ctrl" @click.stop="roomShowFunc(value)"></span>
        <transition name="bounce">
          <div class="chat-room-ctrl-content" v-if="roomShow == value+'true' ">
            <div class="chat-room-clear" @click.stop="clearMsg(value)">已读</div>
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
        flag: false,
        roomMsg: {},
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
  watch:{

  },
  computed: {
    homeMsg() {
      return this.$store.state.homeMsg;
    },
    chatList() {
      return this.$store.state.chatList;
    }
  },
  mounted() {
      this.socket.on('receive msg', data => {
          let msg = data.img ? '[图片]' : data.msg;
          if (!this.roomMsg[data.roomId]) {
            this.roomMsg[data.roomId] = {}
            this.roomMsg[data.roomId].count = 0;
          }
          this.roomMsg[data.roomId].count++;
          this.roomMsg[data.roomId].msg = msg;
          this.roomMsg[data.roomId].nickName = data.nickName;
          this.$store.commit('SET_HOME_MSG',this.roomMsg);
       })
  },
  methods: {
    clearMsg(roomId) {
      this.homeMsg[roomId] = {}
      this.$store.commit('SET_HOME_MSG',this.roomMsg);
      this.flag = false;
      this.roomShow = '';
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
    height: 1.6rem;
    background: #FCFCFC;
    padding: 0 .2rem;
    border-bottom: 1px solid #DEDEDE;
    position: relative;
  }
  .chat-room-icon {
	  float: left;
	  height: 1.6rem;
	  box-sizing: border-box;
	  width: 1.2rem;
    padding: .2rem 0;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
  }
  .chat-room-info {
	  float: left;
    overflow: hidden;
    box-sizing: border-box;
    padding: .1rem .2rem;
    max-width: 70%;
  }
  .chat-room-name {
	  height: .7rem;
	  line-height: .7rem;
    font-size: .4rem;
    color: #353535;
  }
  .chat-room-message {
	  height: .7rem;
    line-height: .7rem;
    color: #999999;
    max-width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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

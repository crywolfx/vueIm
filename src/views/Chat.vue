<template>
  <div class="chat">
    <div class="chat-list"> 
      <div class="chat-room" @click="goTalk('default_1')">官方聊天室1</div>
      <div class="chat-room" @click="goTalk('default_2')">官方聊天室2</div>
      <div class="chat-room" @click="goTalk('default_3')">官方聊天室3</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Chat",
  data() {
    return {
        count: 0,
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
    showAdd() {
      this.isShowAdd = !this.isShowAdd;
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
  }
}

</style>

<template>
<transition :name="transName">
  <div class="contcats">
      <div class="contcats-box">
          <div class="chat-room" @click="goTalk('default_1')">官方聊天室1</div>
          <div class="chat-room" @click="goTalk('default_2')">官方聊天室2</div>
          <div class="chat-room" @click="goTalk('default_3')">官方聊天室3</div>
      </div>
  </div>
</transition>
</template>
<script>
export default {
    name: 'Contcats',
    data() {
        return {
            transName: 'chat'
        }
    },
  
}
</script>
<style lang="less" scoped>
.chat-enter-active {
  transition: all .2s;
}
.chat-leave-active {
  transition: all .2s;
}
.chat-enter, .chat-leave-active {
  transform: translateX(100%);
  opacity: 1;
}

.contcats {
    position: absolute;
    height: 100%;
    width: 100%;
    background: #ebebeb;
}
.contcats-box{
    box-sizing: border-box;
    padding-top: 1.2rem;
}
</style>

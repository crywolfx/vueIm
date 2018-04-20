<template>
<transition :name="transName">
  <div class="contcats">
      <div class="contcats-box">
          <div class="group">
              <div class="group-title group-title-title"><div><span class="group-title-image"></span><span>群组</span></div></div>
              <div class="group-list" v-for="value in groupList" @click="goTalk(value.roomId)">
                    <div class="group-title"><div><span class="group-title-image" :style="{backgroundImage:`url(${value.src})`}"></span><span>{{value.roomName}}</span></div></div>
              </div>
          </div>
      </div>
  </div>
</transition>
</template>
<script>
export default {
    name: 'Contcats',
    data() {
        return {
            transName: 'chat',
            groupList:[],
        }
    },
    created() {
        this.getFriendList();
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }
    },
    methods: {
        getFriendList() {
            this.axios.post('http://192.168.1.116:3000/room/findlist', {userName:this.userInfo.userName})
                .then( res => {
                    if(res.data.success){
                        this.groupList = res.data.list;
                    }
                }) 
        },
        goTalk(roomId) {
            this.$router.push({
                name:'chating',
                params: { roomid: roomId }
            })
        }
    }
  
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
    color: #3D3D3D;
}
.contcats-box{
    box-sizing: border-box;
    width: 100%;
    padding: 1.2rem 0 0 0;
}
.group {
    width: 100%;
    overflow: hidden;
}
.group-title-title {
    margin-bottom: .2rem;
}
.group-title {
    box-sizing: border-box;
    height: 1.4rem;
    width: 100%;
    background: #ffffff;
    padding: 0 .3rem;
    div {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #DEDEDE;
        line-height: 1.4rem;
        color: #3D3D3D;
    }
    .group-title-image {
        height: 1.1rem;
        display: block;
        width: 1.1rem;
        float: left;
        margin-top: .15rem;
        margin-right: .2rem;
        background: url('../assets/image/group.svg');
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: contain;
    }
}
</style>

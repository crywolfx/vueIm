<template>
  <div class="chating">
      <vHeader class="chat-header" :msg="`IM(当前在线${userListLen}人)`" :image="leftImage" @leftFunc="doBack()" @getHeader="getHeader"/>
      <div class="message-box-outer" ref="messageBoxOut">
         <div class="message-box" ref="messageBox">
          <div v-for="obj in messageList">
              <div v-if="obj.type == 1">
                  <div class="message-jlmsg">{{obj.data.jlMsg}}</div>
              </div>
              <div v-else-if="obj.type == 2">
                  <div class="message-other">
                      <div class="message-other-img message-other-line"><img :src="obj.data.src" alt="avatar"></div>
                      <div class="message-content-box message-other-line">
                          <div class="message-other-username"><span>{{obj.data.nickName}}</span><span>{{obj.data.time}}</span></div>
                          <div class="message-other-msg text-wrap">{{obj.data.msg}}</div>
                      </div>
                  </div>
              </div>
              <div v-else>
                  <div class="message-other">
                      <div class="message-other-img message-other-line2"><img :src="obj.data.src" alt="avatar"></div>
                      <div class="message-content-box2 message-other-line2">
                          <div class="message-other-username message-other-username2"><span>{{obj.data.nickName}}</span><span>{{obj.data.time}}</span></div>
                          <div class="message-other-msg message-other-msg2 text-wrap">{{obj.data.msg}}
                              <div v-if="!obj.haveRc" class="message-loading message-other-line2"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      </div>
      <div class="input-box" ref="footerBox">
          <input type="text" v-model="msgContent" class="input-item input-content"  @keydown.13="sendMsg()">
          <div class="input-item input-image"></div>
          <div class="input-item input-send" :class="[ haveMsg ? 'input-send-true' : '']" @click="sendMsg()">发送</div>
      </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
  name: 'chating',
  data() {
      return {
          msgContent:'',
          haveMsg: false,   // 是否发送成功
          roomId:'default_1',
          userListLen:'',
          messageList:[],
          leftImage: require('@/assets/image/back.svg'),
          userAroom: {},
          input: /^[\s]*$/
      }
  },
  components: {
      vHeader: Header,
  },
  watch: {
      msgContent(val) { 
          if(!this.input.test(val)) {
              this.haveMsg = true;
          }else {
              this.haveMsg = false;
          }
      }
  },
  created() {
      this.roomId = this.$router.history.current.params.roomid;
  },
  mounted() {
        this.userAroom = {
            roomId: this.roomId,
            userName: this.userInfo.userName,
            nickName: this.userInfo.nickName
        }
        this.socket.emit('join-room',this.userAroom)
        this.socket.on('user joined', data => {
            this.userListInfo(data)           
        })
        this.socket.on('user leaved', data => {
            this.userListInfo(data)
        })
        this.socket.on('receive msg', data => {
            this.setMsgList(data);
        })
  },
  computed: {
      userInfo() {
          return this.$store.state.userInfo;
      }
  },
  methods: {
      getHeader(data) {
          this.oHeaderBox = data;
      },
      userListInfo(data) {
          let usersObj = data.users;
          this.userListLen = Object.keys(usersObj).length;
          let msg = {
              type : 1,
              data: {
                  jlMsg: data.jlMsg
              }
          }
          this.messageList.push(msg);
          this.$nextTick(()=> {
                this.setScroll();
            })
      },
      setScroll() {
          if(this.$refs.messageBox){
              this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight
          }
      },
      setMsgList(data) {
          if(this.userInfo.userName == data.userName){
              this.messageList.map((value,index) => {
                  if(value.type == 3){
                    // value 是自己发送的, data是返回的
                      if(this.isObjectValueEqual(value.data,data)){
                          value.haveRc = true;
                      }
                  }
              })
          }else {
              let msg = {
                type : 2,
                data: data,
              }
              this.messageList.push(msg);
              this.$nextTick(()=>{this.setScroll()})
          }
      },
      sendMsg() {
          if (this.haveMsg) {
              let time =this.getTime();
              let msgData = {
                      userName: this.userAroom.userName,
                      nickName: this.userAroom.nickName,
                      roomId: this.userAroom.roomId,
                      msg: this.msgContent,
                      src: this.userInfo.src,
                      time: time
               }
              this.socket.emit('send msg', msgData);
              let msg = {
                  type: 3,
                  data: msgData,
                  haveRc: false,
              }
              this.msgContent = '';
              this.messageList.push(msg);
            this.$nextTick(()=>{this.setScroll()})
          }
         
      },
      doBack() {
          this.$router.go(-1);
          this.socket.emit('leave-room',this.userAroom)
      },
      getTime() {
          let date = new Date();
          let year = date.getFullYear(); //获取当前年份
          let mon = this.formateTime(date.getMonth() + 1); //获取当前月份
          let da = this.formateTime(date.getDate()); //获取当前日
          let h = this.formateTime(date.getHours()); //获取小时
          let m = this.formateTime(date.getMinutes()); //获取分钟
          let s = this.formateTime(date.getSeconds()); //获取秒
          return `${year}-${mon}-${da} ${h}:${m}:${s}`
      },
      formateTime(time) {
          let timeStr = '';
          if(time < 10){
              timeStr = '0'+ time
          }else {
              timeStr = time;
          }
          return timeStr;
      },
      isObjectValueEqual(a, b) {

        let aProps = Object.keys(a);
        let bProps = Object.keys(b);


        if (aProps.length != bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        return true;
    }
  }

}
</script>
<style lang="less" scoped>
.chat-header {
    position: fixed;
    top: 0;
    left: 0;
}
.chating {
    position: absolute;
    height: 100%;
    width: 100%;
    background: #F1F2F7;
    z-index: 5;
}
.message-box-outer {
    height: 100%;
    width: 100%;
    padding: 1.2rem 0;
    box-sizing: border-box;
}
.message-box {
    height: 100%;
    width: 100%;
    font-family: "Microsoft YaHei";
    background: #F1F2F7;
    box-sizing: border-box;
    overflow-y: scroll;
    .message-jlmsg{
        width: 100%;
        text-align: center;
        padding: .05rem 0;
        color: #ADADAD;
    }
    .message-other{
        box-sizing: border-box;
        overflow: hidden;
        padding: 0 .2rem;
        width: 100%;
        margin: .3rem 0;
        .message-other-line{
            float: left;
        }
        .message-other-img{
            margin-top: .2rem;
            height: 1.3rem;
            width: 1.3rem;
            img{
                display: block;
                height: 100%;
                width: 100%;
            }
        }
        .message-content-box{
            margin-left: .2rem;
            max-width: 60%;
        }
        .message-other-username{
            overflow: hidden;
            color: #ADADAD;
            font-size: .3rem;
            padding: .1rem 0;
            span {
                margin: 0 .2rem;
                float: left;
            }
        }
        .message-other-username2 {
            span {
                float: right;
            }
        }
        .message-other-msg {
            padding: .2rem;
            background: #fff;
            border-radius: .2rem;
            float: left;
        }
        .message-other-line2 {
            float: right;
        }
        .message-content-box2 {
            margin-right: .2rem;
            max-width: 60%;
        }
        .message-other-msg2 {
            background: #10B5F5;
            color: #ffffff;
            float: right;
            position: relative;
        }
        .message-loading {
            height: .4rem;
            width: .4rem;
            background: url("../assets/image/chat-loading.svg") no-repeat 50% 50%;
            background-size: cover;
            position: absolute;
            left: -.6rem;
            top: .21rem;
        }
    }
}
.text-wrap {
    word-wrap: break-word; 
    word-break: normal; 
    word-break:break-all;
}
.input-box {
    position: fixed;
    bottom: 0;
    left: 0;
    background: #ffffff;
    height: 1.2rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0 .3rem;
    display: flex;
    .input-item {
        display: block;
        float: left;
    }
    .input-content {
        height: .8rem;
        flex: 5;
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #DADADA;  //64D03E
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        outline: none;
        padding-left: .2rem; 
    }
    .input-image, .input-send {
        flex:1;
        height: 100%;
    }
    .input-image {
        background: url("../assets/image/image.svg") no-repeat 50% 50%;
        background-size: auto 70%;
    }
    .input-send {
        margin-top: .2rem;
        height: .8rem;
        background: #C4C4C4;
        color: #ffffff;
        border-radius: .1rem;
        line-height: .8rem;
        text-align: center;
    }
    .input-send-true{
        background: #36ADD1;
    }
}
</style>

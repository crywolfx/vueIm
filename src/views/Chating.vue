<template>
<transition name="fade">
  <div class="chating">
      <vHeader class="chat-header" :msg="`${roomInfo.roomName ? roomInfo.roomName : 'IM'}(在线${userListLen}人)`" :image="leftImage" @leftFunc="isLeave = true" @getHeader="getHeader" @add="showAdd"/>
        <vAdd class="chat-add" v-if="isShowAdd" :list="list" :listEN="listEN" @addFunc="addFunc"/> 
      <div class="message-box-outer" ref="messageBoxOut" style="-webkit-overflow-scrolling:touch">
         <div class="message-box" ref="messageBox" style="-webkit-overflow-scrolling:touch">
          <div>
          <div v-for="obj in messageList">
              <div v-if="obj.type == 1">
                  <div class="message-jlmsg">{{obj.data.jlMsg}}</div>
              </div>
              <div v-else-if="obj.type == 2">
                  <div class="message-other">
                      <div class="message-other-img message-other-line"><img :src="obj.data.src ? obj.data.src : defaultImg" alt="avatar"></div>
                      <div class="message-content-box message-other-line">
                          <div class="message-other-username"><span>{{obj.data.nickName}}</span><span>{{obj.data.time}}</span></div>
                          <div class="message-other-msg text-wrap">{{obj.data.msg ? obj.data.msg : ""}}
                              <img v-if="obj.data.img" class="message-image" :src="obj.data.img" alt="" @load="imgOnLoad">
                          </div>
                      </div>
                  </div>
              </div>
              <div v-else>
                  <div class="message-other">
                      <div class="message-other-img message-other-line2"><img :src="obj.data.src ? obj.data.src : defaultImg" alt="avatar"></div>
                      <div class="message-content-box2 message-other-line2">
                          <div class="message-other-username message-other-username2"><span>{{obj.data.nickName}}</span><span>{{obj.data.time}}</span></div>
                          <div class="message-other-msg message-other-msg2 text-wrap">{{obj.data.msg ? obj.data.msg : ""}}
                              <img v-if="obj.data.selfImg" class="message-image" :src="obj.data.selfImg" alt="" @load="imgOnLoad">
                              <div v-if="!obj.haveRc" class="message-loading message-other-line2"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          </div>
      </div>
      </div>
      <div class="input-box" ref="footerBox">
          <input type="text" v-model="msgContent" class="input-item input-content"  @keydown.13="sendMsg()">
          <div class="input-item input-image">
              <input type="file" class="input-file" accept="image/*" @change="getFile">
          </div>
          <div class="input-item input-send" :class="[ haveMsg ? 'input-send-true' : '']" @click="sendMsg()">发送</div>
      </div>
      <transition name="slide-fade">
      <div class="leave-room" v-if="isLeave">
          <span></span>
          <div @click="$router.push({ name:'chat'})">返回并在主页接收消息</div>
          <div @click="doBack">离开房间</div>
      </div>
      </transition>
       <transition name="slide-fade">
      <div class="leave-mask" v-if="isLeave || disconnect || reconnect" @click="isLeave = false"></div>
       </transition>
       <div class="disconnect" v-if="disconnect">
            <div class="title">糟糕，网络中断，请检查网络</div> 
            <div class="do" @click="disconnect = false">我知道了</div>      
       </div>
        <div class="connect" v-if="reconnect && !disconnect">
            <div class="loading"><vLoading /></div>  
            <div class="title">正在重连</div> 
       </div>
  </div>
</transition>
</template>
<script>
import Header from "@/components/Header.vue";
import Add from "@/components/Add.vue";
import Loading from "@/components/loading2.vue";
export default {
    name: 'chating',
    data() {
        return {
            isShowAdd: false,
            msgContent: '',
            haveMsg: false, // 是否发送成功
            roomId: 'default_1',
            userListLen: '',
            messageList: [],
            leftImage: require('@/assets/image/back.svg'),
            userAroom: {},
            input: /^[\s]*$/,
            isLeave: false,
            roomInfo: {},
            defaultImg: require('../assets/image/avatar.jpg'),
            list: ["查看信息"],
            listEN: ['info'],
            disconnect: false,
            reconnect: false,
        }
    },
    components: {
        vHeader: Header,
        vAdd: Add,
        vLoading: Loading
    },
    watch: {
        msgContent(val) {
            if (!this.input.test(val)) {
                this.haveMsg = true;
            } else {
                this.haveMsg = false;
            }
        },
    },
    created() {
        this.roomId = this.$router.history.current.params.roomid;
        this.getRoomMsg();
        this.getRoomInfo();
    },
    mounted() {
        this.userAroom = {
            roomId: this.roomId,
            userName: this.userInfo.userName,
            nickName: this.userInfo.nickName
        }
        this.socket.emit('join-room', this.userAroom)
        this.socket.on('user joined', data => {
            this.userListInfo(data)
        })
        this.socket.on('user leaved', data => {
            this.userListInfo(data)
        })
        this.socket.on('receive msg', data => {
            this.setMsgList(data);
        })
        this.socket.on('disconnect', () => {
            this.disconnect = true;
        })
        this.socket.on('reconnecting', () => {
            this.reconnect = true;
        })
        this.socket.on('reconnect', () => {
            this.reconnect = false;
        })
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        },
        homeMsg() {
            return this.$store.state.homeMsg;
        },
        chatList() {
            return this.$store.state.chatList;
        }
    },
    methods: {
        showAdd() {
            this.isShowAdd = !this.isShowAdd;
        },
        addFunc(data) {
            if(data.name == 'info'){
                this.$router.push({
                    name:'faginfo',
                    query: { group: this.roomId }
                })
            }
        },
        getRoomInfo() {
            this.axios.post(this.api.roomInfo(),{roomId:this.roomId})
                .then(res => {
                    if(res.data.success){
                        this.roomInfo = res.data.roomInfo;
                        let chatList = this.chatList;
                        let flag = true;
                        for (let i = 0; i < chatList.length; i++) {
                            if (chatList[i].roomId == this.roomInfo.roomId) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            chatList.push(this.roomInfo);
                            this.$store.commit('STE_CHAT_LIST',chatList);  
                            localStorage.setItem('chatList', JSON.stringify(chatList));
                        }                
                    }else {
                        console.error("获取房间信息失败");
                    }
            })
        },
        getRoomMsg() {
            this.$store.commit('SET_LOADING_STATE',true);
            this.axios.post(this.api.getMessage(),{roomId:this.roomId})
                .then(res => {
                    this.$store.commit('SET_LOADING_STATE',false);
                    if(res.data.success) {
                        let messageList = res.data.data;
                        let newMessageList = [];
                        messageList.map(value => {
                            let obj = {};
                            if(value.userName == this.userInfo.userName){
                                value.selfImg = value.img;
                                obj = {
                                    type:3,
                                    data:value,
                                    haveRc: true
                                }
                            }else {
                                obj = {
                                    type:2,
                                    data:value
                                }
                            }
                            newMessageList.push(obj);
                        })
                        this.messageList = newMessageList;
                        this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '获取最近80条消息',
                            duration: 1500,
                        })
                        this.$nextTick(() => {
                             this.setScroll();
                        })
                    }else {
                       this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '获取消息失败',
                            duration: 1000,
                        }) 
                    }
                })
        },
        getFile(e) { // 获取图片
            let imageFiles = e.target.files[0];
            this.sendImg(imageFiles);
        },
        pushMsg(msg) {
            this.messageList.push(msg);
            this.$nextTick(() => {
                this.setScroll();
            })
        },
        getHeader(data) {
            this.oHeaderBox = data;
        },
        userListInfo(data) { // 加入聊天离开聊天信息
            let usersObj = data.users;
            this.userListLen = Object.keys(usersObj).length;
            let msg = {
                type: 1,
                data: {
                    jlMsg: data.jlMsg
                }
            }
            this.pushMsg(msg);
        },
        setScroll() {
            if (this.$refs.messageBox) {
                this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight
            }
        },
        setMsgList(data) {
            if (this.userInfo.userName == data.userName) {
                this.messageList.map((value, index) => {
                    if (value.type == 3) {
                        // value 是自己发送的, data是返回的
                        if (this.isObjectValueEqual(value.data, data) || value.data.baseMark == data.baseMark) {
                            value.data.selfImg = data.img;  // 返回改为网络地址
                            value.haveRc = true;
                        }
                    }
                })
            } else {
                let msg = {
                    type: 2,
                    data: data,
                }
                this.pushMsg(msg);
            }
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
        sendImg(imageFiles) { // 发送图片消息
            let url = '';
            let baseMark = Date.now().toString() + imageFiles.name.split('.')[0];
            if (imageFiles) {
                let formData = new FormData();
                url = this.getObjectURL(imageFiles);
                formData.append('userName', this.userInfo.userName);
                formData.append('msgType', 'msg');
                formData.append('file', imageFiles);

            this.axios.post(this.api.msgUpload(), formData)
                .then(res => {
                    if (res.data.success) {
                        url = res.data.data;
                        this.send(url,2,baseMark);
                    }else {
                        console.error("________图片发送失败");
                    }
                })
            }
            this.send(url,1,baseMark);
        },
        sendMsg() { // 发送文本消息
            if (this.haveMsg) {
                let imgUrl = '';
                this.send(imgUrl,0,null);
            }
        },
        send(imgUrl,type,baseMark){
            let time = this.getTime();
            let msgData = {
                userName: this.userAroom.userName,
                nickName: this.userAroom.nickName,
                roomId: this.userAroom.roomId,
                msg: this.msgContent,
                img: '',
                selfImg: '',
                src: this.userInfo.src,
                time: time,
                baseMark: baseMark,
                timeReall: new Date()
            }
            if(type == 1){   // type1 为发送的图片本地预览
                msgData.selfImg = imgUrl;
            }else{
                msgData.img = imgUrl;
                this.socket.emit('send msg', msgData);
            }
            if(type !== 2){   // type2 为上传图片的地址信息
                let msg = {
                    type: 3,
                    data: msgData,
                    haveRc: false,
                }
                this.msgContent = '';
                this.pushMsg(msg);
            }
        },
        imgOnLoad() {
            this.setScroll();
        },
        doBack() {
            this.socket.emit('leave-room', this.userAroom);
            this.$router.push({
                name:'chat'
            });
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
            if (time < 10) {
                timeStr = '0' + time
            } else {
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

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.chat-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 7 !important;
}
.chat-add {
  position: fixed;
  top: 1.2rem;
  right: 0;
  z-index: 9;
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
    -webkit-overflow-scrolling: touch;
}
.message-box {
    height: 100%;
    width: 100%;
    font-family: "Microsoft YaHei";
    background: #F1F2F7;
    box-sizing: border-box;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
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
            height: .5rem;
            line-height: .5rem;
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
        .message-image {
            display: block;
            width: 100%;
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
        overflow: hidden;
        .input-file{
            display: block;
            height: 100%;
            width: 100%;
            opacity: 0;
        }
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
.leave-room {
    position: fixed;
    z-index: 9;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 3rem;
    width: 6rem;
    background: #F2F2F2;
    border-radius: .4rem;
    box-sizing: border-box;
    padding:0 .2rem;
    div {
        height: 1.5rem;
        line-height: 1.5rem;
        width: 100%;
        text-align: center;
        font-size: .4rem;
    }
    span {
        position: absolute;
        height: 1px;
        background: #000;
        top: 50%;
        left: 0;
        width: 100%;
    }
}
.leave-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 8;
    height: 100%;
    width: 100%;
    background:rgba(115, 115, 115, .8);
}
.disconnect {
    box-sizing: border-box;
    padding: .4rem;
    height: 3rem;
    width: 6rem;
    background: #ffffff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: .2rem;
    z-index: 9;
    .title {
        height: 1.1rem;
        line-height: 1.1rem;
        width: 100%;
        font-size: .4rem;
        color: #3f3f3f;
    }
    .do {
        height: 1.1rem;
        line-height: 1.1rem;
        width: 100%;
        text-align: right;
        font-size: .4rem;
        color: #FC4241;
    }
}
.connect {
    height: 4rem;
    width: 4rem;
    background: rgba(53, 53, 53, 0.527);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    border-radius: .5rem;
    z-index: 9;
    .title {
        height: 1.1rem;
        line-height: 1.1rem;
        color:#fff;
    }
    .loading {
        position: absolute;
        top: 1.1rem;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>

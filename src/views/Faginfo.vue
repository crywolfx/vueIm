<template>
<transition name="trans">
    <div class="fag-info">
        <vHeader class="header" msg="查看信息" :image="leftImage" :right="right" @leftFunc="$router.go(-1)"/>
        <div class="group-none"  v-if="!groupInfo">

        </div>
        <div class="group-info" v-if="groupInfo && groupInfo.roomId">
            <div class="group-item-image">
                <div>
                    <img :src="groupInfo.src" alt="">
                </div>
            </div>
            <div class="group-item-box">
                <div class="group-item">
                    <div class="left"><b>群组名称:</b></div>
                    <div class="right">{{groupInfo.roomName}}</div>
                </div>
            </div>
            <div class="group-item-box">
                <div class="group-item">
                    <div class="left"><b>群组ID:</b></div>
                    <div class="right">{{groupInfo.roomId}}</div>
                </div>
            </div>
            <div class="group-item-box">
                <div class="group-item">
                    <div class="left"><b>群组人数:</b></div>
                    <div class="right">{{groupInfo.member.length}}</div>
                </div>
            </div>
            <div class="group-item-box">
                <div class="group-item">
                    <div class="left"><b>群主ID:</b></div>
                    <div class="right">{{groupInfo.roomUser}}</div>
                </div>
            </div>
            <div class="group-item-box group-ctrl">
                <div class="group-item group-go-in">
                    <div v-if="groupInfo.isMember || groupInfo.isMaster" @click="$router.push({ name:'chating', params: { roomid:roomId}
})">
                        已在群组，加入聊天
                    </div>
                    <div v-else @click="joinRoom(groupInfo.roomId)">
                        加入群组
                    </div>
                </div>
            </div>
            <div class="group-item-box group-ctrl" v-if="groupInfo.isMember || groupInfo.isMaster">
                <div class="group-item group-go-in group-go-left">
                    <div v-if="groupInfo.isMember" @click="isLeave = true">
                        删除并退出群组
                    </div>
                    <div v-if="groupInfo.isMaster" @click="isDel = true">
                        删除并解散群组
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
        <div class="del-content" v-if="isDel">
            <div class="del-title">是否删除并解散群聊</div>
            <div class="del-container">
                <div class="del-next" @click="delroom(groupInfo.roomId)">删除</div>
                <div class="del-cancel" @click="isDel = false">取消</div>
            </div>
        </div>
        </transition>
        <transition name="fade">
        <div class="del-content" v-if="isLeave">
            <div class="del-title">是否离开群组</div>
            <div class="del-container">
                <div class="del-next" @click="leaveRoom(groupInfo.roomId)">离开</div>
                <div class="del-cancel" @click="isLeave = false">取消</div>
            </div>
        </div>
        </transition>
        <transition name="fade">
        <div class="mask" @click="isDel = false; isLeave = false" v-if="isDel || isLeave"></div>
        </transition>
    </div>
</transition>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
    name: 'Faginfo',
    data() {
        return {
            leftImage: require('@/assets/image/back.svg'),
            right: require('@/assets/image/00.png'),
            groupInfo: null,
            roomId:'',
            isDel: false,
            isLeave: false
        }
    },
    components: {
        vHeader: Header
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        },
        chatList() {
            return this.$store.state.chatList;
        }
    },
    created() {
        this.getInfo();
    },
    methods: {
        getInfo() {
            let query = this.$router.history.current.query;
            if (query.group) {
                this.getGroupInfo(query.group)
            } else if (query.friend) {
                this.getFriendInfo(query.friend);
            }
        },
        getGroupInfo(roomId) {
            this.$store.commit('SET_LOADING_STATE',true);
            this.roomId = roomId;
            this.axios.post(this.api.roomInfo(), {
                    roomId: roomId
                })
                .then(res => {
                    this.$store.commit('SET_LOADING_STATE',false);
                    if (res.data.success) {
                        let info = res.data.roomInfo;
                        if (this.userInfo.userName == info.roomUser) {
                            info.isMaster = true;
                        } else {
                            for (let i = 0; i < info.member.length; i++) {
                                if (info.member[i] == this.userInfo.userName) {
                                    info.isMember = true;
                                    break;
                                }
                            }
                        }
                        this.groupInfo = info;
                    }
                })
        },
        joinRoom(roomId) {
                this.$store.commit('SET_LOADING_STATE',true);
                this.axios.post(this.api.joinRoom(), {
                    userName: this.userInfo.userName,
                    roomId: roomId
                }).then( res => {
                    this.$store.commit('SET_LOADING_STATE',false);
                    if(res.data.success) {
                        this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '加入群聊成功',
                            duration: 1000,
                        })
                        this.$router.push({
                            name:'chating',
                            params: { roomid: roomId }
                        })  
                    }else {
                        this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '不知道什么原因,加入失败 -_-',
                            duration: 1000,
                        })
                    }
                })           
        },
        delroom(roomId) {
            this.$store.commit('SET_LOADING_STATE',true);
            this.axios.post(this.api.delRoom(),{
                userName: this.userInfo.userName,
                roomId: roomId
            }).then( res=> {
                this.$store.commit('SET_LOADING_STATE',false);
                if(res.data.success) {
                    this.$store.commit('SET_TOAST', {
                        isShow: true,
                        content: "删除并解散群组",
                        duration: 1000,
                    })
                    this.delChatList();
                    this.$router.push({
                        name:'chat',
                    }) 
                }else {
                    this.$store.commit('SET_TOAST', {
                        isShow: true,
                        content: res.data.msg,
                        duration: 1000,
                    })
                    this.isDel = false;
                }
            })
        },
        leaveRoom(roomId) {
            this.$store.commit('SET_LOADING_STATE',true);
            this.axios.post(this.api.leaveRoom(),{
                userName: this.userInfo.userName,
                roomId: roomId
            }).then( res=> {
                this.$store.commit('SET_LOADING_STATE',false);
                if(res.data.success) {
                    this.$store.commit('SET_TOAST', {
                        isShow: true,
                        content: "退出群聊成功",
                        duration: 1000,
                    })
                    this.delChatList();
                    this.$router.push({
                        name:'chat',
                    }) 
                }else {
                    this.$store.commit('SET_TOAST', {
                        isShow: true,
                        content: "退出失败",
                        duration: 1000,
                    })
                    this.isLeave = false;
                }
            })            
        },
        delChatList() {
            this.socket.emit('leave-room', {
                roomId: this.groupInfo.roomId,
                userName: this.userInfo.userName,
                nickName: this.userInfo.nickName
            });
            let chatList = this.chatList;
            let roomId = '';
            let index = '';
            for (let i = 0; i < chatList.length; i++) {
                if (chatList[i].roomId == this.groupInfo.roomId) {
                    roomId = chatList[i].roomId;
                    index = i;
                    break;
                }
            }
            if (roomId) {
                chatList.splice(index,1);
                this.$store.commit('STE_CHAT_LIST', chatList);
                localStorage.setItem('chatList', JSON.stringify(chatList));
            }
        }

    }
}
</script>
<style lang="less" scoped>
.trans-enter-active {
  transition: all .2s;
}
.trans-leave-active {
  transition: all .2s;
}
.trans-enter, .trans-leave-active {
  transform: translateX(-100%);
  opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fag-info {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #EBEBEB;
}
.header {
    position: fixed;
    top: 0;
    left: 0;
}
.group-none {
    box-sizing: border-box;
    padding-top: 1.2rem;
    width: 100%; 
    height: 100%;
    background: #FEFEFE url('../assets/image/404.jpg') no-repeat 50% 50%;
    background-size: contain; 
}
.group-info {
    box-sizing: border-box;
    padding-top: 1.2rem;
    width: 100%;
}
.group-item-image {
    height: 3rem;
    width: 100%;
    background: #ffffff;
    margin-bottom: .3rem;
    overflow: hidden;
    div {
        height: 2.8rem;
        width: 2.8rem;
        margin: .1rem auto;
        border-radius: 50%;
        overflow: hidden;
    }
    img {
        display: block;
        height: 2.8rem;
        width: 2.8rem;
    }
}
.group-item-box {
    width: 100%;
    box-sizing: border-box;
    height: 1.1rem;
    background: #fff;
    padding: 0 .3rem;
    .group-item {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        line-height: 1.1rem;
        border-bottom: 1px solid #DEDEDE;
        color: #575757;
        div {
            width: 50%;
            height: 100%;
        }
        .left {
            float: left;
        }
        .right {
            text-align: right;
            float: right;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            color: #999999;
        }
    }
}
.group-ctrl {
    margin-top: .3rem;
    background: none;
    .group-go-in {
        background: #21CF3E;
        color: #fff;
        text-align: center;
        font-size: .4rem;
        border-radius: .2rem;
        div {
            height: 100%;
            width: 100%;
        }
    }
    .group-go-left {
        background: #FC4241;
        color: #fff;
        text-align: center;
        font-size: .4rem;
        border-radius: .2rem;
    }
}
.del-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 3rem;
    width: 6rem;
    z-index: 7;
    background: #fff;
    box-sizing: border-box;
    padding: .4rem;
    .del-title {
        height: 50%;
        line-height: 1.1rem;
        font-size: .4rem;
    }
    .del-container {
        height: 50%;
        line-height: 1.1rem;
        font-size: .35rem;
        overflow: hidden;
        div {
            float: right;
            margin: 0 .2rem;
        }
        .del-next {
            color: #FC4241;
        }
        .del-cancel {
            color: #808080;
        }
    }
}
.mask {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: rgba(153, 153, 153, .5);
    z-index: 6;
}
</style>

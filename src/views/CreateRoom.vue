<template>
<transition name="fade">
  <div class="create-room">
      <vHeader class="header" msg="创建群聊" :image="leftImage" :right="right" @leftFunc="$router.go(-1)" @add="doCreate"/>
      <div class="create-content">
          <div class="create-img" :style="{backgroundImage:`url(${ previewUrl ? previewUrl : addImg })`}"><input type="file" accept="image/*" @change="getFile"></div>
          <div class="create-input">
              <input type="number" placeholder="请输入房间ID(4-10位数字)" v-model="roomId" @input="change()">
              <input type="text" placeholder="请输入房间名称(4-10位)" v-model="roomName" @input="change()">
          </div>
          <div class="create-do" :class="[canCreate ? 'create-do-true' : '']" @click="doCreate">点击创建</div>
      </div>
  </div>
</transition>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
    name:'CreateRoom',
    data() {
        return {
            leftImage: require('@/assets/image/back.svg'),
            right: require('@/assets/image/right2.svg'),
            addImg: require('@/assets/image/create-add.svg'),
            roomId:'',
            roomName: '',
            canCreate: false,
            imageFiles: null,
			previewUrl: '',
        }
    },
    components: {
        vHeader: Header,
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }        
    },
    methods: {
        getFile(e) {
            this.imageFiles = e.target.files[0];
            this.previewUrl= this.getObjectURL(this.imageFiles);
        },
        change() {
            if (this.roomId && this.roomName && this.roomId.length > 3 && this.roomId.length < 11 && this.roomName.length > 3 && this.roomName.length < 11) {
                this.canCreate = true;
            } else {
                this.canCreate = false;
            }
        },
        doCreate() {
            if(this.canCreate && this.imageFiles){
                this.axios.post('http://192.168.1.116:3000/room/checkname',{roomId:this.roomId})
                    .then(res => {
                        if(res.data.success){
                            this.uploadImg();
                        }else {
                            this.$store.commit('SET_TOAST', {
                                isShow: true,
                                content: '该房间ID已存在',
                                duration: 1000,
                            })
                        }
                    })
            }else {
                this.$store.commit('SET_TOAST', {
                    isShow: true,
                    content: '请上传群聊头像',
                    duration: 1000,
                })
            }
        },
        uploadImg() {
            let formData = new FormData();
            formData.append('roomId', this.roomId);
            formData.append('file', this.imageFiles)
            this.axios.post('http://192.168.1.116:3000/room/upload/room', formData)
                .then(res => {
                    if (res.data.success) {
                        this.saveRoom(res.data.data)
                    } else {
                        this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '房间头像上传失败',
                            duration: 1000,
                        })
                    }
                })            
        },
        saveRoom(src) {
            this.$store.commit('SET_LOADING_STATE',true);
            let data = {
                roomId: this.roomId,
                roomName: this.roomName,
                roomUser: this.userInfo.userName,
                src: src,
                member: [this.userInfo.userName]
            }
            this.axios.post('http://192.168.1.116:3000/room/saveroom', data)
                .then(res => {
                    this.$store.commit('SET_LOADING_STATE',false);
                    if (res.data.success) {
                        this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '创建成功',
                            duration: 1000,
                        })
                        this.$router.push({name:'contcats'})
                    } else {
                        this.$store.commit('SET_TOAST', {
                            isShow: true,
                            content: '创建失败',
                            duration: 1000,
                        })
                    }
                })
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
.header {
    position: fixed;
    top: 0;
    left: 0;
}
.create-room {
    position: absolute;
    height: 100%;
    width: 100%;
    background: #EBEBEB;
}
.create-content {
    padding-top: 1.2rem;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
}
.create-img {
    height: 4rem;
    width: 4rem;
    background: url('../assets/image/create-add.svg');
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    margin: 1rem auto;
    input {
        display: block;
        height: 100%;
        width: 100%;
        opacity: 0;
    }
}
.create-input {
    width: 6rem;
    overflow: hidden;
    margin: 1.5rem auto;
    input {
        display: block;
        margin-bottom: .8rem;
        background: #ffffff;
        outline: none;
        border: none;
        border-radius: 0.3rem;
        height: .8rem;
        width: 100%;
        text-align: center;
    }
}
.create-do {
    color: #CFCFCF;
    width: 8rem;
    height: 1rem;
    margin: 0 auto;
    background: #777777;
    border-radius: .4rem;
    text-align: center;
    font-size: .5rem;
    line-height: 1rem;
}
.create-do-true {
    background: #36ADD1;
    color: #fff;
}
</style>

<template>
<transition name="trans">
  <div class="find">
       <vHeader class="header" msg="IM" :image="leftImage" :right="right" @leftFunc="$router.go(-1)"/>
       <div class="find-content">
           <div class="find-input-box">
               <div class="find-input-content">
                   <div class="find-input-icon"></div><input type="text" class="find-input" placeholder="用户ID/群组ID" v-model="findId">
               </div>
           </div>
           <transition name="fade">
                <div class="find-type" v-show="findId">
                    <div class="find-type-content">找人: <span>{{findId}}</span> </div>
                    <div class="find-type-content" @click="findGroup">找群: <span>{{findId}}</span> </div>
                </div>        
           </transition>
       </div>
  </div>
</transition>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
    name:'Find',
    data() {
        return {
            leftImage: require('@/assets/image/back.svg'),
            right: require('@/assets/image/00.png'),
            findId:'',
        }
    },
    watch: {

    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }
    },
    components: {
        vHeader: Header
    },
    methods: {
        findGroup() {
            this.$router.push({
                name:'faginfo',
                query: { group: this.findId }
            })
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
  transform: translateX(100%);
  opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.find {
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
.find-content {
    height: 100%;
    width: 100%;
    padding-top: 1.2rem;
    box-sizing: border-box;
}
.find-input-box {
    margin-top: .4rem;
    height: 1.2rem;
    padding: 0 .2rem;
    box-sizing: border-box;
    background: #FFFFFF;
}
.find-input-content {
    height: 100%;
    width: 100%;
    border-bottom: 1px solid #13BA48;
    display: flex;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.find-input-icon {
    float: left;
    height: .8rem;
    width: .8rem;
    margin-top: .2rem;
    margin-left: .2rem;
    background:url('../assets/image/find-search.svg') no-repeat 50% 50%;
    background-size: contain;
}
.find-input {
    float: left;
    height: 100%;
    border: 0;
    outline: none;
    background: none;
    flex: 1;
    box-sizing: border-box;
    padding: 0 .2rem;
    font-size: .4rem;
    color: #575757;
    line-height: 1.2rem;
}
.find-type {
    margin-top: .34rem;
}
.find-type-content {
    box-sizing: border-box;
    height: 1rem;
    width: 100%;
    border-bottom: 1px solid #DEDEDE;
    background: #fff;
    padding: 0 .5rem;
    line-height: 1rem;
    font-size: .35rem;
    color: #575757;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    span {
        margin-left: .2rem;
    }
}
.find-result {
    position: absolute;
    top: 7rem;
    width: 100%;
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
    .group-join {
        float: right;
        display: block;
        height: .8rem;
        padding: 0 .2rem;
        margin-top: .3rem;
        line-height: .8rem;
        background: #13BA48;
        color: #fff;
        border-radius: .2rem;
    }
}
</style>

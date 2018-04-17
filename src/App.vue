<template>
  <div id="app">
      <vHeader class="chat-header" msg="IM" @add="showAdd"/>
      <vAdd class="chat-add" v-if="isShowAdd" :list=this.list />
      <div class="mask" v-if="isShowAdd" @click="isShowAdd = false"></div>
    <router-view/>
    <vtoast class="toast" />
    <vFooter />
  </div>
</template>
<script>
  import Header from "@/components/Header.vue";
  import Add from "@/components/Add.vue";
  import Footer from "@/components/Footer.vue";
  import toast from '@/components/toast.vue'
  export default {
  name: 'app',
  data() {
    return {
      isShowAdd: false,
      list: ["在线匹配", "创建群聊"]
    };
  },
  components: {
    vtoast:toast,
    vFooter: Footer,
    vHeader: Header,
    vAdd: Add
  },
  methods: {
    showAdd() {
      this.isShowAdd = !this.isShowAdd;
    }
  }
}
</script>
<style lang="less">
@import "./assets/css/reset.css";
.toast{
  position: fixed;
  top: 80%;
  left: 50%;
  transform: translate(-50%,0);
  z-index: 10;
}
.chat-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}
.chat-add {
  position: fixed;
  top: 1.2rem;
  right: 0;
  z-index: 4;
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 3;
}
</style>

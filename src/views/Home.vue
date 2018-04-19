<template>
  <div class="home">
      <vHeader class="home-header" msg="IM" @add="showAdd"/>
      <vAdd class="home-add" v-if="isShowAdd" :list="list" /> 
       <router-view/>
      <div class="mask" v-if="isShowAdd" @click="isShowAdd = false"></div>
      <vFooter />
  </div>
</template>
<script>
  import Header from "@/components/Header.vue";
  import Add from "@/components/Add.vue";
  import Footer from "@/components/Footer.vue";
export default {
    name: 'Home',
    data() {
        return {
            isShowAdd: false,
            list: ["在线匹配", "创建群聊"]
        };
    },
    components: {
        vFooter: Footer,
        vHeader: Header,
        vAdd: Add
    },
    methods: {
        showAdd() {
            this.isShowAdd = !this.isShowAdd;
        },
    }
}
</script>
<style lang="less" scoped>
.home-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}
.home-add {
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

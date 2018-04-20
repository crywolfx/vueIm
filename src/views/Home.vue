<template>
<transition name="fade">
  <div class="home">
      <vHeader class="home-header" msg="IM" @add="showAdd" @leftFunc="findFAG"/>
      <vAdd class="home-add" v-if="isShowAdd" :list="list" :listEN="listEN" @addFunc="addFunc"/> 
       <router-view/>
      <div class="mask" v-if="isShowAdd" @click="isShowAdd = false"></div>
      <vFooter />
  </div>
</transition>
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
            list: ["在线匹配", "创建群聊"],
            listEN: ['find','create']
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
        addFunc(data) {
            if(data.name == 'create'){
                this.$router.push({
                    name:'createroom'
                })
            }
        },
        findFAG() {
            this.$router.push({
                name:'find'
            })
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
  transform: translateX(-100%);
  opacity: 1;
}

.home-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
.home-add {
  position: fixed;
  top: 1.2rem;
  right: 0;
  z-index: 9;
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 8;
}
</style>

<template>
<transition name="fade">
    <div class="add">
        <div v-for="(value,index) in list" class="list" @click="addFunc(listEN[index])">{{value}}</div>
    </div>
</transition>
</template>
<script>
  export default {
      name:'Add',
      props:["list","listEN"],
      methods: {
          addFunc(target) {
              this.$emit('addFunc',{name:target})
          }
      }
  }  
</script>
<style lang="less" scoped>
.fade-enter-active {
  transition: all .3s ease-in-out;
}
.fade-leave-active {
  transition: all .3s ease-in-out;
}
.fade-enter, .fade-leave-active {
  transform: translateY(-100%);
  opacity: 1;
}
.add{
    width: 2.4rem;
    background: #36ADD1;
}
.list{
    width: 2.4rem;
    height: 1.1rem;
    line-height: 1.1rem;
    text-align: center;
    color: #ffffff;
    font-size: .4rem;
    border-bottom: .01rem solid #2E97B8;
}
.list:nth-last-child(1) {
    border: none;
}
</style>

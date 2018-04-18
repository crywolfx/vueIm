<template>
  <div id="app">
    <router-view/>
    <vtoast class="toast" />
  </div>
</template>
<script>
  import toast from '@/components/toast.vue'
  export default {
  name: 'app',
  data() {
    return {
      
    };
  },
  components: {
    vtoast:toast,
  },
  methods: {
    
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
// .mask{
//   position: fixed;
//   top: 0;
//   left: 0;
//   height: 100%;
//   width: 100%;
//   z-index: 3;
// }
</style>

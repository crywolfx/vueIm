<template>
  <div id="app">
    <router-view/>
    <vtoast class="toast" />
    <vLoading v-show ="isLoading"/>
  </div>
</template>
<script>
  import toast from '@/components/toast.vue'
  import loading from '@/components/loading.vue'
  export default {
      name: 'app',
      data() {
          return {

          };
      },
      components: {
          vtoast: toast,
          vLoading: loading
      },
      computed: {
        isLoading() {
          return this.$store.state.isLoading;
        }
      },
      methods: {

      },
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

</style>

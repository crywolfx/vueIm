<template>
 <div class="header" ref="headerBox">
   <div class="left" :style="{backgroundImage:`url(${image})`}" @click="leftFunc()"></div>
   <div class="center">{{msg}}</div>
   <div class="right" :style="{backgroundImage:`url(${right})`}" @click="add()"></div>
 </div>  
</template>
<script>

export default {
    name: "Header",
    data() {
        return {

        }
    },
    props: {
        msg: String,
        image: {
            default: () => {
                return require('@/assets/image/search.svg')
            }
        },
        right: {
            default: () => {
                return require('@/assets/image/add.svg')
            }
        }
    },
    mounted() {
        this.$emit("getHeader", this.$refs.headerBox)
    },
    methods: {
        add() {
            this.$emit("add", null);
        },
        leftFunc() {
            this.$emit('leftFunc', null)
        }
    }
};
</script>
<style lang="less" scoped>
.header{
  height: 1.2rem;
  width: 100%;
  background: #36ADD1;
  color: #ffffff;
  z-index: 10;
  div {
    float: left;
  }
}
.left,.right{
  height: 100%;
  width: 18%;
}
.left {
   box-sizing: border-box;
   background: url("../assets/image/search.svg") no-repeat 50% 50%;
   background-size: auto 60%;
}
.right {
   box-sizing: border-box;
   background: url("../assets/image/add.svg") no-repeat 50% 50%;
   background-size: auto 60%;
}
.center{
  width: 64%;
  height: 100%;
  text-align: center;
  line-height: 1.2rem;
  font-size: .4rem;
  overflow: hidden;
  text-overflow:ellipsis; 
  white-space: nowrap;
}

</style>

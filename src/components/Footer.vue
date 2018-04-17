<template>
    <div class="footer">
        <div class="footer-item" v-for="value in list" @click="changeAct(value)">
            <div class="foot-icon" :class="[active==value ? value+'Act' : value ]"></div>
            <div class="foot-text" :class="[active==value ? value+'TxAct' : '' ]">{{value}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        name:'Footer',
        data () {
            return {
                list:['Chat','Contcats','Me'],
            }
        },
        methods: {
            changeAct(value) {
                let path = value.toLowerCase();
                this.$store.commit('SET_ACTIVE_TAB', value);
                localStorage.setItem('activeTab', value);
                this.$router.push({
                    name: path
                })
            }
        },
        computed: {
            active() {
                return this.$store.state.activeTab;
            }
        }
    }
</script>
<style lang="less" scoped>
.footer {
    height: 1.4rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #FCFCFC;
    display: flex;
    border-top: 1px #D8D8D8 solid;
    z-index: 2;
}

.footer-item {
    flex: 1;
    text-align: center;
    font-size: .2rem;
    color: #999999;
    .foot-icon{
        height: .8rem;
        width: 100%;
        margin-top: .1rem;
    }
    .ChatAct {
        background: url("../assets/image/chat2.svg") no-repeat 50% 50%;
        background-size: contain;
    }
    .Chat {
        background: url("../assets/image/chat.svg") no-repeat 50% 50%;
        background-size: contain;
    }
    .ContcatsAct {
        background: url("../assets/image/contcats2.svg") no-repeat 50% 50%;
        background-size: contain;
    }
    .Contcats {
        background: url("../assets/image/contcats.svg") no-repeat 50% 50%;
        background-size: contain;
    }  
    .MeAct {
        background: url("../assets/image/me2.svg") no-repeat 50% 50%;
        background-size: contain;
    }  
    .Me {
        background: url("../assets/image/me.svg") no-repeat 50% 50%;
        background-size: contain;
    }      
    .ContcatsTxAct {
        color: #46C11B;
    }
    .ChatTxAct {
        color: #46C11B;
    }
    .MeTxAct {
        color: #46C11B;
    }
}
</style>

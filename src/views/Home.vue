<style type="text/css" scoped>
    .layout {
        max-width: 1400px;
        margin: 0 auto;
    }

    .mybody {
        /*设置overflow: hidden防止子元素的margin-top不起效（与父元素合并）*/
        overflow: hidden;
        background-color: #f5f5f5;
    }
    .content {
        display: flex;
        justify-content:center;
        align-items: center;

        height: 500px;
    }

    .info-block-container {
        display: flex;
        flex-wrap: wrap;

        justify-content: center;
        align-items: center;
        width: 900px;
        height: 380px;

        border: 1px solid black;
    }

    .info-block {
        height: 130px;
        width: 250px;

        border-radius: 10px;
        border: 1px solid #eeeeee;
        background-color: #f5f7fa;

        margin: 0 20px;

        /*内部布局*/
        display: flex;
        flex-direction: column;

        justify-content: center;
        align-items: center;

        /*鼠标hover时候变手势*/
        cursor:pointer;
    }

    .blockdiv {
        display: inline-block;
    }
</style>

<template>
    <div class="layout">
        <!-- <my-header :user-account="account" v-on:logout="handleLogout"></my-header> -->
        <my-header></my-header>

        <div class="mybody">
            <div class="content">
                <div class="info-block-container">
                    <div class="info-block" @click="routeUser">
                        <Icon type="ios-people" size="60"></Icon>
                        <div><h3 style="font-size: 15px;">用户管理</h3></div>
                    </div>
                    <div class="info-block" @click="routeConfig">
                        <Icon type="ios-keypad" size="60"></Icon>
                        <div><h3 style="font-size: 15px;">配置操作</h3></div>
                    </div>
                    <div class="info-block" @click="routeOplog">
                        <Icon type="ios-paper" size="60"></Icon>
                        <div><h3 style="font-size: 15px;">历史日志</h3></div>                        
                    </div>
                    <div class="info-block">
                    </div>  
                    <div class="info-block">
                    </div>  
                    <div class="info-block">
                    </div>                                                                                           
                </div>                
            </div>

        </div>
     </div>
</template>

<script>
    import Header from '@/components/Header';

    export default {
        name: 'home',
        components: {
            'my-header': Header
        },
    	data () {
    		return {
            }
    	},
    	methods: {
            routeConfig() {
                this.$router.push('/config');
            },
            routeUser() {
                this.$router.push('/userManage');
            },
            routeOplog() {

            },
    	},
        mounted() {
        }
    }
</script>

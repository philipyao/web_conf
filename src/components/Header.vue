<template>
	<div class="header">
		<div class="header_left">
			<h2>Pconf 配置中心</h2>
		</div>      
        <div class="header_right user-info" @click="toggleLogout">
            <span style="font-weight:bold;">{{account}} </span>
            <Icon type="log-out" size="14"></Icon>
        </div>  
        <div class="header_right user-icon">
            <Icon type="android-person" size="16"></Icon>
        </div>
        <div class="header_right help-icon">
            <Icon type="help-circled" size="16"></Icon>
            <span style="font-weight:bold;">帮助 </span>
        </div>

        <Modal v-model="showModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>退出确认</span>
            </p>
            <div style="text-align:center">
                <p>当前所有的修改将丢弃，确定选择退出？</p>
            </div>
            <div slot="footer">
                <Button  @click="toggleLogout">取消</Button>
                <Button type="warning"  @click="handleLogout">确定</Button>
            </div>
        </Modal>        
	</div>

</template>

<script>
	export default {
        //组件data必须是函数
        //这样组件实例就不会共享同一个 data，而是每个组件一个data
        data () {
            return {
		    }
	    },
        computed: {
            showModal () {
                console.log("show: ", this.$store.getters.showConfirmLogout);
                return this.$store.getters.showConfirmLogout;
            },
            account() {
                return this.$store.getters.account;
            },
        },
        methods: {
            toggleLogout() {
                this.$store.dispatch('toggerLogoutModal');
            },
            handleLogout() {
                this.$Message.info('登录退出');
                this.$store.dispatch('toggerLogoutModal');
                this.$store.dispatch('setUser', {account: "", is_super: false});
                this.$router.push('/login');
            },
        }
    }
</script>

<style scoped>
    .header {
        position: positive;
        height: 50px;
        line-height: 50px;
        width: 100%;
        background-color: white;
    }

    .header_left {
    	float: left;
        font-size: 16px;
    }

    .header_right {
        margin-top: 10px;
    	float: right;
    }

    .user-info {
        /*垂直居中*/
        height: 30px;
        line-height: 30px;

        padding: 0 10px 0 0;

        /*鼠标hover时候变手势*/
        cursor:pointer;
    }

    /*鼠标hover时候变颜色*/
    .user-info:hover {
        color:orange;
    }

    .user-icon {
        /*垂直居中*/
        height: 35px;
        line-height: 35px;

        padding: 0 10px 0 0;
    }

    .help-icon {
        /*垂直居中*/
        height: 35px;
        line-height: 35px;

        padding: 0 30px 0 0;
    }
</style>
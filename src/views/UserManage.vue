<style type="text/css">
	ul {
		list-style-type:disc;
	}

    .layout {
        max-width: 1400px;
        margin: 0 auto;
    }

    .mybody {
        /*设置overflow: hidden防止子元素的margin-top不起效（与父元素合并）*/
        overflow: hidden;
        background-color: #f5f5f5;
        height: 1000px;
    }

    .content {
    	margin: 20px auto;
    	height: 500px;
    	width: 1200px;
    	border: 1px solid #eeeeee;
 		border-radius: 10px;
 		background-color: white;
    }
</style>

<template>
    <div class="layout">
        <my-header :user-account="account" v-on:logout="handleLogout"></my-header>

        <div class="mybody">
        	<div class="content">
        	</div>
        </div>
    </div>
</template>

<script>
    import Header from '@/components/Header';

    export default {
        name: 'info',
        components: {
          'my-header': Header
        },
        computed: {
            account() {
                return this.$store.getters.getAccount;
            },
        },

    	data () {
    		return {		
            }
    	},
    	methods: {
            handleLogout() {
                this.$router.push('/login');
            },
            gotoPrev() {
            	this.$router.go(-1);
            },
    	},
        mounted() {
        }
    }
</script>
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

    .cn-header {
    	width: 100%;
    	height: 65px;
    	border-bottom: 1px solid #f5f5f5;
    	display: flex;
    	justify-content: space-between;
    	align-items: center;
    }
    .cn-header-text {
    	margin: -15px 0 0 20px;
    	font-size: 15px;
    	font-weight: bold;
    }
    .cn-header-btn {
    	margin-right: 20px;
    	font-size: 15px;
    	color: white;    	
    }    
    .cn-body {
    	padding: 15px;
    }

	.alert-info {
	    background-color: #d9edf7;
	    border-color: #bce8f1;
	    color: #31708f;
	}
	.alert {
		font-size: 13px;
	    padding: 20px;
	    margin-bottom: 20px;
	    border: 1px solid transparent;
	}	

	.form-panel {
		padding-top: 30px;
		margin: 0 auto;
		width: 70%;
	}

</style>

<template>
    <div class="layout">
        <my-header :user-account="account" v-on:logout="handleLogout"></my-header>

        <div class="mybody">
        	<div class="content">
        		<div class="cn-header">
        			<div class="cn-header-text">新建区间(私有)</div>
        			<Button type="info" class="cn-header-btn" @click="gotoPrev">返回上页</Button>
        		</div>
        		<div class="cn-body">
        			<div class="alert alert-info">
        				<strong>Tips:</strong>
        				<ul style="padding-left: 30px;">
        					<li>私有区间一般表示在特定的服务区间起效，比如gamesvr区间、ranksvr区间等</li>
        					<li>通过创建一个私有的区间可以实现分组管理配置</li>
        					<li>私有区间的配置项会覆盖公有(common)的同名配置，以此来实现某一配置项的自定义</li>
        				</ul>
        			</div>

        			<div class="form-panel">
					    <Form :module="formNamespace" :rules="ruleValidate" :label-width="80">
					        <FormItem label="创建者" style="width: 300px">
					            <label>==> {{ account }}</label>
					        </FormItem>
					        <FormItem label="名称" style="width: 400px">
					            <Input v-model="formNamespace.name"></Input>
					        </FormItem>
					        <FormItem label="备注" rows="4">
					            <Input v-model="formNamespace.desc" type="textarea"></Input>
					        </FormItem>
					        <FormItem>
					            <Button type="primary" >提交</Button>
					        </FormItem>
					    </Form>          				
        			</div>
        		</div>
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
    			formNamespace: {},
                ruleValidate: {
                    name: [
                        { required: true, message: '请填写区间的名称！', trigger: 'blur' }
                    ],
                },    			
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
        	this.formNamespace.author = this.account;
        }
    }
</script>
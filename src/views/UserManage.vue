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
	    		<Button type="primary" @click="showCreateUser = true;">
	            	新增配置
	            </Button>         		
        		<Table width="800" :columns="utblColumns" :data="userData" highlight-row ></Table>
        	</div>
        </div>

        <!--新增用户 Modal 对话框-->
        <Modal v-model="showCreateUser" title="新增用户" >
            <div>
                <Form ref="editCreateUser" :model="editCreateUser" :rules="ruleValidateCreateUser" :label-width="80">
                    <Form-item label="用户名" prop="username">
                        <Input v-model="editCreateUser.username" ></Input>
                    </Form-item>
                    <Form-item label="密码" prop="passwd">
                        <Input v-model="editCreateUser.passwd" ></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="showCreateUser = false;" style="margin-left: 8px">取消</Button>
                <Button type="primary" @click="handleCreateUser('editCreateUser')">确定</Button>                
            </div>
        </Modal>        
    </div>
</template>

<script>
    import Header from '@/components/Header';
    import moment from 'moment';
    
    export default {
        name: 'userManage',
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
                utblColumns: [
                    {
                        title: '用户名',
                        key: 'username',
                        width: 250,
                    },
                    {
                        title: '创建时间',
                        render: (h, params) => {
                            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            d.setUTCSeconds(params.row.created_at);
                            return h('span', moment(d).format('YYYY-MM-DD HH:mm:ss'));
                        }
                    },             
                    {
                        title: '操作',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                        	//render模式下，不要用Switch，用i-switch
                        	return h('i-switch', {
                        		props: {
                        			size: "large",
                        			value: params.row.enabled > 0,
                        		},
                        		on: {
                        			'on-change': (value) => {
                        				console.log(value);
                        			}
                        		}
                        	}, [
                        		h('span', {
									slot: "open",
                        		}, "启用"),
                        		h('span', {
                        			slot: "close",
                        		}, "禁用")                        		
                        	])
                        }
                    }
                ],
                userData: [
                	{
                		username: "hello",
                		created_at: 1519457575,
                		enabled: 1,
                	},
                	{
                		username: "world",
                		created_at: 1519457575,
                		enabled: 0,
                	}
                ],
				showCreateUser: false,
				editCreateUser: {},
                ruleValidateCreateUser: {
                    username: [
                        { required: true, message: '请填写合法的用户名！', trigger: 'blur' }
                    ],
                    passwd: [
                        { required: true, message: '请填写密码！', trigger: 'blur' }
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
            handleCreateUser(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.showCreateUser = false;
                        this.$Message.info("添加用户成功");
                    } else {
                        this.$Message.error('有错误，请更正!');
                    }
                })            	
            },
    	},
        mounted() {
        }
    }
</script>
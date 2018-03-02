<style type="text/css" scoped>
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
        <my-header></my-header>

        <div class="mybody">
        	<div class="content">
	    		<Button type="primary" @click="showCreateUser = true;">
	            	创建用户
	            </Button>         		
        		<Table width="800" :columns="utblColumns" :data="userData" highlight-row ></Table>
        	</div>
        </div>

        <!--新增用户 Modal 对话框-->
        <Modal v-model="showCreateUser" title="创建用户" >  
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
    import api from '@/api/api';
    
    export default {
        name: 'userManage',
        components: {
          'my-header': Header
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
                        				var enable = value ? 1 : 0;
                        				if (params.row.enabled !== enable) {
                        					this.handleChangeUser(params.row, enable);                        					
                        				}
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
                userData: [],
				showCreateUser: false,
				editCreateUser: {},
                ruleValidateCreateUser: {
	                username: [
	                    {required: true, message: '请填写帐号', trigger: 'blur'},
	                    {type: 'string', min: 3, message: '帐号长度不能不能少于3个字符', trigger: 'blur'}
	                ],
	                passwd: [
	                    {required: true, message: '请填写密码', trigger: 'blur'},
	                    {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
	                ],
                },
            }
    	},
    	methods: {
            handleCreateUser(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.editCreateUser.username = this.editCreateUser.username.trim();
                        this.editCreateUser.passwd = this.editCreateUser.passwd.trim();
                        if (this.editCreateUser.username === "" || this.editCreateUser.passwd === "") {
                        	this.$Message.error('有空值，请更正!');
                        	return
                        }
                        this.showCreateUser = false;
                        api.createUser(this.editCreateUser.username, this.editCreateUser.passwd).then((response) => {
                            console.log("createUser rsp: %o", response);
                            if (response.errcode === 0) {
                                var entry = response.entry;
                                this.userData.push(entry);
                                this.editCreateUser.username = "";
                                this.editCreateUser.passwd = "";
                            } else if (response.errcode === 40005) {
                                this.$Modal.warning({
                                    title: "错误",
                                    content: "用户已存在"
                                });
                            }
                        }).catch((error) => {
                            console.log("createUser rsp catch error: ", response);
                        });
                    } else {
                        this.$Message.error('有错误，请更正!');
                    }
                })            	
            },
            handleChangeUser(row, enable) {
                api.changeUser(row.username, enable).then((response) => {
                    row.enabled = enable;
                    if (enable === 0) {
                        this.$Message.info('禁用用户成功!');
                    } else {
                        this.$Message.info('启用用户成功!');
                    }                    
                });
            },         
    	},
        mounted() {
            //列出所有用户
            api.listUser().then((response) => {
                this.userData = response.entries || [];
            });
        }
    }
</script>
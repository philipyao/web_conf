<template>
    <div class="content">
	    <!-- 水平布局：空格在中间，两头放内容 -->
	    <!-- 垂直布局：居中 -->
	    <div class="release">
	        <div class="endpoint" >
	            <div class="blockdiv">
	                <span class="namespace-panel">{{ tagNamespace }}</span>
	            </div>
	            <div class="blockdiv">
	                <h3 style="font-size: 17px;">区间配置</h3>
	            </div>
	            <div class="blockdiv" v-if="changesData.length > 0">
	                <span class="tagUnreleased">有修改  <Badge :count="changesData.length" class-name="badge-update"></Badge></span>
	            </div>

	        </div>
	        <div class="endpoint">
	            <Button type="success" @click="showPublish">
	                发布修改
	            </Button>
	            <Button @click="handleReset">
	                撤销修改
	            </Button>
	            <Button >
	                发布历史
	            </Button>     
	            <Button >
	                重新同步
	            </Button>
	        </div>
	    </div>

	    <div class="edit2">
	        <div class="editside">
	            <Select v-if=" isCommon === false" v-model="currNamespace" style="width:100px;">
	                <Option v-for="item in namespaceData" :value="item.value" :key="item.value">{{ item.label }}</Option>
	            </Select>
	            <Tooltip v-if=" isCommon === false" content="新增作用区间" placement="bottom">
	                <Icon style="margin-left: 8px; cursor: pointer" type="ios-plus-outline" size="28" @click.native="routeCreateNamespace"></Icon>
	            </Tooltip>
	        </div>
	        <div class="editside">
	            <Button type="primary" @click="showNew(false)">
	                新增配置
	            </Button>
	        </div>
	    </div>
	    <Table :columns="tblColumns" :data="configData" border highlight-row ></Table>


	    <!-- 发布对话框 -->
        <Modal v-model="editChangeModal" title="编辑发布信息" width="1000">
            <div>
                <Form ref="editChange" :model="editChange" :label-width="80" :rules="ruleUpdateValidate">
                	<Form-item label="改动" >
		                <div style="border: 1px solid black">
		                    <Table :columns="tblPublishColumns" :data="changesData"></Table>
		                </div>
                    </Form-item>
                    <Form-item label="发布标题" prop="name">
                        <Input v-model="editChange.name" ></Input>
                    </Form-item>
                    <Form-item label="发布人" prop="author">
                        <Input v-model="editChange.author" disabled></Input>
                    </Form-item>                    
                    <Form-item label="发布说明" :rows="4">
                        <Input v-model="editChange.comment" type="textarea"></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="editChangeSubmit('editChange')">发布</Button>
                <Button type="ghost" @click="editChangeCancel()" style="margin-left: 8px">取消</Button>
            </div>
        </Modal>

        <!--新增配置 Modal 对话框-->
        <Modal v-model="editModalNew" title="新增配置" >
            <div>
                <Form ref="editFormNew" :model="editFormNew" :rules="ruleValidateNew" :label-width="80">
                    <Form-item label="命名空间" prop="namespace">
                        <Input v-model="editFormNew.namespace" :disabled="isCommon == true || currNamespace != 'all' "></Input>
                    </Form-item>
                    <Form-item label="键" prop="key">
                        <Input v-model="editFormNew.key" ></Input>
                    </Form-item>
                    <Form-item label="值" prop="value" :rows="4">
                        <Input v-model="editFormNew.value" placeholder="请填写值..." required></Input>
                    </Form-item>
                    <Form-item label="备注">
                        <Input v-model="editFormNew.desc" type="textarea" :autosize="{minRows: 1,maxRows: 2}"></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="editSubmitNew('editFormNew')">确定</Button>
                <Button type="ghost" @click="editCancelNew()" style="margin-left: 8px">取消</Button>
            </div>
        </Modal>

        <!--编辑 Modal 对话框-->
        <Modal v-model="editModal" title="修改配置" >
            <div>
                <Form ref="editForm" :model="editForm" :rules="ruleValidate" :label-width="80">
                    <Form-item label="命名空间" >
                        <Input v-model="editForm.namespace" disabled></Input>
                    </Form-item>
                    <Form-item label="键">
                        <Input v-model="editForm.key" disabled></Input>
                    </Form-item>
                    <Form-item label="值" prop="value" :rows="4">
                        <Input v-model="editForm.value" placeholder="请填写值..." required></Input>
                    </Form-item>
                    <Form-item label="备注说明">
                        <Input v-model="editForm.desc" type="textarea" :autosize="{minRows: 1,maxRows: 2}"></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="editSubmit('editForm')">确定</Button>
                <Button type="ghost" @click="editCancel()" style="margin-left: 8px">取消</Button>
            </div>
        </Modal>

	</div>
</template>

<script>
	import moment from 'moment';
	import api from '@/api/api';

	export default {
		props: {
			isCommon: Boolean,
			initialConfigs: Array,
			initialNames: Array,
		},

        //组件data必须是函数
        //这样组件实例就不会共享同一个 data，而是每个组件一个data
        data () {
            return {
            	rawConfig: this.initialConfigs,
            	rawNamespace: this.initialNames,

            	//当前选中的作用空间
            	currNamespace: 'all',

                //有修改的数据
            	changesData: [],
            	editChange: {},
                editChangeModal: false,

                //修改配置
				editModal: false,
                editIndex: -1,
                editForm: {},

                //新增配置项
                editFormNew: {},
                editModalNew: false,


                tblColumns: [ 
                    {
                        title: '发布状态',
                        render: (h, params) => {
                            if (params.row.value !== params.row.oldvalue) {
                                var labels = [];
                                labels.push(h('span', {
                                    // "class" is a reserved keyword in JS, so you have to quote it.
                                    'class': {
                                        tagUnreleased: true
                                    },                              
                                }, "未发布"));
                                if (params.row.isnew === true) {
                                    labels.push(h('span', {
                                        // "class" is a reserved keyword in JS, so you have to quote it.
                                        'class': {
                                            label: true,
                                            labelNew: true,
                                        },                              
                                    }, "新"));
                                } else {
                                    labels.push(h('span', {
                                        // "class" is a reserved keyword in JS, so you have to quote it.
                                        'class': {
                                            label: true,
                                            labelModify: true,
                                        },                              
                                    }, "改"));
                                }
                                return h('div', labels);
                            } else {
                                //jsx语法格式
                                return h('span', {
                                    // "class" is a reserved keyword in JS, so you have to quote it.
                                    'class': {
                                        tagReleased: true
                                    },
                                }, "已发布");
                            }
                        },
                        width: 120,
                    },
                    {
                        title: '作用区间',
                        key: 'namespace',
                        width: 120,
                        sortable: true,
                    },
                    {
                        title: 'key',
                        key: 'key',
                        width: 150,
                        sortable: true,
                    },
                    {
                        title: 'value',
                        key: 'value',
                    },                                                                            
                    {
                        title: '最后修改',
                        key: 'updated',
                        width: 150,
                        render: (h, params) => {
                            if (params.row.isnew == true) {
                                return h('span', "-");
                            }
                            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            d.setUTCSeconds(params.row.updated);
                            return h('span', moment(d).format('YYYY-MM-DD HH:mm:ss'));
                        }
                    },
                    {
                        title: '最后修改人',
                        key: 'author',
                        width: 150,                  
                    },     
                    {
                        title: '当前版本',
                        render: (h, params) => {
                            if (params.row.isnew == true) {
                                return h('span', "-");
                            } else {
                                return h('span', params.row.version + "");                                
                            }
                        },
                        width: 85,
                    },                       
                    {
                        title: '操作',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '修改',
                                        placement: 'bottom',
                                    },
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'compose',
                                            size: 28,
                                        },
                                        'class': {
                                            opIcon: true,
                                        },                                    
                                        nativeOn: {
                                            click: () => {
                                                this.handleEdit(params.index);
                                            }
                                        }                                    
                                    }),
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '删除',
                                        placement: 'bottom',
                                    },
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'trash-a',
                                            size: 28,
                                        },
                                        'class': {
                                            opIcon: true,
                                        },
                                        nativeOn: {
                                            click: () => {
                                            	this.$Message.warning("暂不支持");
                                            }
                                        }                                    
                                    }),
                                ]),
                            ])
                        }
                    }
                ],

                tblPublishColumns: [
                    {
                        title: '命名空间',
                        key: 'namespace',
                        width: 120,
                    },                
                    {
                        title: '配置名',
                        key: 'key',
                        width: 150,
                    },
                    {
                        title: '发布前值',
                        key: 'oldvalue',
                        width: 250,
                    },
                    {
                        title: '发布后值',
                        key: 'value',
                        width: 250,
                    },
                    {
                        title: '变更',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.isnew === true ? 'yellow' : 'blue';
                            const text = row.isnew === true ? '新增' : '更新';
                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color,
                                }
                            }, text);
                        }
                    },
                ],


                //rules
                ruleValidate: {
                    value: [
                        { required: true, message: '请设置配置的值！', trigger: 'blur' }
                    ],
                },
                ruleUpdateValidate: {
                    name: [
                        { required: true, message: '请填写发布的标题！', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: '请填写发布人！', trigger: 'blur' }
                    ],                    
                },
                ruleValidateNew: {
                    namespace: [
                        { required: true, message: '请设置配置的命名空间！', trigger: 'blur' }
                    ],
                    key: [
                        { required: true, message: '请设置配置的键！', trigger: 'blur' }
                    ],                                        
                    value: [
                        { required: true, message: '请设置配置的值！', trigger: 'blur' }
                    ],
                },    
		    }
	    },
        computed: {
        	tagNamespace() {
        		return this.isCommon === true ? "公有" : "私有";
        	},
        	configData() {
        		var data = [];
        		for (var i = 0; i < this.rawConfig.length; i++) {
        			if (this.currNamespace === "all" || this.currNamespace == this.rawConfig[i].namespace) {
        				data.push(this.rawConfig[i])
        			}
        		}
        		return data;
        	},
        	namespaceData() {
        		var namespaceList = [];
        		for (var i = 0; i < this.rawNamespace.length; i++) {
        			namespaceList.push({
                        value: this.rawNamespace[i],
                        label: this.rawNamespace[i],
                    })
        		}
        		namespaceList.push({
                    value: "all",
                    label: "私有全部",
                });
            	return namespaceList;
        	},
            showModal () {
                return this.$store.getters.showConfirmLogout;
            },
            account() {
                return this.$store.getters.account;
            },
        },
        methods: {
            toggleLogoutModal() {
                this.$store.dispatch('toggerLogoutModal');
            },
            logout() {
                this.$Message.info('登录退出');
                this.$store.dispatch('toggerLogoutModal');
                this.$store.dispatch('setUser', {account: "", is_super: false});
                this.$router.push('/login');
            },
            handleEdit(index) {
                //打开 modal 窗口
                this.editModal = true;
                //获取原数据
                this.editForm = Object.assign({}, this.configData[index]);
                this.editIndex = index;
            },
            editSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.editModal = false;
                        if (this.editIndex >= 0) {
                            var id = this.configData[this.editIndex].id;
                            for (var i = 0; i < this.rawConfig.length; i++) {
                                if (this.rawConfig[i].id === id) {
                                    this.rawConfig[i].value = this.editForm.value;
                                }
                            }
                            this.editIndex = -1;

                            this.updateChanged();
                        }
                    } else {
                        this.$Message.error('编辑配置有错误，请更正!');
                    }
                })
            },
            editCancel() {
                this.editModal = false;
            },            
            showPublish() {
                if (this.changesData.length == 0) {
                    this.$Message.warning('没有可供发布的修改，请先进行编辑修改后再提交发布!');
                    return;
                }
                this.editChangeModal = true;
                this.editChange.author = this.$store.getters.account;
            },
            routeCreateNamespace() {
                this.$router.push('/createNamespace');
            },
            showNew() {
                if (this.isCommon == true) {
                    this.editFormNew.namespace = "common";
                } else {
                	if (this.currNamespace != "all") {
                		this.editFormNew.namespace = this.currNamespace;
                	}
                }
                this.editModalNew = true;
            },
            editChangeSubmit(name) {
            	console.log("editChangeSubmit: ", name);
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	console.log("valid");
                        if (this.changesData.length == 0) {
                            this.$Message.error("没有修改");
                            return;
                        }

                        this.editChangeModal = false;

                        var reqpkg = {
                            name: this.editChange.name,
                            author: this.editChange.author,
                            comment: this.editChange.comment,
                        }
                        reqpkg.updates = [];
                        reqpkg.adds = [];
                        for (var i = 0; i < this.changesData.length; i++) {
                            if (this.changesData[i].isnew == true) {
                                reqpkg.adds.push({
                                    namespace: this.changesData[i].namespace,
                                    key: this.changesData[i].key,
                                    value: this.changesData[i].value,
                                });    
                            } else {
                                reqpkg.updates.push({
                                    id: this.changesData[i].id,
                                    value: this.changesData[i].value,
                                    version: this.changesData[i].version,
                                });                                
                            }
                        }

                        api.changeConfig(reqpkg).then((response) => {
                           var succ_cnt = 0;
                            var fail_cnt = 0;
                            console.log("api.changeConfig response: ", response)
                            if (Array.isArray(response.entries)) {
                                succ_cnt = response.entries.length;
                                for (var i = 0; i < succ_cnt; i++) {
                                    var entry = response.entries[i];
                                    for (var j = 0; j < this.rawConfig.length; j++) {
                                        var data = this.rawConfig[j]
                                        if (data.namespace == entry.namespace && data.key == entry.key) {
                                            if (data.isnew == true) {
                                                data.isnew = false;
                                                data.id = entry.id;
                                                data.value = entry.value;
                                                data.oldvalue = data.value;
                                                //comment
                                                data.version = entry.version;
                                                data.updated = entry.updated;
                                                data.created = entry.created;
                                            } else {
                                                data.value = entry.value;
                                                data.oldvalue = data.value;
                                                data.version = entry.version;
                                                data.updated = entry.updated;
                                            }
                                            break   
                                        }
                                    }
                                }          
                            }
                            if (Array.isArray(response.errmsgs)) {
                                fail_cnt = response.errmsgs.length;
                                for (var i = 0; i < fail_cnt; i++) {
                                    var errmsg = response.errmsgs[i];
                                    console.log(errmsg);
                                }
                            }                
                            this.$Message.info("成功: " + succ_cnt + " / " + (succ_cnt + fail_cnt));
                            this.updateChanged();
                        }).catch((error) => {
                            this.$Message.error("失败：" + error);
                        });
                    } else {
                        console.log("failed!")
                        this.$Message.error('发布信息有错误，请更正!');
                    }
                })                
            },
            editChangeCancel() {
                this.editChangeModal = false;
            },
            editSubmitNew(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.editModalNew = false;
                        var config = {
                            isnew: true,
                            id: 0,
                            namespace: this.editFormNew.namespace,
                            key: this.editFormNew.key,
                            value: this.editFormNew.value,
                            oldvalue: "",
                            comment: this.editFormNew.desc,
                            version: 0,
                            updated: 0,
                            created: 0,
                        }
                        //计算属性configData会随着改变
                        this.rawConfig.unshift(config);

                        this.updateChanged();
                    } else {
                        this.$Message.error('新增配置有错误，请更正!');
                    }
                })
            },
            editCancelNew() {
                this.editModalNew = false;
            },
            handleReset() {
            	if (this.changesData.length == 0) {
            		this.$Message.info('没有修改供撤销');
            		return;
            	}
                for (var i = 0; i < this.configData.length; i++) {
                    var row = this.configData[i];
                    row.value = row.oldvalue;
                }
                this.changesData = [];
                this.$Message.info('已撤销所有修改');
            },            
            updateChanged() {
                this.changesData = [];
                for (var i = 0; i < this.rawConfig.length; i++) {
                    var row = this.rawConfig[i];
                    if (row.value != row.oldvalue) {
                        var entry = {
                            isnew: row.isnew,
                            id: row.id,
                            namespace: row.namespace,
                            key: row.key,
                            value: row.value,
                            oldvalue: row.oldvalue,
                            version: row.version,
                        };
                        this.changesData.push(entry);
                    }
                }
            },
        },
    }
</script>


<style type="text/css" scoped>
    .ivu-table .table-change-row td{
        background-color:  #fff8dc;
        color: #000;
    }

    .content {
        background-color: #fff;
        margin: 20px 10px;
        padding: 0 20px;
    }

    .blockdiv {
        display: inline-block;
    }

    /*两端有内容*/
    .content .release {
        display: flex; 
        justify-content: space-between; 
        align-items: center;

        border-bottom: 1px solid #eeeeee;        
    }
    .content .release .endpoint {
        /*水平菜单，并有一定间隔*/
        display: inline-block;  
              
        /*inline垂直居中*/
        height: 60px; 
        line-height: 60px;
    }  


    .content .edit2 {
        display: flex; 
        justify-content: space-between; 
        align-items: center;
    } 
    .content .edit2 .editside{
        /*水平菜单，并有一定间隔*/
        display: flex;
        align-items: center;
        justify-content: space-between;
              
        height: 60px; 
    }

    .badge-update {
        background: #fff !important;
        color: black;
        font-size: 5px;
        height: 10px;
        border-radius: 5px;
        min-width: 10px;
        line-height: 10px;
        padding: 0;
    }


    .tagReleased {
        background-color: #A4A4A4;
        padding: .2em .6em .3em;
        font-size: 75%;
        font-weight: bold;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;        
    }

    .tagUnreleased {
        background-color: #f0ad4e;
        padding: .2em .6em .3em;
        font-size: 75%;
        font-weight: bold;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;        
    }

    .opIcon {
        cursor: pointer;
        margin-right: 10px;
    }

    .namespace-panel {
        background: #31708f;
        width: 40px;
        color: #fff;
        padding: .2em .6em .3em;
        font-weight: bold;        
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;              
    }

    .label {
        display: inline;
        padding: .2em .6em .3em;
        font-size: 75%;
        font-weight: bold;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .25em;
        margin: 0 2px;
    }

    .labelModify {
        background-color: #5bc0de;      
    }
    .labelNew {
        background-color: #5cb85c;    
    }
</style>

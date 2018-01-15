<style type="text/css">
    .ivu-table .table-change-row td{
        background-color:  #fff8dc;
        color: #000;
    }
</style>

<template>
    <div>
        <div style="height: 60px; padding: 10px 30px 20px 0; display:flex; justify-content:flex-end;">
            <Button type="success" @click="showUpdate">
                发布修改
            </Button>
            <Button @click="handleReset">
                取消修改
            </Button>            
        </div>
        <div style="height: 60px; padding: 10px 30px 20px 0; display:flex; justify-content:flex-end;">
            <Button type="primary" @click="showNew">
                新增配置
            </Button>       
        </div>
        <Table :row-class-name="rowClassName" :columns="tblColumns" :data="tblData" border highlight-row ></Table>   
        <div style="margin: 30px 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="totalCount" :current="1"></Page>
            </div>
        </div>

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

        <!--新增配置 Modal 对话框-->
        <Modal v-model="editModalNew" title="新增配置" >
            <div>
                <Form ref="editFormNew" :model="editFormNew" :rules="ruleValidateNew" :label-width="80">
                    <Form-item label="命名空间" prop="namespace">
                        <Input v-model="editFormNew.namespace" ></Input>
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

        <!-- 发布对话框 -->
        <Modal v-model="editChangeModal" title="编辑发布信息" width="1000">
            <div style="margin-bottom: 24px; display: flex;">
                <div style="border: 1px solid black">
                    <label>变动起来</label>                 
                </div>
                <div style="border: 1px solid black">
                    <Table :columns="tblChanges" :data="changesData"></Table>
                </div>
            </div>            
            <div>
                <Form ref="editChange" :model="editChange" :label-width="80" :rules="ruleUpdateValidate">
                    <Form-item label="发布标题" prop="name">
                        <Input v-model="editChange.name" ></Input>
                    </Form-item>
                    <Form-item label="发布人" prop="author">
                        <Input v-model="editChange.author" ></Input>
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

    </div>
</template>

<script>
    import moment from 'moment'

    export default {
    	data () {
    		return {
                modalCreate: false,
                modalAudio: false,
                audioSrc: "",
                totalCount: 0,
                tblData: [],

                editIndex: -1,
                editForm: {},
                //编辑 modal
                editModal: false,

                editChange: {},
                editChangeModal: false,

                editFormNew: {},
                editModalNew: false,

                changesData: [],

                tblChanges: [
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
                ],

                tblColumns: [
                    {
                        type: 'selection',
                        width: 58,
                    },       
                    {
                        title: 'ID',
                        render: (h, params) => {
                            if (params.row.isnew == true) {
                                return h('span', "-");
                            } else {
                                return h('span', params.row.id + "");                                
                            }
                        },
                        width: 70,
                        sortable: true,
                    },
                    {
                        title: '命名空间',
                        key: 'namespace',
                        width: 120,
                        sortable: true,
                    },
                    {
                        title: '配置名',
                        key: 'key',
                        width: 150,
                        sortable: true,
                    },
                    {
                        title: '配置值',
                        key: 'value',
                        width: 400,
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
                        width: 120,
                        sortable: true,
                    },                                                                                 
                    {
                        title: '最后更新',
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
                        title: '创建时间',
                        key: 'created',
                        width: 150,
                        render: (h, params) => {
                            if (params.row.isnew == true) {
                                return h('span', "-");
                            }                            
                            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            d.setUTCSeconds(params.row.created);
                            return h('span', moment(d).format('YYYY-MM-DD HH:mm:ss'));
                        }                        
                    },                    
                    {
                        title: '操作',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },                                    
                                    on: {
                                        click: () => {
                                            this.handleEdit(params.index)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },                                    
                                    on: {
                                        click: () => {
                                            this.$Message.info("删除")
                                        }
                                    }                                    
                                }, '删除')
                            ])
                        }
                    }
                ],

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
    	methods: {
            handleList() {
                this.$jsonHttp.post('/api/list', {}).then((response) => {
                    if (response.status != 200) {
                      this.$Message.error("失败：%d %s", response.status, response.statusText)
                      console.error("失败：%d %s", response.status, response.statusText)
                      return
                    }
                    if (Array.isArray(response.data.entries)) {
                        this.totalCount = this.tblData.length
                        for (var i = 0; i < response.data.entries.length; i++) {
                            var entry = response.data.entries[i];
                            var config = {
                                isnew: false,
                                id: entry.id,
                                namespace: entry.namespace,
                                key: entry.key,
                                value: entry.value,
                                oldvalue: entry.value,
                                comment: '',
                                version: entry.version,
                                updated: entry.updated,
                                created: entry.created,
                            }
                            this.tblData.push(config);
                        }
                    }
                }).catch((error) => {
                    this.$Message.error(error)
                    console.log(error)
                })                  
            },
            handleEdit(index) {
                //打开 modal 窗口
                this.editModal = true;
                //获取原数据
                this.editForm = Object.assign({}, this.tblData[index]); 
                this.editIndex = index;
            },
            editSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.editModal = false;
                        if (this.editIndex >= 0) {
                            this.tblData[this.editIndex].value = this.editForm.value
                            console.log("row<%d>: %o", this.editIndex, this.tblData[this.editIndex])                            
                            this.editIndex = -1;
                        }
                    } else {
                        this.$Message.error('编辑配置有错误，请更正!');
                    }
                })
            },
            editCancel() {
                this.editModal = false;
            },
            editChangeSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
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
                        this.$jsonHttp.post('/api/change', reqpkg).then((response) => {
                            if (response.status != 200) {
                              this.$Message.error("失败：%d %s", response.status, response.statusText)
                              console.error("失败：%d %s", response.status, response.statusText)
                              return
                            }
                            var succ_cnt = 0;
                            var fail_cnt = 0;
                            console.log(response.data)
                            if (Array.isArray(response.data.entries)) {
                                succ_cnt = response.data.entries.length;
                                for (var i = 0; i < succ_cnt; i++) {
                                    var entry = response.data.entries[i];
                                    for (var j = 0; j < this.tblData.length; j++) {
                                        var data = this.tblData[j]
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
                            if (Array.isArray(response.data.errmsgs)) {
                                fail_cnt = response.data.errmsgs.length;
                                for (var i = 0; i < fail_cnt; i++) {
                                    var errmsg = response.data.errmsgs[i];
                                    console.log(errmsg);
                                }
                            }                
                            this.$Message.info("成功: " + succ_cnt + " / " + (succ_cnt + fail_cnt));
                        }).catch((error) => {
                            this.$Message.error(error);
                            console.log("jsonHttp catch error", error);
                        })         
                    } else {
                        console.log("failed!")
                        this.$Message.error('发布信息有错误，请更正!');
                    }
                })                
            },
            editChangeCancel() {
                this.editChangeModal = false
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
                        this.tblData.unshift(config);                        
                    } else {
                        this.$Message.error('新增配置有错误，请更正!');
                    }
                })
            },
            editCancelNew() {
                this.editModalNew = false;
            },            
            rowClassName (row, index) {
                if (row.value != row.oldvalue) {
                    return 'table-change-row';
                } else {
                    return '';
                }
            },
            showUpdate() {
                this.changesData = [];
                for (var i = 0; i < this.tblData.length; i++) {
                    var row = this.tblData[i];
                    if (row.value != row.oldvalue) {
                        this.changesData.push({
                            isnew: row.isnew,
                            id: row.id,
                            namespace: row.namespace,
                            key: row.key,
                            value: row.value,
                            oldvalue: row.oldvalue,
                            version: row.version,
                        })
                    }
                }
                if (this.changesData.length == 0) {
                    this.$Message.error('没有修改可供发布，请确认!');
                    return;
                }                
                this.editChangeModal = true;
            },
            handleReset() {
                for (var i = 0; i < this.tblData.length; i++) {
                    var row = this.tblData[i];
                    row.value = row.oldvalue;
                }
                this.changesData = [];
                this.$Message.info('已撤销所有修改');
            },

            showNew() {
                this.editModalNew = true;
            },
    	},
        mounted() {
            this.handleList()
        }        
    }
</script>

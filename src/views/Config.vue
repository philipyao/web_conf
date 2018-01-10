<style type="text/css">
    .ivu-table .table-change-row td{
        background-color: #2db7f5;
        color: #fff;
    }
</style>

<template>
    <div>
        <div style="height: 60px; padding: 10px 30px 20px 0; display:flex; justify-content:flex-end;">
            <Button type="success" @click="handleUpdate">
                发布修改
            </Button>
            <Button @click="handleReset">
                取消修改
            </Button>            
        </div>

        <Table :row-class-name="rowClassName" :columns="tblColumns" :data="tblData" border highlight-row ></Table>   
        <div style="margin: 30px 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="totalCount" :current="1"></Page>
            </div>
        </div>
<!--         <Modal v-model="modalCreate">
            <Form  :model="formCreateMaterial">
                <FormItem label="素材名称">
                    <Input v-model="formCreateMaterial.name"></Input>
                </FormItem>
                <FormItem>
                    <Upload
                        ref="uploadCtl"
                        type="select"
                        name="file"
                        :before-upload="beforeUpload"
                        :format="['wav','amr','mp3', 'wma']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        action="//10.1.164.45:8080/api/admin/upload">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击或将文件拖拽到这里上传</p>
                        </div>
                    </Upload>                
                </FormItem>                                     
            </Form> 
            <div slot="footer">
                <Button size="large" @click="modalCreate = false">取消</Button>
                <Button type="success" size="large" @click="handleCreateMaterial">确定</Button>
            </div>            
        </Modal>   -->

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
                <Button type="primary" @click="editSubmit('editForm')">提交</Button>
                <Button type="ghost" @click="editCancel()" style="margin-left: 8px">取消</Button>
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

                tblColumns: [
                    {
                        type: 'selection',
                        width: 58,
                    },       
                    {
                        title: 'ID',
                        key: 'id',
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
                        key: 'version',
                        width: 120,
                        sortable: true,
                    },                                                                                 
                    {
                        title: '最后更新',
                        key: 'updated',
                        width: 150,
                        render: (h, params) => {
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
            rowClassName (row, index) {
                if (row.value != row.oldvalue) {
                    return 'table-change-row';
                } else {
                    return '';
                }
            },
            handleUpdate() {
                var updates = [];
                for (var i = 0; i < this.tblData.length; i++) {
                    if (this.tblData[i].value !== this.tblData[i].oldvalue) {
                        updates.push({
                            id: this.tblData[i].id,
                            value: this.tblData[i].value,
                        });
                    }
                }
                console.log("updates: ", updates)
                if (updates.length == 0) {
                    this.$Message.error("没有修改")
                    return
                }
                this.$jsonHttp.post('/api/update', {updates: updates}).then((response) => {
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
                                if (this.tblData[j].id == entry.id) {
                                    console.log("update ", entry.id);
                                    this.tblData[j].value = entry.value;
                                    this.tblData[j].oldvalue = this.tblData[j].value;
                                    this.tblData[j].version = entry.version;
                                    this.tblData[j].updated = entry.updated;
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
                    this.$Message.info("成功: %d / %d", succ_cnt, succ_cnt + fail_cnt);
                }).catch((error) => {
                    this.$Message.error(error)
                    console.log(error)
                })                  
            },
            handleReset() {
                this.$Message.info('reset!');
            },
    	},
        mounted() {
            this.handleList()
        }        
    }
</script>

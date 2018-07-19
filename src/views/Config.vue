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

</style>

<template>
    <div class="layout">
        <my-header></my-header>

        <div class="mybody">
            <config-table :is-common="false" :initial-configs="privateData" :initial-names="privateNamespace"></config-table>
            <config-table :is-common="true" :initial-configs="commonData" :initial-names="commonNamespace"></config-table>
        </div>
 

        <Modal v-model="reLogin" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>重新登录</span>
            </p>
            <div style="text-align:center">
                <p>当前网页会话已过期，请重新登录。</p>
            </div>
            <div slot="footer">
                <Button type="warning" size="large" long  @click="handleReLogin">确定</Button>
            </div>
        </Modal>



    </div>
</template>

<script>
    import moment from 'moment'
    import Header from '@/components/Header'
    import ConfigTable from '@/components/ConfigTable'
    import api from '@/api/api';

    export default {
        name: 'config',
        components: {
          'my-header': Header,
          'config-table': ConfigTable,
        },
        computed: {
        },

    	data () {
    		return {
                //从服务器拉到的所有数据
                privateData: [],
                commonData: [],
                privateNamespace: [],
                commonNamespace: [],

                //当前表格显示的数据

                reLogin: false,
            
            }
    	},
    	methods: {
            handleList() {
                api.listConfig().then((response) => {
                    console.log("listConfig: ", response);
                    if (Array.isArray(response.entries)) {
                        for (var i = 0; i < response.entries.length; i++) {
                            var entry = response.entries[i];
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
                            if (config.namespace == "common") {
                                this.commonData.push(config);
                            } else {
                                this.privateData.push(config);
                            }
                        }
                    }
                    if (Array.isArray(response.namespaces)) {
                        for (var i = 0; i < response.namespaces.length; i++) {
                            if (response.namespaces[i] == "common") {
                                this.commonNamespace.push(response.namespaces[i]);
                            } else {
                                this.privateNamespace.push(response.namespaces[i]);
                            }
                        }
                        
                    }
                }).catch((error) => {
                    console.log("listConfig error: ", error);
                });
            },  

            handleReLogin() {
                this.reLogin = false;
                this.$router.push('/login');
            },

            sendRequest(path, args, fn) {
                this.$jsonHttp.post(path, args).then((response) => {
                    if (response.status != 200) {
                      this.$Message.error("失败: ", response.status, response.statusText)
                      console.error("失败：%d %s", response.status, response.statusText)
                      return
                    }
                    if (response.data.errcode !== 0) {
                        if (response.data.errcode === 40004) {
                            //需要重新登录
                            this.reLogin = true;
                        } else {
                            this.$Message.error(response.data.errcode, response.data.errmsg);
                        }
                        return
                    }
                    fn(response.data)
                }).catch((error) => {
                    this.$Message.error(error);
                    console.log("jsonHttp post catch error", error);                    
                })
            },
    	},
        mounted() {
            this.handleList()
        }        
    }
</script>

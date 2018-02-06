<template>
    <el-dialog title="接口输出"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-tabs v-model="tabType">
            <el-tab-pane label="General" name="general">
                <el-form label-width="100px" label-position="left">
                    <el-form-item label="Url">
                        {{obj.req.info.url}}
                    </el-form-item>
                    <el-form-item label="Status">
                        {{obj.status}}
                    </el-form-item>
                    <el-form-item label="耗时(s)">
                        {{obj.second}}
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="Request Header" name="request">
                <table class="table-hover" style="width: 100%;table-layout: fixed">
                    <tbody>
                    <template v-for="(value,key) in obj.req.info">
                        <tr style="vertical-align: middle;height: 30px">
                            <td style="width: 30%">
                                {{key}}
                            </td>
                            <td style="width: 70%;word-wrap:break-word">
                                {{value}}
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </el-tab-pane>
            <el-tab-pane label="Response Header" name="response">
                <table class="table-hover" style="width: 100%;table-layout: fixed">
                    <tbody>
                    <template v-for="(value,key) in obj.header">
                        <tr style="vertical-align: middle;height: 30px">
                            <td style="width: 30%">
                                {{key}}
                            </td>
                            <td style="width: 70%;word-wrap:break-word">
                                {{value}}
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </el-tab-pane>
            <el-tab-pane label="Response Data" name="data">
                <template v-if="type==0">
                    <el-row class="row" style="font-size: 15px;min-height: 25px;line-height: 25px;word-break: break-all" v-html="item" v-for="item in objData">
                    </el-row>
                </template>
                <img :src="objData" v-else-if="type==1">
                <pre v-else>{{objData}}</pre>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<style>

</style>

<script>
    module.exports = {
        props:["source"],
        data: function () {
            return {
                showDialog:false,
                obj:this.source,
                tabType:"general"
            }
        },
        computed:{
            type:function () {
                if(typeof(this.obj.data)=="object" && !(this.obj.data instanceof Blob))
                {
                    return 0;
                }
                else if(typeof(this.obj.data)=="object" && (this.obj.data instanceof Blob))
                {
                    return 1;
                }
                else
                {
                    return 2;
                }
            },
            objData:function () {
                if(this.type==0)
                {
                    var data=JSON.stringify(this.obj.data);
                    return helper.format(data,0,[],[]).draw;
                }
                else if(this.type==1)
                {
                    return $.createUrlObject(this.obj.data);
                }
                else
                {
                    return this.obj.data;
                }
            }
        },
        methods: {

        },
        beforeDestroyed:function () {
            if(this.type==1)
            {
                $.revokeUrlObject(this.objData);
            }
        }
    }
</script>
<template>
    <el-dialog title="编辑接口"  size="large" ref="box" :close-on-click-modal="false">
        <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
            <el-col class="col" :span="2">
                接口
            </el-col>
            <el-col class="col" :span="10">
                <el-cascader expand-trigger="hover" :options="arrInterface" v-model="arrSelInterface" style="width: 90%" filterable @change="changeInterface">
                </el-cascader>
            </el-col>
            <el-col class="col" :span="2">
                BaseUrl
            </el-col>
            <el-col class="col" :span="10">
                <el-select style="width: 90%;text-align: center" v-model="baseUrl">
                    <el-option value="defaultUrl" label="defaultUrl"></el-option>
                    <el-option v-for="item in arrUrl" :value="item" :label="item"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
            <el-col class="col" :span="2">
                名称
            </el-col>
            <el-col class="col" :span="10">
                <el-input style="width: 90%" placeholder="请填入名称" v-model="objInterface.name"></el-input>
            </el-col>
            <el-col class="col" :span="2">
                路径
            </el-col>
            <el-col class="col" :span="10">
                <el-input style="width: 90%" v-model="objInterface.url" :disabled="true"></el-input>
            </el-col>
        </el-row>
        <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
            <el-col class="col" :span="2">
                方法
            </el-col>
            <el-col class="col" :span="10">
                {{objInterface.method}}
            </el-col>
            <el-col class="col" :span="2">
                状态
            </el-col>
            <el-col class="col" :span="10">
                {{objInterface.finish?"已完成":"未完成"}}
            </el-col>
        </el-row>
        <el-row class="row" style="height: 60px;line-height: 60px;text-align: center">
            <el-col class="col" :span="2">
                备注
            </el-col>
            <el-col class="col" :span="22">
                <el-input type="textarea" :rows="2" style="width: 95%" v-model="objInterface.remark" :disabled="true"></el-input>
            </el-col>
        </el-row>
        <el-row class="row" style="margin-top: 20px">
            <el-tabs type="card">
                <el-tab-pane :label="paramTab" v-if="param.length>0">
                    <testparam :interface="objInterface" :status="status"></testparam>
                </el-tab-pane>
                <el-tab-pane :label="queryTab">
                    <testquery :interface="objInterface" :status="status"></testquery>
                </el-tab-pane>
                <el-tab-pane :label="headerTab">
                    <testheader :interface="objInterface"></testheader>
                </el-tab-pane>
                <el-tab-pane :label="bodyTab" v-if="objInterface.method=='POST' || objInterface.method=='PUT'">
                    <testbody :interface="objInterface" :status="status"></testbody>
                </el-tab-pane>
                <el-tab-pane label="Inject">
                    <testinject :interface="objInterface"></testinject>
                </el-tab-pane>
            </el-tabs>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>
<style>
    .el-cascader__label {
        top:0
    }
</style>

<script>
    var testParam=require("./testParam.vue");
    var testQuery=require("./testQuery.vue");
    var testHeader=require("./testHeader.vue");
    var testBody=require("./testBody.vue");
    var testInject=require("./testInject.vue");
    module.exports={
        props:["source","interface","url","status"],
        data:function () {
            return {
                arrInterface:function () {
                    return this.source.map(function (obj) {
                        var arr=obj.data.map(function (obj) {
                            return {
                                label:obj.name,
                                value:obj.id
                            }
                        })
                        return {
                            label:obj.name,
                            value:obj.id,
                            children:arr
                        }
                    })
                }.call(this),
                arrSelInterface:function () {
                    if(this.interface)
                    {
                        var group,id,_this=this;
                        this.source.forEach(function (obj) {
                            var _obj=obj;
                            obj.data.forEach(function (obj) {
                                if(obj.id==_this.interface.id)
                                {
                                    group=_obj.id;
                                    id=obj.id;
                                }
                            })
                        })
                        if(group && id)
                        {
                            return [group,id];
                        }
                        else
                        {
                            $.tip("接口已不存在",0);
                            return [];
                        }
                    }
                    else
                    {
                        return []
                    }
                }.call(this),
                arrUrl:function () {
                    return this.url
                }.call(this),
                objInterface:function () {
                    if(this.interface)
                    {
                        return this.interface
                    }
                    else
                    {
                        return {
                            restParam:[],
                            queryParam:[],
                            header:[],
                            bodyParam:[],
                            before:{
                                mode:0,
                                code:""
                            },
                            after:{
                                mode:0,
                                code:""
                            }
                        };
                    }
                }.call(this),
                baseUrl:function () {
                    if(this.interface && this.interface.baseUrl)
                    {
                        return this.interface.baseUrl
                    }
                    else
                    {
                        return "defaultUrl";
                    }
                }.call(this)
            }
        },
        components:{
            "testparam":testParam,
            "testquery":testQuery,
            "testheader":testHeader,
            "testbody":testBody,
            "testinject":testInject
        },
        computed:{
            paramTab:function () {
                return "Param ("+this.param.length+")";
            },
            queryTab:function () {
                return "Query ("+this.querySave.length+")";
            },
            headerTab:function () {
                return "Header ("+this.headerSave.length+")";
            },
            bodyTab:function () {
                return "Body ("+(this.objInterface.bodyInfo.type==0?this.bodySave.length:"Raw")+")";
            },
            param:function () {
                return this.objInterface.restParam
            },
            querySave:function () {
                return this.objInterface.queryParam.filter(function (obj) {
                    if(obj.name && obj.enable)
                    {
                        return true
                    }
                    else
                    {
                        return false
                    }
                })
            },
            headerSave:function () {
                return this.objInterface.header.filter(function (obj) {
                    if(obj.name)
                    {
                        return true
                    }
                    else
                    {
                        return false
                    }
                });
            },
            bodySave:function () {
                return this.objInterface.bodyParam.filter(function (obj) {
                    if(obj.name && obj.enable)
                    {
                        return true
                    }
                    else
                    {
                        return false
                    }
                })
            },
        },
        methods:{
            changeInterface:function () {
                $.startHud();
                var _this=this;
                this.$store.dispatch("showInterface",{
                    id:this.arrSelInterface[1],
                    interface:this.interface?this.interface:null,
                    status:this.status
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        _this.objInterface=data.data;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            save:function () {
                if(!this.objInterface.id)
                {
                    $.tip("请选择接口",0);
                    return
                }
                this.objInterface.baseUrl=this.baseUrl;
                this.$emit("save",this.objInterface);
                this.$refs.box.close();
            }
        }
    }
</script>











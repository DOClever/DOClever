<template>
    <el-dialog title="编辑接口" v-model="showDialog" size="large" ref="box" :close-on-click-modal="false">
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
                    <el-option v-for="item in arrUrl" :value="item.url" style="height: auto" :key="item.url"><span>{{item.url}}</span><br><span style="font-size: 13px;color: gray">{{item.remark}}</span></el-option>
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
                {{objInterface.finish==1?"已完成":(objInterface.finish==2?"已废弃":"未完成")}}
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
        <el-tabs type="card" style="background-color: white;padding: 20px;margin-top: 15px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;" v-model="tabIndex" id="mainTest">
            <template v-for="(item, index) in originInterface.param">
                <el-tab-pane :key="item.id" :name="index">
                    <span slot="label">
                        <el-popover placement="bottom" width="200" trigger="hover" :content="item.remark" v-if="item.remark">
                            <span slot="reference">{{item.name}}</span>
                        </el-popover>
                        <span v-else>{{item.name}}</span>&nbsp
                    </span>
                    <el-row class="row">
                        <el-tabs type="card">
                            <el-tab-pane :label="paramTab" v-if="param.length>0">
                                <testrestparam :interface="item" :status="status"></testrestparam>
                            </el-tab-pane>
                            <el-tab-pane :label="queryTab">
                                <testquery :interface="item" :status="status"></testquery>
                            </el-tab-pane>
                            <el-tab-pane :label="headerTab">
                                <testheader :interface="item"></testheader>
                            </el-tab-pane>
                            <el-tab-pane :label="bodyTab" v-if="objInterface.method=='POST' || objInterface.method=='PUT' || objInterface.method=='PATCH'">
                                <testbody :interface="item" :status="status"></testbody>
                            </el-tab-pane>
                            <el-tab-pane label="Inject">
                                <testinject :interface="item"></testinject>
                            </el-tab-pane>
                        </el-tabs>
                    </el-row>
                </el-tab-pane>
            </template>
        </el-tabs>
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
    #mainTest>.el-tabs__content
    {
        padding: 0 10px 10px 10px;
        border-left: 1px lightgray solid;
        border-right: 1px lightgray solid;
        border-bottom: 1px lightgray solid;
    }
</style>

<script>
    var testRestParam=require("./testRestParam.vue");
    var testQuery=require("./testQuery.vue");
    var testHeader=require("./testHeader.vue");
    var testBody=require("./testBody.vue");
    var testInject=require("./testInject.vue");
    module.exports={
        props:["source","interface","url","status","index","netInterface"],
        data:function () {
            return {
                arrInterface:function () {
                    var arr=this.source;
                    var arrInterface=[];
                    (function _map(arr,arrGroup) {
                        for(var i=0;i<arr.length;i++)
                        {
                            var obj=arr[i];
                            if(obj.data)
                            {
                                var obj1={
                                    value:obj.id,
                                    label:obj.name,
                                    children:[]
                                };
                                if(obj.data.length>0)
                                {
                                    arguments.callee(obj.data,obj1.children);
                                }
                                arrGroup.push(obj1);
                            }
                            else
                            {
                                arrGroup.push({
                                    value:obj.id,
                                    label:obj.name,
                                });
                            }
                        }
                    })(arr,arrInterface);
                    return arrInterface;
                }.call(this),
                arrSelInterface:function () {
                    if(this.interface)
                    {
                        var val=this.interface.id;
                        var arr=this.source;
                        var ret=[];
                        (function _map(arr) {
                            for(var i=0;i<arr.length;i++)
                            {
                                var obj=arr[i];
                                ret.push(obj.id);
                                if(obj.id==val)
                                {
                                    return true;
                                }
                                else if(obj.data)
                                {
                                    var v=arguments.callee(obj.data);
                                    if(v)
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        ret.pop();
                                    }
                                }
                                else
                                {
                                    ret.pop();
                                }
                            }
                            return false;
                        })(arr)
                        if(ret.length>0)
                        {
                            return ret;
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
                originInterface:function () {
                    if(this.netInterface)
                    {
                        return this.netInterface
                    }
                    else
                    {
                        return {
                            param:[
                                {
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
                                }
                            ]
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
                }.call(this),
                showDialog:false,
                tabIndex:this.index
            }
        },
        components:{
            "testrestparam":testRestParam,
            "testquery":testQuery,
            "testheader":testHeader,
            "testbody":testBody,
            "testinject":testInject
        },
        watch:{
            tabIndex:function (val) {
                var obj=this.originInterface.param[parseInt(val)];
                for(var key in obj)
                {
                    if(key!="name" && key!="id" && key!="remark")
                    {
                        this.objInterface[key]=obj[key];
                    }
                }
            }
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
                return "Body ("+((this.objInterface.bodyInfo && this.objInterface.bodyInfo.type==0)?this.bodySave.length:"Raw")+")";
            },
            param:function () {
                return this.objInterface.restParam
            },
            querySave:function () {
                return this.originInterface.param[parseInt(this.tabIndex)].queryParam.filter(function (obj) {
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
                return this.originInterface.param[parseInt(this.tabIndex)].header.filter(function (obj) {
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
                return this.originInterface.param[parseInt(this.tabIndex)].bodyParam.filter(function (obj) {
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
                    id:this.arrSelInterface[this.arrSelInterface.length-1],
                    interface:this.objInterface,
                    status:this.status
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        _this.originInterface=data.data;
                        _this.tabIndex="0";
                        for(var key in _this.originInterface)
                        {
                            if(key!="param")
                            {
                                _this.objInterface[key]=_this.originInterface[key];
                            }
                        }
                        var obj=_this.originInterface.param[0];
                        for(var key in obj)
                        {
                            if(key!="name" && key!="id" && key!="remark")
                            {
                                _this.objInterface[key]=obj[key];
                            }
                        }
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
                var obj=$.clone(this.objInterface);
                obj.paramId=this.originInterface.param[parseInt(this.tabIndex)].id;
                delete obj.param;
                this.$emit("save",obj);
                this.$refs.box.close();
            }
        }
    }
</script>











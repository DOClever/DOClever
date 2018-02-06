<template>
    <el-dialog title="编辑接口" :visible.sync="showDialog" width="80%" ref="box" :close-on-click-modal="false" append-to-body>
        <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
            <el-col class="col" :span="2">
                接口
            </el-col>
            <el-col class="col" :span="10">
                <el-cascader size="small" expand-trigger="hover" :options="arrInterface" v-model="arrSelInterface" style="width: 90%" :show-all-levels="false" filterable clearable @change="changeInterface" placeholder="请选择接口" :props="props">
                </el-cascader>
            </el-col>
            <el-col class="col" :span="2">
                BaseUrl
            </el-col>
            <el-col class="col" :span="10">
                <el-select size="small" style="width: 90%;text-align: center" v-model="baseUrl">
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
                <el-input size="small" style="width: 90%" placeholder="请填入名称" v-model="objInterface.name"></el-input>
            </el-col>
            <el-col class="col" :span="2">
                路径
            </el-col>
            <el-col class="col" :span="10">
                <el-input size="small" style="width: 90%" v-model="objInterface.url" :disabled="true"></el-input>
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
                <el-input size="small" type="textarea" :rows="2" style="width: 95%" v-model="objInterface.remark" :disabled="true"></el-input>
            </el-col>
        </el-row>
        <el-row class="row" style="height: 60px;line-height: 60px;text-align: center">
            <el-col class="col" :span="2">
                注入
            </el-col>
            <el-col class="col" :span="22">
                <el-checkbox v-model="pullInject" :true-label="1" :false-label="0">
                    降低动态注入优先级
                </el-checkbox>
            </el-col>
        </el-row>
        <div style="position: absolute;top: 390px;right: 40px;z-index: 1000;font-size: 14px" v-if="objInterface._id">
            切换:&nbsp;
            <el-autocomplete size="mini" v-model="exampleName" :fetch-suggestions="querySearchExample" placeholder="筛选你的运行实例" @select="changeExample">
            </el-autocomplete>
        </div>
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
        props:["interface","url","status","index","netInterface"],
        data:function () {
            return {
                arrSelInterface:function () {
                    if(this.interface)
                    {
                        var val=this.interface._id;
                        var arr=this.$store.state.interfaceList;
                        var ret=[];
                        (function _map(arr) {
                            for(var i=0;i<arr.length;i++)
                            {
                                var obj=arr[i];
                                ret.push(obj._id);
                                if(obj._id==val)
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
                            },
                            encrypt:{
                                type:"",
                                salt:""
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
                tabIndex:this.index,
                pullInject:(this.interface && this.interface.pullInject)?1:0,
                props:{
                    value:"_id",
                    label:"name",
                    children:"data"
                },
                example:(this.interface && this.interface.example)?this.interface.example:"",
                exampleName:"无运行实例"
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
            tabIndex:{
                handler:function (val,oldValue) {
                    if(!this.objInterface._id)
                    {
                        return;
                    }
                    var _this=this;
                    var obj=this.originInterface.param[parseInt(val)];
                    if(obj.example)
                    {
                        this.exampleName=obj.example.name;
                    }
                    else
                    {
                        this.exampleName="无运行实例";
                    }
                    if(oldValue===undefined && this.example)
                    {
                        net.get("/example/list",{
                            interface:this.objInterface._id,
                            paramid:obj.id
                        }).then(function (data) {
                            var results=data.data;
                            results=results.map(function (obj) {
                                return {
                                    id:obj._id,
                                    value:obj.name
                                }
                            })
                            results.unshift({
                                value:"无运行实例",
                                id:""
                            })
                            results.forEach(function (o) {
                                if(o.id==_this.example)
                                {
                                    bFind=true;
                                    _this.exampleName=o.value;
                                    Vue.set(obj,"example",{
                                        id:o.id,
                                        name:o.value
                                    })
                                }
                            })
                        })
                    }
                },
                immediate:true
            }
        },
        computed:{
            arrInterface:function () {
                return this.$store.state.interfaceList
            },
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
                    status:this.status,
                    baseUrls:this.arrUrl
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        _this.originInterface=data.data.interface;
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
                var obj1=this.originInterface.param[parseInt(this.tabIndex)];
                for(var key in obj1)
                {
                    if(key!="name" && key!="id" && key!="remark")
                    {
                        this.objInterface[key]=obj1[key];
                    }
                }
                this.objInterface.baseUrl=this.baseUrl;
                var obj=$.clone(this.objInterface);
                obj.pullInject=this.pullInject;
                obj.paramId=this.originInterface.param[parseInt(this.tabIndex)].id;
                if(this.originInterface.param[parseInt(this.tabIndex)].example)
                {
                    obj.example=this.originInterface.param[parseInt(this.tabIndex)].example.id
                }
                else
                {
                    delete obj.example
                }
                delete obj.param;
                this.$emit("save",obj,obj.example?this.exampleName:"");
                this.showDialog=false;
            },
            querySearchExample:function (queryString,cb) {
                net.get("/example/list",{
                    interface:this.objInterface._id,
                    paramid:this.originInterface.param[parseInt(this.tabIndex)].id
                }).then(function (data) {
                    var results=data.data;
                    results=results.map(function (obj) {
                        return {
                            id:obj._id,
                            value:obj.name
                        }
                    })
                    results.unshift({
                        value:"无运行实例",
                        id:""
                    })
                    cb(results);
                })
            },
            changeExample:function (item) {
                var _this=this;
                $.startHud();
                this.$store.dispatch("changeExample", {
                    id: item.id,
                    objInterface: this.objInterface,
                    objOriginal: this.originInterface.param[parseInt(this.tabIndex)]
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("切换成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                });
            },
        }
    }
</script>











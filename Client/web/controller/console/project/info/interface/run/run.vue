<template>
    <el-row class="row" id="run">
        <el-row class="row" style="height: 35px;line-height: 35px">
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" v-if="interfaceEditRole" @click="save" title="生成文档" id="save">
                生成
            </el-button>
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" @click="run" title="运行" id="run" :loading="runPending">
                运行
            </el-button>
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" @click="$store.dispatch('project/info/interface/changeType',interfaceEditRole?'edit':'preview',{root:true})">
                返回
            </el-button>
            <el-button size="mini" type="text" icon="fa fa-arrows-alt" style="margin-left: 5px;font-size: 15px" title="放大/缩小" @click="$store.getters.event.$emit('toggleMax')"></el-button>
            <el-button size="mini" type="text" icon="fa fa-bolt" style="margin-left: 5px;font-size: 15px" title="加入用例" @click="joinTest"></el-button>
        </el-row>
        <el-row class="row" style="margin-top: 5px;overflow-y: auto;height: calc(100vh - 150px);padding-bottom: 80px;border-radius: 5px;font-size: 14px;background-color: white">
            <el-row class="row" style="padding-left: 10px;margin-top: 20px">
                <el-popover ref="popover1" placement="bottom" width="400" trigger="hover">
                    <span style="display: inline-block;font-size: 13px">
                对于内网测试的用户，如果DOClever的服务器和你接口服务器在同一个内网下，请确保右上角个人头像下拉菜单里的Proxy处于关闭状态，即可直接运行接口，否则请先在测试机上安装node环境（安装包点击下载：<a href="/html/web/resource/other/node.msi" target="_blank">window</a>&nbsp;&nbsp;<a href="/html/web/resource/other/node.pkg" target="_blank">mac</a>），然后将<a href="/html/web/resource/other/net.js" target="_blank">net.js</a>(和mock数据是同一个文件)保存到本地，用node运行,然后确保右上角个人头像下拉菜单里的Proxy处于开启状态，即可用本页面进行内网数据调试!
            </span>
                </el-popover>
                接口路径:
                <span style="color: #17b9e6;font-size: 12px" v-popover:popover1>
                    (内网环境?)
                </span>
            </el-row>
            <el-row class="row" style="height: 40px;line-height: 40px;padding-left: 10px;padding-right: 10px">
                <el-col class="col" :span="5">
                    <el-select size="small" v-model="interface.method" @input="changeMethod" id="method" style="width: 90%">
                        <el-option  value="GET" label="GET"></el-option>
                        <el-option  value="POST" label="POST"></el-option>
                        <el-option  value="PUT" label="PUT"></el-option>
                        <el-option  value="DELETE" label="DELETE"></el-option>
                        <el-option  value="PATCH" label="PATCH"></el-option>
                    </el-select>
                </el-col>
                <el-col class="col" :span="8">
                    <el-autocomplete size="small" style="width: 95%" class="inline-input" v-model="baseUrl" :fetch-suggestions="querySearch" placeholder="选择或者填入你的BaseUrl" @input="changeBaseUrl" popper-class="my-autocomplete">
                        <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete"></i>
                        <template slot-scope="props">
                            <div class="value">{{ props.item.value }}</div>
                            <span class="remark">{{ props.item.remark }}</span>
                        </template>
                    </el-autocomplete>
                </el-col>
                <el-col class="col" :span="11">
                    <el-input size="small" style="width: 100%" placeholder="请填入你请求的路由地址" v-model="interface.url" @input="changeUrl" @paste.native="paste"></el-input>
                </el-col>
            </el-row>
            <div style="position: absolute;top: 105px;right: 10px;z-index: 1000;font-size: 14px" v-if="interface._id && !curParam.unSave">
                切换:&nbsp;
                <el-autocomplete size="mini" v-model="curParam.selExample.value" :fetch-suggestions="querySearchExample" placeholder="筛选你的运行实例" @select="changeExample">
                    <el-dropdown slot="suffix" v-if="interfaceEditRole">
                            <span class="el-dropdown-link">
                                <i class="el-icon-menu el-input__icon"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="saveExample" v-if="curParam.selExample.id">保存</el-dropdown-item>
                            <el-dropdown-item @click.native="renameExample" v-if="curParam.selExample.id">重命名</el-dropdown-item>
                            <el-dropdown-item @click.native="saveAsExample">另存为</el-dropdown-item>
                            <el-dropdown-item @click.native="removeExample" v-if="curParam.selExample.id">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-autocomplete>
            </div>
            <el-tabs style="margin-top: 20px" v-model="tabIndex" id="mainRun">
                <template v-for="(item, index) in param">
                    <el-tab-pane :key="item.id"  :label="item.name" :name="index">
                        <span slot="label">
                            <el-tooltip class="item" effect="dark" placement="bottom" :content="item.remark" v-if="item.remark">
                                <span>{{item.name}}</span>
                            </el-tooltip>
                            <span v-else>{{item.name}}</span>
                        </span>
                        <runparam :index="index" :item="item" ref="runParam"></runparam>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </el-row>
    </el-row>
</template>

<style>

</style>

<script>
    var runParam=require("./component/runParam.vue");
    var store=require("../../../../store")._modulesNamespaceMap["project/info/interface/run/"].context;
    var sessionChange=require("common/mixins/session");
    module.exports={
        props:["interfaceEdit","index"],
        data:function () {
            return {
                runPending:false,
                tabType:"query",
                showDialog:false,
            }
        },
        mixins:[sessionChange],
        store:store,
        components:{
            "runparam":runParam
        },
        computed:{
            curParam:function () {
                return this.$store.getters.curParam;
            },
            interfaceEditRole:function () {
                return this.$store.getters.interfaceEditRole
            },
            tabIndex:{
                get:function () {
                    var val=this.$store.state.index;
                    if(val===0)
                    {
                        val="0"
                    }
                    return val;
                },
                set:function (val) {
                    this.$store.commit("setIndex",parseInt(val));
                }
            },
            param:function () {
                return store.state.interface.param;
            },
            interface:function () {
                return store.state.interface;
            },
            baseUrl:{
                get:function () {
                    if(store.getters.lastBaseUrl)
                    {
                        return store.getters.lastBaseUrl
                    }
                    else
                    {
                        return store.state.baseUrl;
                    }
                },
                set:function (val) {
                    store.commit("setBaseUrl",val);
                    store.dispatch("setLastBaseUrl",val)
                }
            },
            baseUrls:function () {
                return this.$store.getters.baseUrls;
            },
        },
        methods:{
            run:function () {
                var _this=this;
                this.runPending=true;
                store.dispatch("run").then(function (data) {
                    _this.runPending=false;
                    if(data.code==200)
                    {
                        _this.$refs.runParam[parseInt(_this.tabIndex)].resultType=1;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            save:function () {
                var _this=this;
                store.dispatch("save").then(function (data) {
                    if(data && data.code!=200)
                    {
                        $.tip(data.msg,0);
                    }
                    _this.$emit("save");
                })
            },
            changeMethod:function () {
                store.commit("changeMethod")
            },
            paste:function () {
                var _this=this;
                setTimeout(function () {
                    var path=_this.interface.url;
                    var bMark=false;
                    var index=path.indexOf("?");
                    if(index>-1)
                    {
                        bMark=true;
                        _this.interface.url=_this.interface.url.substring(0,index);
                    }
                    else
                    {
                        return;
                    }
                    for(var i=0;i<_this.$store.state.interface.param.length;i++)
                    {
                        var arrStoreQuery=_this.$store.state.interface.param[i].query;
                        arrStoreQuery.splice(0,arrStoreQuery.length);
                        if(bMark)
                        {

                            var arr=path.split("?");
                            if(arr[1])
                            {
                                var query=arr[1];
                                var arrQuery=query.split("&");
                                for(var i=0;i<arrQuery.length;i++)
                                {
                                    if(arrQuery[i])
                                    {
                                        var arrQuery1=arrQuery[i].split("=");
                                        arrStoreQuery.push({
                                            name:arrQuery1[0],
                                            value:arrQuery1[1]?{
                                                type:0,
                                                status:"",
                                                data:[{
                                                    value:decodeURIComponent(arrQuery1[1]),
                                                    remark:""
                                                }]
                                            }:{
                                                type:0,
                                                status:"",
                                                data:[]
                                            },
                                            must:1,
                                            remark:""
                                        })
                                    }
                                }
                            }
                        }
                        else
                        {
                            arrStoreQuery.push({
                                name:"",
                                must:0,
                                remark:""
                            })
                        }
                        _this.$store.state.interface.param[i].query=arrStoreQuery;
                    }
                },100)
            },
            changeBaseUrl:function () {
                if(this.baseUrl=="MockServer")
                {
                    $.tip("如果你修改了Mock数据，请在Mock之前保存接口",1);
                }
            },
            querySearch:function (queryString,cb) {
                var results=this.baseUrls.map(function (obj) {
                    return {
                        value:obj.url,
                        remark:obj.remark
                    }
                })
                if(this.interface._id)
                {
                    results.push({
                        value:"MockServer",
                        remark:""
                    })
                }
                if(queryString)
                {
                    results=results.filter(function (obj) {
                        return obj.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
                    })
                }
                cb(results);
            },
            querySearchExample:function (queryString,cb) {
                net.get("/example/list",{
                    interface:this.interface._id,
                    paramid:this.param[this.tabIndex].id
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
            showAutoComplete:function (event) {
                this.baseUrl="";
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
            },
            changeUrl:function (val) {
                this.$store.commit("changeUrl",val);
            },
            changeExample:function (item) {
                var _this=this;
                $.startHud();
                this.$store.dispatch("changeExample",item.id).then(function (data) {
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
            renameExample:function () {
                var _this=this;
                $.input("请输入运行实例名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入运行实例名称",0);
                        return false
                    }
                    $.startHud();
                    _this.$store.dispatch("saveExample",{
                        type:"rename",
                        name:val.value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("保存成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                });
            },
            saveExample:function () {
                this.$store.dispatch("saveExample",{
                    type:"save"
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            saveAsExample:function () {
                var _this=this;
                $.input("请输入运行实例名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入运行实例名称",0);
                        return false
                    }
                    $.startHud();
                    _this.$store.dispatch("saveExample",{
                        type:"saveAs",
                        name:val.value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("保存成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                });
            },
            removeExample:function () {
                var _this=this;
                $.confirm("是否删除该运行实例?",function () {
                    $.startHud();
                    _this.$store.dispatch("removeExample").then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            joinTest:function () {
                var _this=this;
                $.startHud();
                this.$store.dispatch("joinTest").then(function (obj) {
                    $.stopHud();
                    var o={
                        type:"interface",
                        id:0,
                        name:_this.curParam.selExample.id?(obj.name+"("+_this.curParam.selExample.value+")"):obj.name,
                        data:JSON.stringify(obj),
                        argv:{
                            param:{},
                            query:{},
                            header:{},
                            body:{}
                        },
                        status:0,
                        modify:0
                    };
                    $.startHud();
                    net.get("/test/allgrouplist").then(function (data) {
                        $.stopHud();
                        if(data.code!=200)
                        {
                            $.notify(data.msg,0);
                        }
                        $.showBox(_this,require("../test/test.vue"),{
                            testType:1,
                            propTestGroupList:data.data,
                            propJoin:o
                        });
                    })
                })
            }
        },
        created:function () {
            store.dispatch("initData",$.clone(this.interfaceEdit));
            store.commit("setIndex",this.index);
            if(session.get("exampleId"))
            {
                this.curParam.selExample.value=session.get("exampleId");
                store.dispatch("changeExample",session.get("exampleId"));
                session.remove("exampleId");
            }
        },
    }
</script>
<template>
    <el-dialog title="运行" v-model="showDialog"  size="large" ref="box" :close-on-click-modal="false">
        <el-row class="row" style="min-height: 100px;margin: 20px 0 0 0;padding:0 10px 0 10px">
            <el-row class="row" style="background-color: white;padding-bottom: 10px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row class="row" style="height: 50px;">
                    <el-col class="col" :span="3" style="line-height: 50px;text-align: center">
                        <div style="height: 100%;width: 80%;display: inline-block" id="method">
                            <el-select v-model="interface.method" @input="changeMethod">
                                <el-option  value="GET" label="GET"></el-option>
                                <el-option  value="POST" label="POST"></el-option>
                                <el-option  value="PUT" label="PUT"></el-option>
                                <el-option  value="DELETE" label="DELETE"></el-option>
                                <el-option  value="PATCH" label="PATCH"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col class="col" :span="7" style="line-height: 50px;text-align: center">
                        <el-autocomplete style="width: 100%" class="inline-input" v-model="baseUrl" :fetch-suggestions="querySearch" placeholder="选择或者填入你的BaseUrl" icon="caret-bottom" :on-icon-click="showAutoComplete" @input="changeBaseUrl" popper-class="my-autocomplete" custom-item="itemauto"></el-autocomplete>
                    </el-col>
                    <el-col class="col" :span="2" style="line-height: 50px;text-align: left">
                        <el-popover ref="popover1" placement="bottom" width="400" trigger="hover">
                    <span style="display: inline-block;font-size: 13px">
                对于内网测试的用户，如果DOClever的服务器和你接口服务器在同一个内网下，请确保右上角个人头像下拉菜单里的Proxy处于关闭状态，即可直接运行接口，否则请先在测试机上安装node环境（安装包点击下载：<a href="../../../resource/node.msi" target="_blank">window</a>&nbsp;&nbsp;<a href="../../../resource/node.pkg" target="_blank">mac</a>），然后将<a href="../../../resource/net.js" target="_blank">net.js</a>(和mock数据是同一个文件)保存到本地，用node运行,然后确保右上角个人头像下拉菜单里的Proxy处于开启状态，即可用本页面进行内网数据调试!
            </span>
                        </el-popover>
                        <el-button type="text" style="font-size: 14px" v-popover:popover1>
                            &nbsp;&nbsp;内网环境<i class="el-icon-information"></i>
                        </el-button>
                    </el-col>
                    <el-col class="col" :span="interfaceEditRole?8:10" style="line-height: 50px;text-align: center">
                        <el-input style="width: 90%" placeholder="请填入你请求的路由地址" v-model="interface.url" @change="changeUrl" @paste.native="paste"></el-input>
                    </el-col>
                    <el-col class="col" :span="2" style="line-height: 50px;text-align: center">
                        <el-button type="primary" @click="run" title="运行" id="run" :loading="runPending">
                            运行
                        </el-button>
                    </el-col>
                    <el-col class="col" :span="2" style="line-height: 50px;text-align: center" v-if="interfaceEditRole">
                        <el-button type="primary" @click="save" title="生成文档" id="save">
                            生成
                        </el-button>
                    </el-col>
                </el-row>
            </el-row>
            <el-row class="row" style="height: 500px;overflow-y: auto;margin-top: 15px;">
                <el-tabs type="card" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;" v-model="tabIndex" id="mainRun">
                    <template v-for="(item, index) in param">
                        <el-tab-pane :key="item.id" :name="index">
                            <span slot="label">
                                <el-popover placement="bottom" width="200" trigger="hover" :content="item.remark" v-if="item.remark">
                                    <span slot="reference">{{item.name}}</span>
                                </el-popover>
                                <span v-else>{{item.name}}</span>&nbsp
                            </span>
                            <runparam :index="index" :item="item"></runparam>
                        </el-tab-pane>
                    </template>
                </el-tabs>
            </el-row>
        </el-row>
    </el-dialog>
</template>
<style>
    #mainRun>.el-tabs__content
    {
        padding: 0 10px 10px 10px;
        border-left: 1px lightgray solid;
        border-right: 1px lightgray solid;
        border-bottom: 1px lightgray solid;
    }
</style>
<script>
    var runParam=require("./runParam.vue");
    var store=require("./../../store")._modulesNamespaceMap["interface/run/"].context;
    var sessionChange=require("../../../mixins/session");
    module.exports={
        props:["interfaceEdit","index"],
        data:function () {
            return {
                runPending:false,
                tabType:"query",
                showDialog:false
            }
        },
        mixins:[sessionChange],
        store:store,
        components:{
            "runparam":runParam
        },
        computed:{
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
                        $.notify("运行成功",1);
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
                    _this.$refs.box.close();
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
                var _this=this;
                setTimeout(function () {
                    var results=_this.baseUrls.map(function (obj) {
                        return {
                            value:obj.url,
                            remark:obj.remark
                        }
                    })
                    if(_this.interface._id)
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
                },100)
            },
            showAutoComplete:function (event) {
                this.baseUrl="";
                setTimeout(function(){
                    event.target.nextSibling.focus();
                },100)
            },
        },
        created:function () {
            store.dispatch("initData",this.interfaceEdit);
            store.commit("setIndex",this.index);
        },
    }
</script>

<template>
    <el-dialog title="运行"  size="large" ref="box" :close-on-click-modal="false">
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
                            </el-select>
                        </div>
                    </el-col>
                    <el-col class="col" :span="7" style="line-height: 50px;text-align: center">
                        <el-autocomplete style="width: 100%" class="inline-input" v-model="baseUrl" :fetch-suggestions="querySearch" placeholder="选择或者填入你的BaseUrl" icon="caret-bottom" :on-icon-click="showAutoComplete" @input="changeBaseUrl"></el-autocomplete>
                    </el-col>
                    <el-col class="col" :span="2" style="line-height: 50px;text-align: left">
                        <el-popover ref="popover1" placement="bottom" width="400" trigger="hover">
                    <span style="display: inline-block;font-size: 13px">
                对于内网测试的用户，请先在测试机上安装node环境（安装包点击下载：<a href="../resource/node.msi" target="_blank">window</a>&nbsp;&nbsp;<a href="../resource/node.pkg" target="_blank">mac</a>），然后将<a href="../resource/net.js" target="_blank">net.js</a>(和mock数据是同一个文件)保存到本地，用node运行即可,其他无需做任何配置，即可用本页面进行内网数据调试!
            </span>
                        </el-popover>
                        <el-button type="text" style="font-size: 14px" v-popover:popover1>
                            &nbsp;&nbsp;内网环境<i class="el-icon-information"></i>
                        </el-button>
                    </el-col>
                    <el-col class="col" :span="session.role==0?8:10" style="line-height: 50px;text-align: center">
                        <el-input style="width: 90%" placeholder="请填入你请求的路由地址" v-model="interface.url" @change="changeUrl" @paste.native="paste"></el-input>
                    </el-col>
                    <el-col class="col" :span="2" style="line-height: 50px;text-align: center">
                        <el-button type="primary" @click="run" title="运行" id="run" :loading="runPending">
                            运行
                        </el-button>
                    </el-col>
                    <el-col class="col" :span="2" style="line-height: 50px;text-align: center" v-if="session.role==0">
                        <el-button type="primary" @click="save" title="生成文档" id="save">
                            生成
                        </el-button>
                    </el-col>
                </el-row>
            </el-row>
            <el-row class="row" style="padding: 20px;margin-top: 15px;background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-tabs type="card">
                    <el-tab-pane :label="paramTab" v-if="param.length>0">
                        <runparam></runparam>
                    </el-tab-pane>
                    <el-tab-pane :label="queryTab">
                        <runquery v-show="!queryRawShow"></runquery>
                        <el-input type="textarea" :rows="3" style="height: 100px;margin-top: 10px" placeholder="在这里编辑原始的url参数字符串，以&符合分割" v-show="queryRawShow" v-model="queryRawStr"></el-input>
                        <el-button type="primary" size="small" style="margin-top: 20px" @click="toggleQuery">{{queryRawShow?'Commit Raw':'Edit Raw'}}</el-button>
                    </el-tab-pane>
                    <el-tab-pane :label="headerTab">
                        <runheader v-show="!headerRawShow"></runheader>
                        <el-input  type="textarea" :rows="3" style="height: 100px;margin-top: 10px" placeholder="在这里编辑原始的header字符串，以回车分割" v-show="headerRawShow" v-model="headerRawStr"></el-input>
                        <el-button type="primary" size="small" style="margin-top: 20px" @click="toggleHeader">{{headerRawShow?'Commit Raw':'Edit Raw'}}</el-button>
                    </el-tab-pane>
                    <el-tab-pane :label="bodyTab" v-if="interface.method=='POST' || interface.method=='PUT'">
                        <runbody v-show="!bodyRawShow"></runbody>
                        <el-input type="textarea" :rows="3" style="height: 100px;margin-top: 10px" placeholder="在这里编辑原始的url参数字符串，以&符合分割，文件类型用[FILE]代替" v-show="bodyRawShow" v-model="bodyRawStr"></el-input>
                        <el-button type="primary" size="small" style="margin-top: 20px" @click="toggleBody" v-if="bodyInfo.type==0">{{bodyRawShow?'Commit Raw':'Edit Raw'}}</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="Inject">
                        <runinject></runinject>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <el-row class="row" style="padding: 15px;margin-top: 15px;background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row class="row" style="padding: 10px;margin-bottom: 10px">
            <span style="font-size: 18px;">
                Result:&nbsp;&nbsp;<span :style="{color:status.match(/^2/)?'green':'red'}">{{status=='0'?'ERROR':status}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 18px;color: #50a3ff">{{second?("耗时"+second+"秒"):""}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="errorCount>0" style="color: red">Error:&nbsp;{{errorCount}}</span>
            </span>
                    <el-popover ref="error" placement="bottom" width="400" trigger="hover" v-if="errorCount>0" content="切换到Advance Tab页，移动到红色的行上面即可看到错误信息">
                    </el-popover>
                    <el-button type="text" style="font-size: 15px" v-popover:error icon="information" v-if="errorCount>0">
                    </el-button>
                </el-row>
                <el-tabs type="card">
                    <el-tab-pane label="Preview">
                        <el-row class="row" v-if="type=='object'">
                            <template v-for="item in draw">
                                <el-row class="row" style="font-size: 15px;min-height: 25px;line-height: 25px;word-break: break-all" v-html="item">
                                </el-row>
                            </template>
                        </el-row>
                        <img :src="imgUrl" v-else-if="type=='img'">
                        <pre v-else>{{draw}}</pre>
                    </el-tab-pane>
                    <el-tab-pane label="Advance">
                        <el-row class="row" v-if="type=='object'">
                            <template v-for="item in drawMix" v-if="type=='object'">
                                <el-popover placement="bottom" title="错误信息" width="300" trigger="hover" v-if="existError(item)">
                                    {{getError(item)}}
                                    <el-row class="row" style="font-size: 15px;min-height: 25px;line-height: 25px;word-break: break-all;background-color: rgba(255,0,0,0.3)" v-html="item" slot="reference">
                                    </el-row>
                                </el-popover>
                                <el-row class="row" style="font-size: 15px;min-height: 25px;line-height: 25px;word-break: break-all" v-html="item" v-else>
                                </el-row>
                            </template>
                        </el-row>
                        <img :src="imgUrl" v-else-if="type=='img'">
                        <pre v-else>{{drawMix}}</pre>
                    </el-tab-pane>
                    <el-tab-pane label="Raw">
                        <el-row class="row" style="word-break: break-all">
                            {{rawData}}
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="Header">
                        <table class="table-hover" style="width: 100%">
                            <tbody>
                            <template v-for="(value,key) in resHeader">
                                <tr style="vertical-align: middle;height: 30px">
                                    <td style="width: 30%">
                                        {{key}}
                                    </td>
                                    <td style="width: 70%">
                                        {{value}}
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <el-row class="row" style="height: 100px"></el-row>
        </el-row>
    </el-dialog>
</template>
<style>

</style>
<script>
    var runQuery=require("./runQuery.vue")
    var runHeader=require("./runHeader.vue")
    var runBody=require("./runBody.vue")
    var runParam=require("./runParam.vue")
    var runInject=require("./runInject.vue")
    var store=require("../projectinfo/storeRun")
    module.exports={
        props:["interfaceEdit","baseUrls","status","globalBefore","globalAfter"],
        data:function () {
            return {
                session:$.clone(session.raw()),
                runPending:false,
            }
        },
        store:store,
        components:{
            "runquery":runQuery,
            "runheader":runHeader,
            "runbody":runBody,
            "runparam":runParam,
            "runinject":runInject
        },
        computed:{
            interface:function () {
                return store.state.interface;
            },
            baseUrl:{
                get:function () {
                    return store.state.baseUrl;
                },
                set:function (val) {
                    store.commit("setBaseUrl",val);
                }
            },
            paramTab:function () {
                return "Param ("+store.getters.paramCount+")";
            },
            queryTab:function () {
                return "Query ("+store.getters.queryCount+")";
            },
            headerTab:function () {
                return "Header ("+store.getters.headerCount+")";
            },
            bodyTab:function () {
                return "Body ("+(store.state.bodyInfo.type==0?store.getters.bodyCount:"Raw")+")";
            },
            param:function () {
                return store.state.param
            },
            querySave:function () {
                return store.getters.querySave
            },
            headerSave:function () {
                return store.getters.headerSave
            },
            bodySave:function () {
                return store.getters.bodySave
            },
            drawMix:function () {
                return store.state.drawMix
            },
            bodyInfo:function () {
                return store.state.bodyInfo
            },
            queryRawShow:function () {
                return store.state.queryRawShow;
            },
            headerRawShow:function () {
                return store.state.headerRawShow;
            },
            bodyRawShow:function () {
                return store.state.bodyRawShow;
            },
            status:function () {
                return store.state.status;
            },
            second:function () {
                return store.state.second;
            },
            type:function () {
                return store.state.type;
            },
            draw:function () {
                return store.state.draw;
            },
            drawMix:function () {
                return store.state.drawMix;
            },
            imgUrl:function () {
                return store.state.imgUrl;
            },
            rawData:function () {
                return store.state.rawData;
            },
            resHeader:function () {
                return store.state.resHeader;
            },
            errorCount:function () {
                return store.state.errorCount;
            },
            queryRawStr:{
                get:function () {
                    return store.state.queryRawStr
                },
                set:function (val) {
                    store.commit("setQueryRawStr",val);
                }
            },
            headerRawStr:{
                get:function () {
                    return store.state.headerRawStr
                },
                set:function (val) {
                    store.commit("setHeaderRawStr",val);
                }
            },
            bodyRawStr:{
                get:function () {
                    return store.state.bodyRawStr
                },
                set:function (val) {
                    store.commit("setBodyRawStr",val);
                }
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
                store.dispatch("save").then(function () {
                    _this.$emit("save");
                    _this.$refs.box.close();
                })
            },
            toggleQuery:function () {
                store.commit("toggleQuery");
            },
            toggleHeader:function () {
                store.commit("toggleHeader");
            },
            toggleBody:function () {
                store.commit("toggleBody");
            },
            changeUrl:function (val) {
                store.commit("changeUrl",val);
            },
            querySearch:function (queryString,cb) {
                var _this=this;
                setTimeout(function () {
                    var results=_this.baseUrls.map(function (obj) {
                        return {value:obj}
                    })
                    if(_this.interfaceEdit._id)
                    {
                        results.push({
                            value:"MockServer"
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
            getError:function (item) {
                var ele=document.createElement("div");
                ele.innerHTML=item;
                var errEle=ele.querySelector("[err]");
                return errEle.getAttribute("err");
            },
            existError:function (item) {
                var ele=document.createElement("div");
                ele.innerHTML=item;
                var errEle=ele.querySelector("[err]");
                if(errEle)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            },
            changeMethod:function () {
                store.commit("changeMethod")
            },
            paste:function () {
                setTimeout(function () {
                    var path=store.state.interface.url;
                    var arrStoreQuery=store.state.query;
                    arrStoreQuery.splice(0,arrStoreQuery.length);
                    var index=path.indexOf("?");
                    if(index>-1)
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
                                        value:arrQuery1[1]?[decodeURIComponent(arrQuery1[1])]:[],
                                        must:1,
                                        remark:"",
                                        selValue:arrQuery1[1]?decodeURIComponent(arrQuery1[1]):"",
                                        enable:1
                                    })
                                }
                            }
                        }
                        store.state.interface.url=store.state.interface.url.substring(0,index);
                    }
                    else
                    {
                        arrStoreQuery.push({
                            name:"",
                            must:0,
                            remark:"",
                            value:"",
                            selValue:"",
                            enable:1
                        })
                    }
                },100)
            },
            changeBaseUrl:function () {
                if(this.baseUrl=="MockServer")
                {
                    $.tip("如果你修改了Mock数据，请在Mock之前保存接口",1);
                }
            }
        },
        created:function () {
            store.commit("clear");
            store.commit("setBaseUrls",this.baseUrls);
            store.commit("setArrStatus",this.$options.propsData.status);
            store.commit("setGlobalBefore",this.globalBefore);
            store.commit("setGlobalAfter",this.globalAfter);
            store.commit("setBaseUrls",this.baseUrls);
            store.commit("initData",this.interfaceEdit);
        },
    }
</script>

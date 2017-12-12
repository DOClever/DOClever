<template>
    <el-row class="row">
        <el-row class="row" style="background-color: white;">
            <expand v-if="param && param.length>0" ref="param">
                <div slot="title">{{paramTab}}</div>
                <runrestparam :index="index" :item="item"></runrestparam>
            </expand>
            <expand ref="query" :expand="queryAutoExpand">
                <div slot="title">{{queryTab}}</div>
                <runquery v-show="!queryRawShow" :index="index" :item="item"></runquery>
                <el-input size="small" type="textarea" :rows="3" style="height: 100px;margin-top: 10px" placeholder="在这里编辑原始的url参数字符串，以&符合分割" v-show="queryRawShow" v-model="queryRawStr"></el-input>
                <el-button type="primary" size="mini" style="margin-top: 5px;margin-left: 10px" @click="toggleQuery">{{queryRawShow?'Commit Raw':'Edit Raw'}}</el-button>
            </expand>
            <expand ref="header">
                <div slot="title">{{headerTab}}</div>
                <runheader  v-show="!headerRawShow" :index="index" :item="item"></runheader>
                <el-input size="small" type="textarea" :rows="3" style="height: 100px;margin-top: 10px" placeholder="在这里编辑原始的header字符串，以回车分割" v-show="headerRawShow" v-model="headerRawStr"></el-input>
                <el-button type="primary" size="mini" style="margin-top: 5px;margin-left: 10px" @click="toggleHeader">{{headerRawShow?'Commit Raw':'Edit Raw'}}</el-button>
            </expand>
            <expand v-if="interface.method=='POST' || interface.method=='PUT' || interface.method=='PATCH'" ref="body" :expand="bodyAutoExpand">
                <div slot="title">{{bodyTab}}</div>
                <runbody v-show="!bodyRawShow" :index="index" :item="item"></runbody>
                <el-input size="small" type="textarea" :rows="3" style="height: 100px;margin-top: 10px" placeholder="在这里编辑原始的url参数字符串，以&符合分割，文件类型用[FILE]代替" v-show="bodyRawShow" v-model="bodyRawStr"></el-input>
                <el-button type="primary" size="mini" style="margin-top: 5px;margin-left: 10px" @click="toggleBody" v-if="bodyInfo.type==0">{{bodyRawShow?'Commit Raw':'Edit Raw'}}</el-button>
            </expand>
            <expand ref="inject">
                <div slot="title">Inject</div>
                <runinject :index="index" :item="item"></runinject>
            </expand>
        </el-row>
        <el-row class="row" style="height: 1px;background-color: lightgray;margin-top: 10px;margin-left: 10px;width: calc(100% - 20px)"></el-row>
        <el-row class="row">
            <el-row class="row" style="text-align: center;height: 50px;line-height: 50px" v-if="example.id">
                <el-radio-group v-model="resultType" size="small">
                    <el-radio-button :label="0">参考输出</el-radio-button>
                    <el-radio-button :label="1">实时输出</el-radio-button>
                </el-radio-group>
            </el-row>
            <template v-if="resultType==1">
                <el-row class="row" style="padding: 10px 10px 10px 20px;margin-bottom: 10px" key="real">
                    <span>
                        Result:&nbsp;&nbsp;<span :style="{color:statusStr.match(/^2/)?'green':'red'}">{{statusStr=='0'?'ERROR':statusStr}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #50a3ff">{{second?("耗时"+second+"秒"):""}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="errorCount>0" style="color: red">Error:&nbsp;{{errorCount}}</span>
                    </span>
                    <el-popover ref="error" placement="bottom" width="400" trigger="hover" v-if="errorCount>0" content="切换到Advance Tab页，移动到红色的行上面即可看到错误信息">
                    </el-popover>
                    <el-button size="mini" type="text" style="font-size: 15px" v-popover:error icon="el-icon-info" v-if="errorCount>0">
                    </el-button>
                </el-row>
                <el-row class="row" style="padding-left: 20px;padding-right: 20px" key="real">
                    <el-tabs type="border-card" id="result">
                        <el-tab-pane label="Preview">
                            <el-row class="row" v-if="type=='object'">
                                <template v-for="item in draw">
                                    <el-row class="row" style="font-size: 14px;min-height: 25px;line-height: 25px;word-break: break-all" v-html="item">
                                    </el-row>
                                </template>
                            </el-row>
                            <img :src="imgUrl" v-else-if="type=='img'">
                            <div v-html="draw" v-else-if="type=='html'"></div>
                            <pre v-else>{{draw}}</pre>
                        </el-tab-pane>
                        <el-tab-pane label="Advance">
                            <el-row class="row" v-if="type=='object'">
                                <template v-for="item in drawMix" v-if="type=='object'">
                                    <el-popover placement="bottom" title="错误信息" width="300" trigger="hover" v-if="existError(item)">
                                        {{getError(item)}}
                                        <el-row class="row" style="font-size: 14px;min-height: 25px;line-height: 25px;word-break: break-all;background-color: rgba(255,0,0,0.3)" v-html="item" slot="reference">
                                        </el-row>
                                    </el-popover>
                                    <el-row class="row" style="font-size: 14px;min-height: 25px;line-height: 25px;word-break: break-all" v-html="item" v-else>
                                    </el-row>
                                </template>
                            </el-row>
                            <img :src="imgUrl" v-else-if="type=='img'">
                            <div v-html="drawMix" v-else-if="type=='html'"></div>
                            <pre v-else>{{drawMix}}</pre>
                        </el-tab-pane>
                        <el-tab-pane label="Raw">
                            <el-row class="row" style="word-break: break-all">
                                {{rawData}}
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="Response Header">
                            <table class="table-hover" style="width: 100%;">
                                <tbody>
                                <template v-for="(value,key) in resHeader">
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
                        <el-tab-pane label="Request Header">
                            <table class="table-hover" style="width: 100%;table-layout: fixed">
                                <tbody>
                                <template v-for="(value,key) in reqHeader">
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
                    </el-tabs>
                </el-row>
            </template>
            <template v-else-if="resultType==0 && selParam.run">
                <el-row class="row" style="padding: 10px 10px 10px 20px;margin-bottom: 10px" key="example">
                    <span>
                        Result:&nbsp;&nbsp;<span :style="{color:selParam.status.match(/^2/)?'green':'red'}">{{selParam.status=='0'?'ERROR':selParam.status}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #50a3ff">{{selParam.second?("耗时"+selParam.second+"秒"):""}}</span>
                    </span>
                </el-row>
                <el-row class="row" style="padding-left: 20px;padding-right: 20px" key="example">
                    <el-tabs type="border-card" id="result">
                        <el-tab-pane label="Preview">
                            <el-row class="row" v-if="selParam.type=='object'">
                                <template v-for="item in selParam.draw">
                                    <el-row class="row" style="font-size: 14px;min-height: 25px;line-height: 25px;word-break: break-all" v-html="item">
                                    </el-row>
                                </template>
                            </el-row>
                            <img :src="selParam.imgUrl" v-else-if="selParam.type=='img'">
                            <div v-html="selParam.draw" v-else-if="selParam.type=='html'"></div>
                            <pre v-else>{{selParam.draw}}</pre>
                        </el-tab-pane>
                        <el-tab-pane label="Raw">
                            <el-row class="row" style="word-break: break-all">
                                {{selParam.rawData}}
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="Response Header">
                            <table class="table-hover" style="width: 100%">
                                <tbody>
                                <template v-for="(value,key) in selParam.resHeader">
                                    <tr style="vertical-align: middle;height: 30px;table-layout: fixed">
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
                        <el-tab-pane label="Request Header">
                            <table class="table-hover" style="width: 100%;table-layout: fixed">
                                <tbody>
                                <template v-for="(value,key) in selParam.reqHeader">
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
                    </el-tabs>
                </el-row>
            </template>
        </el-row>
    </el-row>
</template>
<style>
    #mainRun .expand_slot {
        padding: 0 5px 0 15px!important;
    }
    #result .el-tabs__nav-scroll {
        padding-left: 0px;
        padding-right: 0px;
    }
</style>
<script>
    var runQuery=require("./runQuery.vue")
    var runHeader=require("./runHeader.vue")
    var runBody=require("./runBody.vue")
    var runRestParam=require("./runRestParam.vue")
    var runInject=require("./runInject.vue")
    var expand=require("component/expand.vue");
    module.exports={
        props:["item","index"],
        data:function () {
            return {
                queryAutoExpand:0,
                bodyAutoExpand:0,
                resultType:1
            }
        },
        components:{
            "runquery":runQuery,
            "runheader":runHeader,
            "runbody":runBody,
            "runrestparam":runRestParam,
            "runinject":runInject,
            "expand":expand
        },
        watch:{
            "interface.method":{
                handler:function (val) {
                    if(val=="POST" || val=="PUT" || val=="PATCH")
                    {
                        this.bodyAutoExpand=1
                    }
                    else if(val=="GET" || val=="DELETE")
                    {
                        this.queryAutoExpand=1
                    }
                },
                immediate:true
            },
            "example.id":function (val) {
                if(val)
                {
                    this.resultType=0;
                }
                else
                {
                    this.resultType=1;
                }
            }
        },
        computed:{
            selParam:function () {
                return this.item.selParam
            },
            example:function () {
                return this.item.selExample
            },
            interface:function () {
                return this.$store.state.interface
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
                return "Body ("+(this.item.bodyInfo.type==0?this.bodySave.length:"Raw")+")";
            },
            param:function () {
                return this.item.param
            },
            querySave:function () {
                return this.item.query.filter(function (obj) {
                    if(obj.name)
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
                return this.item.header.filter(function (obj) {
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
                return this.item.body.filter(function (obj) {
                    if(obj.name)
                    {
                        return true
                    }
                    else
                    {
                        return false
                    }
                })
            },
            drawMix:function () {
                return this.item.drawMix
            },
            bodyInfo:function () {
                return this.item.bodyInfo
            },
            reqHeader:function () {
                return this.item.reqHeader
            },
            queryRawShow:function () {
                return this.item.queryRawShow;
            },
            headerRawShow:function () {
                return this.item.headerRawShow;
            },
            bodyRawShow:function () {
                return this.item.bodyRawShow;
            },
            statusStr:function () {
                return this.item.status;
            },
            second:function () {
                return this.item.second;
            },
            type:function () {
                return this.item.type;
            },
            draw:function () {
                return this.item.draw;
            },
            drawMix:function () {
                return this.item.drawMix;
            },
            imgUrl:function () {
                return this.item.imgUrl;
            },
            rawData:function () {
                return this.item.rawData;
            },
            resHeader:function () {
                return this.item.resHeader;
            },
            errorCount:function () {
                return this.item.errorCount;
            },
            queryRawStr:{
                get:function () {
                    return this.item.queryRawStr
                },
                set:function (val) {
                    this.item.queryRawStr=val;
                }
            },
            headerRawStr:{
                get:function () {
                    return this.item.headerRawStr
                },
                set:function (val) {
                    this.item.headerRawStr=val;
                }
            },
            bodyRawStr:{
                get:function () {
                    return this.item.bodyRawStr
                },
                set:function (val) {
                    this.item.bodyRawStr=val;
                },
            },
            baseUrls:function () {
                return this.$store.getters.baseUrls;
            },
        },
        methods:{
            toggleQuery:function () {
                this.$store.commit("toggleQuery");
            },
            toggleHeader:function () {
                this.$store.commit("toggleHeader");
            },
            toggleBody:function () {
                this.$store.commit("toggleBody");
            },
            changeUrl:function (val) {
                this.$store.commit("changeUrl",val);
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
        }
    }
</script>
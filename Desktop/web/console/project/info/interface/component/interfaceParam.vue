<template>
    <el-row class="row" style="font-size: 14px;background-color: white" id="paramContent">
        <expand v-if="param && param.length>0" ref="param">
            <div slot="title">{{paramTab}}</div>
            <restparam :index="index" :item="item"></restparam>
        </expand>
        <expand ref="query" :expand="queryAutoExpand">
            <div slot="title">{{queryTab}}</div>
            <inparamquery :index="index" :item="item"></inparamquery>
            <el-button size="mini" type="primary" style="margin-top: 5px;margin-left: 10px" @click="importQuery" class="btnMini">导入Query字符串</el-button>
        </expand>
        <expand ref="header">
            <div slot="title">{{headerTab}}</div>
            <inparamheader :index="index" :item="item"></inparamheader>
            <el-button size="mini" type="primary" style="margin-top: 5px;margin-left: 10px" @click="importHeader" class="btnMini">导入HTTP Header字符串</el-button>
        </expand>
        <expand v-if="interfaceEdit.method=='POST' || interfaceEdit.method=='PUT' || interfaceEdit.method=='PATCH'" ref="body" :expand="bodyAutoExpand">
            <div slot="title">{{bodyTab}}</div>
            <inparambody :index="index" :item="item"></inparambody>
            <el-button size="mini" type="primary" style="margin-top: 5px;margin-left: 10px" @click="importBody" v-if="bodyInfo.type==0" class="btnMini">导入Body字符串</el-button>
        </expand>
        <expand ref="inject">
            <div slot="title">Inject</div>
            <inparaminject :index="index" :item="item"></inparaminject>
        </expand>
        <expand ref="result" :expand="1">
            <div slot="title">Result</div>
            <el-row class="row" style="background-color: white;margin-top: 15px;">
                <el-row class="row" style="padding:0 0 0 20px;height: 30px;line-height: 30px;margin-bottom: 20px">
                    <el-radio class="radio" :label="0" v-model="outInfo.type"  id="outJson">JSON</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-radio class="radio" :label="1" v-model="outInfo.type" id="outRaw">Raw</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-select v-model="outInfo.jsonType" v-if="outInfo.type==0" @input="changeJSONType">
                        <el-option :value="0" label="Object"></el-option>
                        <el-option :value="1" label="Array"></el-option>
                    </el-select>
                </el-row>
                <outparam v-if="outInfo.type==0" :index="index" :data="item"></outparam>
                <el-row class="row" style="height: 60px;line-height: 60px;" v-else>
                    <el-col class="col" :span="14" style="height: 100%;text-align: center">
                        <el-tooltip class="item" effect="dark" :content="outInfo.rawRemark" placement="bottom" :disabled="!outInfo.rawRemark">
                            <el-input size="small" style="width: 90%" placeholder="请输入备注" v-model="outInfo.rawRemark">
                                <i slot="suffix" class="el-input__icon el-icon-edit" @click="editRemark" style="cursor: pointer"></i>
                            </el-input>
                        </el-tooltip>
                    </el-col>
                    <el-col class="col" :span="10" style="text-align: center">
                        <el-tooltip class="item" effect="dark" :content="outInfo.rawMock" placement="bottom" :disabled="!outInfo.rawMock">
                            <el-input size="small" style="width: 90%" placeholder="请输入Mock数据" v-model="outInfo.rawMock">
                                <i slot="suffix" class="el-input__icon el-icon-edit" @click="editMock" style="cursor: pointer"></i>
                            </el-input>
                        </el-tooltip>
                    </el-col>
                </el-row>
                <el-button type="primary" size="mini" style="margin-top: 5px;margin-left: 20px" @click="importJSON" v-if="outInfo.type==0" class="btnMini">
                    导入JSON
                </el-button>
                <span style="right: 50px;font-weight: bold;top: 7px;position: absolute"><a href="http://doclever.cn/resource/other/mockrule.html" style="color: #50a3ff;" target="_blank">mock规则</a></span>
            </el-row>
        </expand>
        <el-row class="row" style="height: 1px;background-color: lightgray;margin-top: 10px;margin-left: 10px;width: calc(100% - 20px)"></el-row>
        <el-row class="row">
            <el-row class="row" style="text-align: center;height: 50px;line-height: 50px" v-if="example && example.id">
                <el-radio-group v-model="resultType" size="small">
                    <el-radio-button :label="0">参考输出</el-radio-button>
                    <el-radio-button :label="1">实时输出</el-radio-button>
                </el-radio-group>
            </el-row>
            <template v-if="resultType==1">
                <el-row class="row" style="padding: 10px 10px 10px 20px;margin-bottom: 10px" key="real">
                    <span>
                        Response:&nbsp;&nbsp;<span :style="{color:(statusStr && statusStr.match(/^2/))?'green':'red'}">{{statusStr=='0'?'ERROR':statusStr}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #50a3ff">{{second?("耗时"+second+"秒"):""}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="errorCount>0" style="color: red">Error:&nbsp;{{errorCount}}</span>
                    </span>
                    <el-popover ref="error" placement="bottom" width="400" trigger="hover" v-if="errorCount>0" content="切换到Advance Tab页，移动到红色的行上面即可看到错误信息">
                    </el-popover>
                    <el-button size="mini" type="text" style="font-size: 15px;margin-top: -5px" v-popover:error icon="el-icon-info" v-if="errorCount>0">
                    </el-button>
                    <el-button size="mini" class="btnMini" type="primary" @click="generateResult" v-if="this.item.run">
                        生成Result
                    </el-button>
                </el-row>
                <el-row class="row" style="padding-left: 20px;padding-right: 20px" key="real">
                    <el-tabs type="border-card" class="interfaceTabResultContent">
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
                        Response:&nbsp;&nbsp;<span :style="{color:selParam.status.match(/^2/)?'green':'red'}">{{selParam.status=='0'?'ERROR':selParam.status}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #50a3ff">{{selParam.second?("耗时"+selParam.second+"秒"):""}}</span>
                    </span>
                    <el-button size="mini" class="btnMini" type="primary" @click="generateResult">
                        生成Result
                    </el-button>
                </el-row>
                <el-row class="row" style="padding-left: 20px;padding-right: 20px" key="example">
                    <el-tabs type="border-card" class="interfaceTabResultContent">
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
    #paramContent .expand_slot {
        padding: 0 5px 0 15px!important;
    }
    .interfaceTabResultContent .el-tabs__content {
        background-color: white;
        padding: 15px!important;
    }
</style>
<script>
    var inParamQuery=require("./inparamQuery.vue")
    var inParamHeader=require("./inparamHeader.vue")
    var inParamBody=require("./inparamBody.vue")
    var outParam=require("./outParam.vue")
    var valueList=require("./valueList.vue")
    var restParam=require("./restParam.vue")
    var rawText=require("./rawText.vue")
    var inParamInject=require("./inparamInject.vue")
    var expand=require("component/expand.vue");
    module.exports={
        props:["index","item","source"],
        data:function () {
            return {
                queryAutoExpand:0,
                bodyAutoExpand:0,
                resultType:1
            }
        },
        components:{
            "inparamquery":inParamQuery,
            "inparamheader":inParamHeader,
            "inparambody":inParamBody,
            "outparam":outParam,
            "valuelist":valueList,
            "restparam":restParam,
            "rawtext":rawText,
            "inparaminject":inParamInject,
            "expand":expand
        },
        watch:{
            "interfaceEdit.method":{
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
            rawJSON:function () {
                return this.item.rawJSON
            },
            interfaceEdit:function () {
                return this.source?this.source:this.$store.state.interfaceEdit
            },
            outInfo:function () {
                return this.item.outInfo
            },
            bodyInfo:function () {
                return this.item.bodyInfo
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
            reqHeader:function () {
                return this.item.reqHeader
            },
        },
        methods:{
            importJSON:function () {
                var _this=this;
                $.inputMul(this,"请输入JSON",function (val) {
                    if(!val)
                    {
                        $.tip("请输入JSON",0);
                        return false
                    }
                    var obj;
                    try
                    {
                        obj=JSON.parse(val)
                    }
                    catch (err)
                    {
                        $.tip("JSON不符合格式",0);
                        return false
                    }
                    _this.$store.commit("importResult",obj);
                    return true;
                });
            },
            importQuery:function () {
                var _this=this;
                $.inputMul(this,"请输入Query字符串，比如:name=sx&pwd=111",function (val) {
                    if(!val)
                    {
                        $.tip("请输入Query字符串",0);
                        return false
                    }
                    _this.$store.commit("importQuery",val);
                    return true;
                });
            },
            importHeader:function () {
                var _this=this;
                $.inputMul(this,"请输入HTTP Header字符串，以回车分割，比如:\nRequest Method:GET\nStatus Code:200",function (val) {
                    if(!val)
                    {
                        $.tip("请输入HTTP Header字符串",0);
                        return false
                    }
                    _this.$store.commit("importHeader",val);
                    return true;
                });
            },
            importBody:function () {
                var _this=this;
                $.inputMul(this,"请输入Body Key-Value字符串,文件类型的值用[FILE]代替,比如:name=sx&pwd=111&file=[FILE]",function (val) {
                    if(!val)
                    {
                        $.tip("请输入Body Key-Value字符串",0);
                        return false
                    }
                    _this.$store.commit("importBody",val);
                    return true;
                });
            },
            changeJSONType:function () {
                this.$store.commit("toggleResultType");
            },
            editRemark:function () {
                var _this=this;
                $.inputMul(this,"编辑remark",function (val) {
                    _this.outInfo.rawRemark=val;
                    return true;
                },1,this.outInfo.rawRemark)
            },
            editMock:function () {
                var _this=this;
                $.inputMul(this,"编辑Mock",function (val) {
                    _this.outInfo.rawMock=val;
                    return true;
                },1,this.outInfo.rawMock)
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
            generateResult:function () {
                this.$store.dispatch("generateResult",this.resultType);
            }
        },
    }
</script>
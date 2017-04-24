<template>
    <el-row class="row" style="margin:0 0 0 5px" id="body" :gutter="20">
        <el-col class="col" :span="6" style="min-height: 600px;background-color: white;box-shadow: 2px 2px 2px #888888;border-radius: 5px;margin: 0;padding: 0">
            <el-row class="row" style="height: 50px;background-color: #20A0FF;color: white;margin: 0;padding: 0" id="group" v-if="!search">
                <el-col class="col" :span="6" style="line-height: 50px;text-align: center;font-weight: bold;font-size: 15px;padding: 0">
                    分组
                </el-col>
                <el-col class="col" :span="session.role==0?9:15"></el-col>
                <el-col class="col" :span="3" style="cursor: pointer;text-align: center;line-height: 50px;" title="导入分组" v-if="session.role==0" @click.native="importGroup">
                    <i class="fa fa-download"></i>
                </el-col>
                <el-col class="col" :span="3" style="cursor: pointer;text-align: center;line-height: 50px;" title="添加分组" v-if="session.role==0" @click.native="addGroup">
                    <i class="el-icon-plus"></i>
                </el-col>
                <el-col class="col" :span="3" style="cursor: pointer;text-align: center;line-height: 50px;" title="搜索" @click.native="search=true">
                    <i class="el-icon-search"></i>
                </el-col>
            </el-row>
            <el-row class="row" style="height: 50px;background-color: transparent;color: white;margin: 0;line-height: 50px" v-else>
                <el-input placeholder="请输入查找的接口" @change="searchInterface" v-model="searchText">
                    <template slot="append">
                        <el-button type="text" style="font-size: 14px;width: 50px;color: #20a0ff" @click="cancelSearch">取消</el-button>
                    </template>
                    <template slot="prepend">
                        <el-select v-model="searchType" @input="searchInterface" style="width: 75px">
                            <el-option :value="0" label="名称"></el-option>
                            <el-option :value="1" label="路径"></el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-row>
            <interfacelist></interfacelist>
        </el-col>
        <el-col class="col" :span="18" id="info">
            <el-row class="row" v-if="preview==0 && interfaceEdit">
                <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;padding: 15px 0" >
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            名称
                        </el-col>
                        <el-col class="col" :span="10" style="height: 50px;line-height: 50px;text-align: left">
                            <el-input style="width: 90%" placeholder="请输入接口名称" v-model="interfaceEdit.name"></el-input>
                        </el-col>
                        <el-col class="col" :span="2" style="text-align: center">
                            <el-popover ref="popover1" placement="bottom" title="修改信息" width="400" trigger="hover" :content="editInfo">
                            </el-popover>
                            <el-button type="text" v-popover:popover1 style="font-size: 20px">
                                <span class="fa fa-user"></span>
                            </el-button>
                        </el-col>
                        <el-col class="col" :span="1" style="text-align: left">
                        </el-col>
                        <el-col class="col" :span="3" style="height: 50px;line-height: 50px;text-align: left" id="editSave">
                            <el-button :loading="savePending" type="primary" style="width: 65%" @click="save" v-if="session.role==0">
                                保存
                            </el-button>
                        </el-col>
                        <el-col class="col" :span="3" style="height: 50px;line-height: 50px;text-align: left" id="editRun">
                            <el-button type="primary" style="width: 65%" @click="run">
                                运行
                            </el-button>
                        </el-col>
                        <el-col class="col" :span="3" style="height: 50px;line-height: 50px;text-align: left" id="preview">
                            <el-button type="primary" style="width: 65%" @click="changePreview(1)">
                                预览
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            路径
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-popover placement="bottom" title="路径信息" width="500" trigger="focus" content="路径不包含baseUrl，baseUrl请前往右上角项目管理里面设置。例如http://abc.com/login,http://abc.com是baseUrl,这里输入/login即可,支持restful url形式，例如：/info/{name} 支持路径参数的粘贴，系统会自动识别路径和query参数">
                                <el-input style="width: 90%" placeholder="请输入接口路径(不包含BaseUrl)" v-model="interfaceEdit.url" slot="reference" @change="changeUrl" @paste.native="paste"></el-input>
                            </el-popover>
                        </el-col>
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            方法
                        </el-col>
                        <el-col class="col" :span="10" style="text-align: center">
                            <el-select style="width: 80%;text-align: center" v-model="interfaceEdit.method" @input="changeMethod">
                                <el-option  value="GET"></el-option>
                                <el-option  value="POST"></el-option>
                                <el-option  value="PUT"></el-option>
                                <el-option  value="DELETE"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            分组
                        </el-col>
                        <el-col class="col" :span="10" style="text-align: left">
                            <el-select style="width: 90%;text-align: center" v-model="interfaceEdit.group._id">
                                <el-option v-for="item in interfaceList" :value="item._id" :label="item.name"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            状态
                        </el-col>
                        <el-col class="col" :span="10" style="text-align: center">
                            <el-select style="width: 80%;text-align: center" v-model="interfaceEdit.finish">
                                <el-option  :value="0" label="开发中"></el-option>
                                <el-option  :value="1" label="开发完成"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 90px;line-height: 90px;text-align: center">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            简介
                        </el-col>
                        <el-col class="col" :span="22" style="text-align: left">
                            <el-input type="textarea" :rows="3" style="width: 95%;vertical-align: middle" placeholder="请输入关于该接口的简介" v-model="interfaceEdit.remark"></el-input>
                        </el-col>
                    </el-row>
                </el-row>
                <el-row class="row" style="background-color: white;padding: 20px;margin-top: 15px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                    <el-tabs type="card">
                        <el-tab-pane :label="paramTab" v-if="param.length>0">
                            <restparam></restparam>
                        </el-tab-pane>
                        <el-tab-pane :label="queryTab">
                            <inparamquery></inparamquery>
                            <el-button size="small" type="primary" style="margin-top: 10px;margin-left: 10px" @click="importQuery">导入Query字符串</el-button>
                        </el-tab-pane>
                        <el-tab-pane :label="headerTab">
                            <inparamheader></inparamheader>
                            <el-button size="small" type="primary" style="margin-top: 10px;margin-left: 10px" @click="importHeader">导入HTTP Header字符串</el-button>
                        </el-tab-pane>
                        <el-tab-pane :label="bodyTab" v-if="interfaceEdit.method=='POST' || interfaceEdit.method=='PUT'">
                            <inparambody></inparambody>
                            <el-button size="small" type="primary" style="margin-top: 10px;margin-left: 10px" @click="importBody" v-if="bodyInfo.type==0">导入Body字符串</el-button>
                        </el-tab-pane>
                        <el-tab-pane label="Inject">
                            <inparaminject></inparaminject>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
                <el-row class="row" style="background-color: white;padding: 20px;margin-top: 15px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                    <el-tabs type="card">
                        <el-tab-pane label="Result">
                            <el-row class="row" style="padding:0 0 0 20px;height: 30px;line-height: 30px;margin-bottom: 20px">
                                <el-radio class="radio" :label="0" v-model="outInfo.type"  id="outJson">JSON</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
                                <el-radio class="radio" :label="1" v-model="outInfo.type" id="outRaw">Raw</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <el-select v-model="outInfo.jsonType" v-if="outInfo.type==0" @input="changeJSONType">
                                    <el-option :value="0" label="Object"></el-option>
                                    <el-option :value="1" label="Array"></el-option>
                                </el-select>
                            </el-row>
                            <outparam v-if="outInfo.type==0"></outparam>
                            <el-row class="row" style="height: 60px;line-height: 60px;" v-else>
                                <el-col class="col" :span="14" style="height: 100%;text-align: center">
                                    <el-input style="width: 90%" placeholder="请输入备注" v-model="outInfo.rawRemark"></el-input>
                                </el-col>
                                <el-col class="col" :span="10" style="text-align: center">
                                    <el-input type="textarea" :rows="2" style="width: 90%" placeholder="请输入Mock数据" v-model="outInfo.rawMock"></el-input>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                    <el-button type="primary" size="small" style="margin-top: 10px;margin-left: 20px" @click="importJSON" v-if="outInfo.type==0">
                        导入JSON
                    </el-button>
                    <span style="right: 50px;font-weight: bold;top: 25px;position: absolute"><a href="mockrule.html" style="color: #50a3ff;" target="_blank">mock规则</a></span>
                    <el-popover ref="popover2" placement="bottom" title="如何拖动" width="400" trigger="hover" content="Result列表的元素可以拖动，如果要把一个子元素拖动到顶层元素，则拖动到它所属的顶层Object或者Array类型元素上停留2秒，当颜色变为橘黄色的时候，松开即可！">
                    </el-popover>
                    <span style="left: 100px;font-size: 20px;top: 25px;position: absolute;color: #20A0FF" v-popover:popover2><i class="fa fa-question-circle"></i></span>
                </el-row>
                <el-row class="row" style="height: 100px">

                </el-row>
            </el-row>
            <el-row class="row" style="padding: 15px 10px 10px 0;background-color: white;font-size: 20px;font-weight: bold;" v-else-if="preview==1 && interfaceEdit">
                <el-row class="row" style="height: 50px;border-bottom: 1px gray solid">
                    <el-col class="col" :span="4">

                    </el-col>
                    <el-col class="col" :span="16" style="text-align:center;line-height: 50px;color: #20A0FF;font-size: 30px">
                        {{interfaceEdit.name}}
                    </el-col>
                    <el-col class="col" :span="4" style="text-align: center;line-height: 50px">
                        <el-button type="primary" style="width: 80%" v-if="session.role==0" @click="changePreview(0)">
                            返回
                        </el-button>
                        <el-button type="primary" style="width: 80%" v-else @click="run">
                            运行
                        </el-button>
                    </el-col>
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff">
                    Method：
                </el-row>
                <el-row class="row" style="padding:0 30px;" :style="{color:methodColor(interfaceEdit.method)}">
                    {{interfaceEdit.method}}
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff">
                    Path：
                </el-row>
                <el-row class="row" style="padding:0 30px;color: #ff1a27">
                    {{interfaceEdit.url}}
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff">
                    开发状态：
                </el-row>
                <el-row class="row" style="padding:0 30px;">
                    {{interfaceEdit.finish?"开发完成":"开发中"}}
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff">
                    描述：
                </el-row>
                <el-row class="row" style="padding:0 30px;">
                    {{interfaceEdit.remark?interfaceEdit.remark:"无"}}
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff" v-if="param && param.length>0">
                    Restful Param:
                </el-row>
                <el-row class="row" style="padding:0 30px;" v-if="param && param.length>0">
                    <table style="width: 100%;font-size: 17px;border-collapse: collapse" border="1" bordercolor="#ddd">
                        <thead style="background-color: #50a3ff;color:white;text-align: center;vertical-align: middle">
                        <td style="width: 30%">
                            名称
                        </td>
                        <td style="width: 70%">
                            备注
                        </td>
                        </thead>
                        <tbody>
                        <template v-for="item in param">
                            <tr style="text-align: center;vertical-align: middle;height: 40px;word-break: break-all">
                                <td style="width: 30%">
                                    {{item.name}}
                                </td>
                                <td style="width: 70%">
                                    {{item.remark?item.remark:"无"}}
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff" v-if="querySave.length>0">
                    Query:
                </el-row>
                <el-row class="row" style="padding:0 30px;" v-if="querySave.length>0">
                    <table style="width: 100%;font-size: 17px;border-collapse: collapse" border="1" bordercolor="#ddd">
                        <thead style="background-color: #50a3ff;color:white;text-align: center;vertical-align: middle">
                        <td style="width: 30%">
                            名称
                        </td>
                        <td style="width: 20%">
                            是否可选
                        </td>
                        <td style="width: 50%">
                            备注
                        </td>
                        </thead>
                        <tbody>
                        <template v-for="item in querySave">
                            <tr style="text-align: center;vertical-align: middle;height: 40px;word-break: break-all">
                                <td style="width: 30%">
                                    {{item.name}}
                                </td>
                                <td style="width: 20%">
                                    {{item.must?"必选":"可选"}}
                                </td>
                                <td style="width: 50%">
                                    {{item.remark?item.remark:"无"}}
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff" v-if="headerSave.length>0">
                    Http Header:
                </el-row>
                <el-row class="row" style="padding:0 30px;" v-if="headerSave.length>0">
                    <table style="width: 100%;font-size: 17px;border-collapse: collapse" border="1" bordercolor="#ddd">
                        <thead style="background-color: #50a3ff;color:white;text-align: center;vertical-align: middle">
                        <td style="width: 30%">
                            Key
                        </td>
                        <td style="width: 30%">
                            Value
                        </td>
                        <td style="width: 40%">
                            备注
                        </td>
                        </thead>
                        <tbody>
                        <template v-for="item in headerSave">
                            <tr style="text-align: center;vertical-align: middle;height: 40px;word-break: break-all">
                                <td style="width: 30%">
                                    {{item.name}}
                                </td>
                                <td style="width: 30%">
                                    {{item.value}}
                                </td>
                                <td style="width: 40%">
                                    {{item.remark?item.remark:"无"}}
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff" v-if="(interfaceEdit.method=='PUT' || interfaceEdit.method=='POST') && (bodySave.length>0 || bodyInfo.type==1)">
                    Body:
                </el-row>
                <el-row class="row" style="padding:0 30px;" v-if="(interfaceEdit.method=='PUT' || interfaceEdit.method=='POST') && (bodySave.length>0 || bodyInfo.type==1)">
                    <table style="width: 100%;font-size: 17px;border-collapse: collapse" border="1" v-if="bodyInfo.type==0" bordercolor="#ddd">
                        <thead style="background-color: #50a3ff;color:white;text-align: center;vertical-align: middle">
                        <td style="width: 30%">
                            名称
                        </td>
                        <td style="width: 20%">
                            类型
                        </td>
                        <td style="width: 20%">
                            是否可选
                        </td>
                        <td style="width: 30%">
                            备注
                        </td>
                        </thead>
                        <tbody>
                        <template v-for="item in bodySave">
                            <tr style="text-align: center;vertical-align: middle;height: 40px;word-break: break-all">
                                <td style="width: 30%">
                                    {{item.name}}
                                </td>
                                <td style="width: 20%">
                                    {{item.type==0?"文本":"文件"}}
                                </td>
                                <td style="width: 20%">
                                    {{item.must?"必选":"可选"}}
                                </td>
                                <td style="width: 30%">
                                    {{item.remark?item.remark:"无"}}
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                    <el-row v-else-if="bodyInfo.type==1 && bodyInfo.rawType==2">
                        <template v-for="item in rawJSON">
                            <div class="row" style="font-size: 18px;min-height: 25px;line-height: 25px;margin: 0;padding: 0;background-color: #fff9e6;word-break: break-all" v-html="item">
                            </div>
                        </template>
                    </el-row>
                    <div class="row" style="margin: 0;padding: 0" v-else>
                        <table style="width: 100%;font-size: 17px;border-collapse: collapse" border="1" bordercolor="#ddd">
                            <thead style="background-color: #50a3ff;color:white;text-align: center;vertical-align: middle">
                            <td style="width: 30%">
                                类型
                            </td>
                            <td style="width: 70%">
                                备注
                            </td>
                            </thead>
                            <tbody>
                            <tr style="text-align: center;vertical-align: middle;height: 40px;word-break: break-all">
                                <td style="width: 30%">
                                    {{bodyInfo.rawType==0?"文本流":"二进制流"}}
                                </td>
                                <td style="width: 70%">
                                    {{bodyInfo.rawType==0?(bodyInfo.rawTextRemark?bodyInfo.rawTextRemark:"无"):(bodyInfo.rawFileRemark?bodyInfo.rawFileRemark:"无")}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="row" style="margin: 10px 0 0 0;padding: 0" v-if="bodyInfo.rawType==0 && bodyInfo.rawText">
                            <span style="font-size: 15px;">文本示例:</span>
                            <pre>{{bodyInfo.rawText}}</pre>
                        </div>
                    </div>
                </el-row>
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff" v-if="(outInfo.type==0 && drawMix.length>0) || outInfo.type==1">
                    Result:
                </el-row>
                <el-row class="row" style="padding: 0 30px;">
                    <el-row class="row" v-if="outInfo.type==0 && drawMix.length>0">
                        <template v-for="item in drawMix">
                            <div class="row" style="font-size: 18px;min-height: 25px;line-height: 25px;margin: 0;padding: 0;background-color: #fff9e6;word-break: break-all" v-html="item">
                            </div>
                        </template>
                    </el-row>
                    <table style="width: 100%;font-size: 17px;border-collapse: collapse" border="1" v-if="outInfo.type==1" bordercolor="#ddd">
                        <thead style="background-color: #50a3ff;color:white;text-align: center;vertical-align: middle">
                        <td style="width: 20%">
                            类型
                        </td>
                        <td style="width: 50%">
                            备注
                        </td>
                        <td style="width: 30%">
                            Mock
                        </td>
                        </thead>
                        <tbody>
                        <tr style="text-align: center;vertical-align: middle;height: 40px;word-break: break-all">
                            <td style="width: 20%">
                                RAW
                            </td>
                            <td style="width: 50%">
                                {{outInfo.rawRemark?outInfo.rawRemark:"无"}}
                            </td>
                            <td style="width: 30%">
                                {{rawMock}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </el-row>
                <el-row class="row" style="height: 100px"></el-row>
            </el-row>
        </el-col>
    </el-row>
</template>


<script>
    var interfaceList=require("./interfaceList.vue")
    var inParamQuery=require("./inparamQuery.vue")
    var inParamHeader=require("./inparamHeader.vue")
    var inParamBody=require("./inparamBody.vue")
    var outParam=require("./outParam.vue")
    var valueList=require("./valueList.vue")
    var restParam=require("./restParam.vue")
    var rawText=require("./rawText.vue")
    var inParamInject=require("./inparamInject.vue")
    var run=require("./run.vue")
    var encrypt=require("./encrypt.vue")
    var store=require("../projectinfo/storeInterface");
    var bus=require("../bus/projectInfoBus")
    module.exports={
        data:function () {
          return {
              session:$.clone(session.raw()),
              savePending:false,
          }
        },
        store:store,
        components:{
            "interfacelist":interfaceList,
            "inparamquery":inParamQuery,
            "inparamheader":inParamHeader,
            "inparambody":inParamBody,
            "outparam":outParam,
            "valuelist":valueList,
            "restparam":restParam,
            "rawtext":rawText,
            "inparaminject":inParamInject,
            "encrypt":encrypt,
            "run":run
        },
        watch:{
            preview:function (val) {
                store.commit("changePreview",val);
            },
            "interfaceEdit.url":function (val) {
                if(/http\:\/\/|https\:\/\//i.test(val))
                {
                    $.tip("请不要在路径里面包含baseUrl",0);
                }
            }
        },
        computed:{
            searchText:{
                get:function () {
                    return store.state.searchText;
                },
                set:function (val) {
                    store.commit("setSearchText",val)
                }
            },
            search:{
                get:function () {
                    return store.state.search;
                },
                set:function (val) {
                    store.commit("setSearch",val)
                }
            },
            searchType:{
                get:function () {
                    return store.state.searchType;
                },
                set:function (val) {
                    store.commit("setSearchType",val)
                }
            },
            preview:function () {
                return store.state.preview
            },
            drawMix:function () {
                return store.state.drawMix
            },
            rawJSON:function () {
                return store.getters.rawJSON
            },
            interfaceEdit:function () {
                return store.state.interfaceEdit
            },
            interfaceList:function () {
                return store.state.interfaceList
            },
            outInfo:function () {
                return store.state.outInfo
            },
            bodyInfo:function () {
                return store.state.bodyInfo
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
            editInfo:function () {
                return this.interfaceEdit?(this.interfaceEdit.createdAt?((this.interfaceEdit.owner?this.interfaceEdit.owner.name:"")+"在"+this.interfaceEdit.createdAt+"创建，最近修改被"+(this.interfaceEdit.editor?this.interfaceEdit.editor.name:"")+"在"+this.interfaceEdit.updatedAt+"改动"):"接口尚未保存"):"";
            },
            rawMock:function () {
                return store.getters.rawMock;
            }
        },
        methods:{
            addGroup:function () {
                $.input("请输入分组名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入分组名称",0);
                        return false
                    }
                    var query={};
                    query.id=session.get("projectId");
                    query.name=val.value;
                    $.startHud("#body");
                    store.dispatch("addGroup",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("新建成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                });
            },
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
                    store.commit("importResult",obj);
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
                    store.commit("importQuery",val);
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
                    store.commit("importHeader",val);
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
                    store.commit("importBody",val);
                    return true;
                });
            },
            changeMethod:function () {
                store.commit("changeMethod");
            },
            save:function () {
                if(!this.interfaceEdit.name)
                {
                    $.tip("请填入接口名称",0);
                    return;
                }
                else if(!this.interfaceEdit.url)
                {
                    $.tip("请填入接口地址",0);
                    return;
                }
                this.savePending=true;
                var _this=this;
                store.dispatch("save").then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1)
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            changeUrl:function (val) {
                store.commit("changeUrl",val);
            },
            changePreview:function (val) {
                store.commit("setPreview",val);
            },
            run:function () {
                session.set("interfaceId",this.interfaceEdit._id);
                session.set("groupId",this.interfaceEdit.group._id);
                var child=$.showBox(this,"run",{
                    "interfaceEdit":$.clone(this.interfaceEdit),
                    "baseUrls":$.clone(store.state.baseUrls),
                    "status":$.clone(store.state.status),
                    "globalBefore":store.state.globalBefore,
                    "globalAfter":store.state.globalAfter,
                });
                child.$on("save",function () {
                    store.dispatch("newInterface");
                });
            },
            methodColor:function (val) {
                return helper.methodColor(val);
            },
            paste:function () {
                setTimeout(function () {
                    var path=store.state.interfaceEdit.url;
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
                                        value:arrQuery1[1]?[{
                                            value:decodeURIComponent(arrQuery1[1]),
                                            remark:""
                                        }]:[],
                                        must:1,
                                        remark:""
                                    })
                                }
                            }
                        }
                        store.state.interfaceEdit.url=store.state.interfaceEdit.url.substring(0,index);
                    }
                    else
                    {
                        arrStoreQuery.push({
                            name:"",
                            must:0,
                            remark:""
                        })
                    }
                    store.state.interfaceEdit.queryParam=arrStoreQuery;
                },100)
            },
            searchInterface:function () {
                store.commit("searchInterface");
            },
            cancelSearch:function () {
                store.commit("setSearch",false);
                store.commit("setSearchText","");
                store.commit("setSearchType",0);
                store.commit("setInterfaceSearchList",[]);
            },
            importGroup:function () {
                $.inputMul(this,"请输入SBDoc导出分组的JSON",function (val) {
                    if(!val)
                    {
                        $.tip("请输入JSON",0);
                        return false;
                    }
                    $.startHud();
                    net.post("/group/importjson",{
                        id:session.get("projectId"),
                        json:val
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("导入成功",1);
                            store.commit("initInterfaceList",data.data);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            changeJSONType:function () {
                store.commit("toggleResultType");
            }
        },
        created:function () {
            bus.$on("initInterface",function (data) {
                store.dispatch("getAllInterface",data)
            })
            bus.$on("baseUrl",function (data) {
                store.commit("setBaseUrls",data);
            })
            bus.$on("initStatus",function (data) {
                store.commit("setStatus",data);
            })
            bus.$on("initInfo",function (data) {
                store.commit("setGlobalBefore",data.before);
                store.commit("setGlobalAfter",data.after);
            })
            bus.$on("globalInject",function (data) {
                store.commit("setGlobalBefore",data.before);
                store.commit("setGlobalAfter",data.after);
            })
        },
    }
</script>
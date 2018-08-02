<template>
    <el-row class="row" id="mainPreview" style="background-color: white">
        <el-row class="row" style="font-size: 14px;">
            <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;color: #17B9E6">
                {{interface.name}}<span style="color:gray">({{interface.teamName?interface.teamName:"无团队"}}->{{interface.project.name}}->{{interface.version?interface.version.name:"master"}})</span>
            </el-row>
            <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                Method:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;color: #17b9e6">
                {{interface.method}}
            </el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                Path:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;color: #17b9e6">
                {{interface.url}}
            </el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                状态:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;">
                {{interface.finish==1?"开发url完成":(interface.finish==2?"已废弃":"开发中")}}
            </el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                描述:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;">
                {{interface.remark?interface.remark:"无"}}
            </el-row>
            <el-tabs style="margin-top: 20px" v-model="tabIndex" id="previewParam">
                <template v-for="(item, index) in param">
                    <el-tab-pane :key="item.id"  :label="item.name" :name="index">
                        <expand v-if="paramSave && paramSave.length>0" ref="param">
                            <div slot="title">Restful Param:</div>
                            <el-row class="row" style="padding:0 30px;">
                                <table style="width: 100%;border-collapse: collapse" class="table-hover">
                                    <thead style="color:gray;text-align: center;vertical-align: middle">
                                    <td style="width: 30%">
                                        名称
                                    </td>
                                    <td style="width: 70%">
                                        备注
                                    </td>
                                    </thead>
                                    <tbody>
                                    <template v-for="item in paramSave">
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
                        </expand>
                        <expand v-if="querySave.length>0" ref="query">
                            <div slot="title">Query:</div>
                            <el-row class="row" style="padding:0 30px;">
                                <table style="width: 100%;border-collapse: collapse" class="table-hover">
                                    <thead style="color:gray;text-align: center;vertical-align: middle">
                                    <td style="width: 30%">
                                        名称
                                    </td>
                                    <td style="width: 20%">
                                        是否必填
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
                                                {{item.must?"必填":"选填"}}
                                            </td>
                                            <td style="width: 50%">
                                                {{item.remark?item.remark:"无"}}
                                            </td>
                                        </tr>
                                    </template>
                                    </tbody>
                                </table>
                            </el-row>
                        </expand>
                        <expand v-if="headerSave.length>0" ref="header">
                            <div slot="title">Http Header:</div>
                            <el-row class="row" style="padding:0 30px;">
                                <table style="width: 100%;border-collapse: collapse" class="table-hover">
                                    <thead style="color:gray;text-align: center;vertical-align: middle">
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
                        </expand>
                        <expand v-if="(interface.method=='PUT' || interface.method=='POST' || interface.method=='PATCH') && (bodySave.length>0 || bodyInfo.type==1)" ref="body">
                            <div slot="title">Body:</div>
                            <el-row class="row" style="padding:0 30px;">
                                <table style="width: 100%;border-collapse: collapse" v-if="bodyInfo.type==0" class="table-hover">
                                    <thead style="color:gray;text-align: center;vertical-align: middle">
                                    <td style="width: 30%">
                                        名称
                                    </td>
                                    <td style="width: 20%">
                                        类型
                                    </td>
                                    <td style="width: 20%">
                                        是否必填
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
                                                {{item.must?"必选":"选填"}}
                                            </td>
                                            <td style="width: 30%">
                                                {{item.remark?item.remark:"无"}}
                                            </td>
                                        </tr>
                                    </template>
                                    </tbody>
                                </table>
                                <el-row v-else-if="bodyInfo.type==1 && bodyInfo.rawType==2">
                                    <el-radio-group size="small" v-model="bodyJSONType">
                                        <el-radio-button :label="0">
                                            JSON
                                        </el-radio-button>
                                        <el-radio-button :label="1">
                                            Table
                                        </el-radio-button>
                                    </el-radio-group>
                                    <el-row class="row" style="margin-top: 10px">
                                        <div v-show="!bodyJSONType">
                                            <template v-for="item in rawJSON">
                                                <div class="row" style="font-size: 14px;min-height: 25px;line-height: 25px;margin: 0;padding: 0;background-color: #fff9e6;word-break: break-all" v-html="item">
                                                </div>
                                            </template>
                                        </div>
                                        <bodyjsonpreview :index="index" :data="item" v-show="bodyJSONType"></bodyjsonpreview>
                                    </el-row>
                                </el-row>
                                <div class="row" style="margin: 0;padding: 0" v-else>
                                    <table style="width: 100%;border-collapse: collapse" class="table-hover">
                                        <thead style="color:gray;text-align: center;vertical-align: middle">
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
                                        <span style="font-size: 14px;">文本示例:</span>
                                        <pre>{{bodyInfo.rawText}}</pre>
                                    </div>
                                </div>
                            </el-row>
                        </expand>
                        <expand v-if="(outInfo.type==0 && drawMix.length>0) || outInfo.type==1" ref="result">
                            <div slot="title">Result:</div>
                            <el-row class="row" style="padding: 0 30px;">
                                <el-row class="row" v-if="outInfo.type==0 && drawMix.length>0">
                                    <el-radio-group size="small" v-model="outJSONType">
                                        <el-radio-button :label="0">
                                            JSON
                                        </el-radio-button>
                                        <el-radio-button label="1">
                                            Table
                                        </el-radio-button>
                                    </el-radio-group>
                                    <el-row class="row" style="margin-top: 10px">
                                        <div v-show="!outJSONType">
                                            <template v-for="item in drawMix">
                                                <div class="row" style="font-size: 14px;min-height: 25px;line-height: 25px;margin: 0;padding: 0;background-color: #fff9e6;word-break: break-all" v-html="item">
                                                </div>
                                            </template>
                                        </div>
                                        <outjsonpreview :index="index" :data="item" v-show="outJSONType"></outjsonpreview>
                                    </el-row>
                                </el-row>
                                <table style="width: 100%;border-collapse: collapse" v-if="outInfo.type==1" class="table-hover">
                                    <thead style="color:gray;text-align: center;vertical-align: middle">
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
                        </expand>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </el-row>
    </el-row>
</template>

<style>
    #previewParam .el-tabs__nav-scroll {
        padding-left: 20px;
        padding-right: 20px;
    }
</style>

<script>
    var bodyJSONPreview=require("../../info/interface/component/bodyJSONPreview.vue");
    var outJSONPreview=require("../../info/interface/component/outJSONPreview.vue");
    var expand=require("component/expand.vue")
    module.exports = {
        props:["source"],
        data:function () {
            return {
                bodyJSONType:0,
                outJSONType:0,
                interface:{},
                param:[{
                    query:[{
                        name:"",
                        must:0,
                        remark:""
                    }],
                    header:[{
                        name:"",
                        value:"",
                        remark:""
                    }],
                    body:[{
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                    }],
                    param:[
                    ],
                    bodyInfo:{
                        type:0,
                        rawType:0,
                        rawTextRemark:"",
                        rawFileRemark:"",
                        rawText:"",
                        rawJSON:[{
                            name:"",
                            must:1,
                            type:0,
                            remark:"",
                            show:1,
                            mock:"",
                            drag:1
                        }]
                    },
                    outInfo:{
                        type:0,
                        rawRemark:"",
                        rawMock:"",
                        jsonType:0
                    },
                    result:[],
                    resultObject:[
                        {
                            name:"",
                            must:0,
                            type:0,
                            remark:"",
                            show:0,
                            mock:"",
                            drag:1
                        }
                    ],
                    resultArray:[
                        {
                            name:null,
                            must:0,
                            type:0,
                            remark:"",
                            show:0,
                            mock:"",
                            drag:1
                        }
                    ],
                }],
                arrDraw:[],
                index:0
            }
        } ,
        components:{
            "bodyjsonpreview":bodyJSONPreview,
            "outjsonpreview":outJSONPreview,
            "expand":expand
        },
        computed:{
            tabIndex:{
                get:function () {
                    var val=this.index;
                    if(val===0)
                    {
                        val="0"
                    }
                    return val;
                },
                set:function (val) {
                    this.index=parseInt(val);
                }
            },
            curParam:function () {
                return  this.param[this.index];
            },
            paramSave:function () {
                return this.curParam.param;
            },
            querySave:function () {
                return this.curParam.query.filter(function (obj) {
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
                return this.curParam.header.filter(function (obj) {
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
                return this.curParam.body.filter(function (obj) {
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
            queryCount:function () {
                return this.querySave.length
            },
            headerCount:function () {
                return this.headerSave.length
            },
            bodyCount:function () {
                return this.bodySave.length
            },
            paramCount:function () {
                return this.paramSave.length;
            },
            rawMock:function () {
                var bJSON=false,obj={};
                if(this.curParam.bodyInfo.type==1 && this.curParam.bodyInfo.rawType==2 && this.curParam.bodyInfo.rawJSON)
                {
                    obj=this.curParam.bodyInfo.rawJSONType==0?{}:[];
                    bJSON=true;
                    var result=helper.resultSave(this.curParam.bodyInfo.rawJSON);
                    helper.convertToJSON(result,obj);
                }
                var info=helper.handleMockInfo(0,this.curParam.param,this.curParam.query,this.curParam.header,bJSON?obj:this.curParam.body,this);
                return helper.mock(this.curParam.outInfo.rawMock,info);
            },
            rawJSON:function () {
                var obj=this.curParam.bodyInfo.rawJSONType==0?{}:[];
                var result=helper.resultSave(this.curParam.bodyInfo.rawJSON);
                helper.convertToJSON(result,obj);
                return helper.format(JSON.stringify(obj),1,result,this.status).draw;
            },
            paramTab:function () {
                return "Param ("+this.paramCount+")";
            },
            queryTab:function () {
                return "Query ("+this.queryCount+")";
            },
            headerTab:function () {
                return "Header ("+this.headerCount+")";
            },
            bodyTab:function () {
                return "Body ("+(this.bodyInfo.type==0?this.bodyCount:"Raw")+")";
            },
            bodyInfo:function () {
                return this.curParam.bodyInfo;
            },
            outInfo:function () {
                return this.curParam.outInfo;
            },
            drawMix:function () {
                return this.arrDraw.length>0?this.arrDraw[this.index]:[];
            },
            editInfo:function () {
                return this.interface?(this.interface.createdAt?((this.interface.owner?this.interface.owner.name:"")+"在"+this.interface.createdAt+"创建，最近修改被"+(this.interface.editor?this.interface.editor.name:"")+"在"+this.interface.updatedAt+"改动"):"接口尚未保存"):"";
            },
        },
        methods:{
            showInfo:function (data) {
                this.interface=data;
                var _this=this;
                for(var i=1;i<_this.interface.param.length;i++)
                {
                    _this.param.push($.clone(_this.param[0]));
                }
                _this.interface.param.forEach(function (objInter,index) {
                    _this.param[index].name=objInter.name;
                    _this.param[index].id=objInter.id;
                    _this.param[index].remark=objInter.remark;
                    if(objInter.queryParam && objInter.queryParam.length>0)
                    {
                        _this.param[index].query=objInter.queryParam;
                        _this.param[index].query.forEach(function (item) {
                            if(item.value && typeof(item.value)=="object" && (item.value instanceof Array))
                            {
                                item.value={
                                    type:0,
                                    status:"",
                                    data:item.value.map(function (obj) {
                                        return {
                                            value:obj,
                                            remark:""
                                        }
                                    })
                                }
                            }
                        })
                        _this.param[index].query.push({
                            name:"",
                            must:0,
                            remark:""
                        });
                    }
                    else
                    {
                        objInter.queryParam=_this.param[index].query;
                    }
                    if(objInter.bodyParam && objInter.bodyParam.length>0)
                    {
                        _this.param[index].body=objInter.bodyParam;
                        _this.param[index].body.forEach(function (item) {
                            if(item.value && typeof(item.value)=="object" && (item.value instanceof Array))
                            {
                                item.value={
                                    type:0,
                                    status:"",
                                    data:item.value.map(function (obj) {
                                        return {
                                            value:obj,
                                            remark:""
                                        }
                                    })
                                }
                            }
                        })
                        _this.param[index].body.push({
                            name:"",
                            type:0,
                            must:0,
                            remark:"",
                        });
                    }
                    else
                    {
                        objInter.bodyParam=_this.param[index].body;
                    }
                    if(objInter.header && objInter.header.length>0)
                    {
                        _this.param[index].header=objInter.header;
                        _this.param[index].header.push({
                            name:"",
                            value:"",
                            remark:""
                        });
                    }
                    else
                    {
                        objInter.header=_this.param[index].header;
                    }
                    if(objInter.outParam && objInter.outParam.length>0)
                    {
                        helper.initResultShow(objInter.outParam);
                        _this.param[index].result=objInter.outParam;
                    }
                    else
                    {
                        objInter.outParam=_this.param[index].result;
                    }
                    if(objInter.restParam && objInter.restParam.length>0)
                    {
                        _this.param[index].param=objInter.restParam;
                        _this.param[index].param.forEach(function (item) {
                            if(item.value && typeof(item.value)=="object" && (item.value instanceof Array))
                            {
                                item.value={
                                    type:0,
                                    status:"",
                                    data:item.value.map(function (obj) {
                                        return {
                                            value:obj,
                                            remark:""
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else
                    {
                        objInter.restParam=_this.param[index].param;
                    }
                    if(objInter.bodyInfo)
                    {
                        _this.param[index].bodyInfo=objInter.bodyInfo;
                        if(_this.param[index].bodyInfo.rawText===undefined)
                        {
                            Vue.set(_this.param[index].bodyInfo,"rawText","");
                        }
                        if(_this.param[index].bodyInfo.rawTextRemark===undefined)
                        {
                            Vue.set(_this.param[index].bodyInfo,"rawTextRemark","");
                        }
                        if(_this.param[index].bodyInfo.rawFileRemark===undefined)
                        {
                            Vue.set(_this.param[index].bodyInfo,"rawFileRemark","");
                        }
                        if(_this.param[index].bodyInfo.rawJSONType===undefined)
                        {
                            Vue.set(_this.param[index].bodyInfo,"rawJSONType",0);
                        }
                        if(_this.param[index].bodyInfo.rawJSON==undefined)
                        {
                            Vue.set(_this.param[index].bodyInfo,"rawJSON",_this.param[index].rawJSONObject);
                        }
                        else
                        {
                            helper.initResultShow(_this.param[index].bodyInfo.rawJSON);
                            if(_this.param[index].bodyInfo.rawJSONType==0)
                            {
                                _this.param[index].rawJSONObject=_this.param[index].bodyInfo.rawJSON;
                            }
                            else
                            {
                                _this.param[index].rawJSONArray=_this.param[index].bodyInfo.rawJSON;
                            }
                        }
                        var bFind=false;
                        for(var i=0;i<_this.param[index].header.length;i++)
                        {
                            var obj=_this.param[index].header[i];
                            if(obj.name.toLowerCase()=="content-type" && obj.value.toLowerCase().indexOf("application/json")>-1)
                            {
                                bFind=true;
                                break;
                            }
                        }
                        if(bFind && _this.param[index].bodyInfo.rawText)
                        {
                            var obj;
                            try
                            {
                                obj=JSON.parse(_this.param[index].bodyInfo.rawText);
                            }
                            catch (e)
                            {

                            }
                            if(obj)
                            {
                                var result=[];
                                for(var key in obj)
                                {
                                    helper.handleResultData(key,obj[key],result,null,1,null,1)
                                }
                                _this.param[index].bodyInfo.rawJSON=result;
                                _this.param[index].bodyInfo.rawJSONType=(obj instanceof Array)?1:0;
                                _this.param[index].bodyInfo.rawText="";
                                _this.param[index].bodyInfo.rawType=2;
                            }
                        }
                    }
                    else
                    {
                        objInter.bodyInfo=_this.param[index].bodyInfo;
                    }
                    if(objInter.outInfo)
                    {
                        _this.param[index].outInfo=objInter.outInfo;
                        if(_this.param[index].outInfo.jsonType===undefined)
                        {
                            Vue.set(_this.param[index].outInfo,"jsonType",0);
                        }
                        else if(_this.param[index].outInfo.jsonType==0)
                        {
                            _this.param[index].resultObject=_this.param[index].result;
                        }
                        else
                        {
                            _this.param[index].resultArray=_this.param[index].result;
                        }
                    }
                    else
                    {
                        objInter.outInfo=_this.param[index].outInfo;
                    }
                    if(!objInter.before)
                    {
                        Vue.set(objInter,"before",{
                            mode:0,
                            code:""
                        })
                    }
                    else
                    {
                        if(typeof(objInter.before)=="string")
                        {
                            objInter.before={
                                mode:0,
                                code:objInter.before
                            }
                        }
                    }
                    _this.param[index].before=objInter.before;
                    if(!objInter.after)
                    {
                        Vue.set(objInter,"after",{
                            mode:0,
                            code:""
                        })
                    }
                    else
                    {
                        if(typeof(objInter.after)=="string")
                        {
                            objInter.after={
                                mode:0,
                                code:objInter.after
                            }
                        }
                    }
                    _this.param[index].after=objInter.after;
                    var obj=_this.param[index].outInfo.jsonType==1?[]:{};
                    var result=helper.resultSave(_this.param[index].result);
                    var bJSON=false,objJSON={};
                    if(_this.param[index].bodyInfo.type==1 && _this.param[index].bodyInfo.rawType==2 && _this.param[index].bodyInfo.rawJSON)
                    {
                        objJSON=_this.param[index].bodyInfo.rawJSONType==0?{}:[];
                        bJSON=true;
                        var result1=helper.resultSave(_this.param[index].bodyInfo.rawJSON);
                        helper.convertToJSON(result1,objJSON);
                    }
                    var info=helper.handleMockInfo(0,_this.param[index].param,_this.param[index].query,_this.param[index].header,bJSON?objJSON:_this.param[index].body);
                    helper.convertToJSON(result,obj,info);
                    _this.arrDraw.push(helper.format(JSON.stringify(obj),1,result,this.status).draw);
                })
            },
            methodColor:function (val) {
                return helper.methodColor(val);
            },
        },
        created:function () {
            this.showInfo(this.source);
        }
    }
</script>
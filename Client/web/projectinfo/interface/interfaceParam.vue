<template>
    <el-row class="row">
        <el-tabs type="card" v-model="tabType">
            <el-tab-pane :label="paramTab" v-if="param.length>0" name="param">
                <restparam :index="index" :item="item"></restparam>
            </el-tab-pane>
            <el-tab-pane :label="queryTab" name="query">
                <inparamquery :index="index" :item="item"></inparamquery>
                <el-button size="small" type="primary" style="margin-top: 10px;margin-left: 10px" @click="importQuery">导入Query字符串</el-button>
            </el-tab-pane>
            <el-tab-pane :label="headerTab" name="header">
                <inparamheader :index="index" :item="item"></inparamheader>
                <el-button size="small" type="primary" style="margin-top: 10px;margin-left: 10px" @click="importHeader">导入HTTP Header字符串</el-button>
            </el-tab-pane>
            <el-tab-pane :label="bodyTab" v-if="interfaceEdit.method=='POST' || interfaceEdit.method=='PUT' || interfaceEdit.method=='PATCH'" name="body">
                <inparambody :index="index" :item="item"></inparambody>
                <el-button size="small" type="primary" style="margin-top: 10px;margin-left: 10px" @click="importBody" v-if="bodyInfo.type==0">导入Body字符串</el-button>
            </el-tab-pane>
            <el-tab-pane label="Inject" name="inject">
                <inparaminject :index="index" :item="item"></inparaminject>
            </el-tab-pane>
        </el-tabs>
        <el-row class="row" style="background-color: white;margin-top: 15px;">
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
                    <outparam v-if="outInfo.type==0" :index="index" :data="item"></outparam>
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
            <span style="right: 50px;font-weight: bold;top: 7px;position: absolute"><a href="mockrule.html" style="color: #50a3ff;" target="_blank">mock规则</a></span>
            <el-popover ref="popover2" placement="bottom" title="如何拖动" width="400" trigger="hover" content="Result列表的元素可以拖动，如果要把一个子元素拖动到顶层元素，则拖动到它所属的顶层Object或者Array类型元素上停留2秒，当颜色变为橘黄色的时候，松开即可！">
            </el-popover>
            <span style="left: 80px;font-size: 20px;top: 7px;position: absolute;color: #50bfff" v-popover:popover2><i class="fa fa-question-circle"></i></span>
        </el-row>
    </el-row>
</template>

<script>
    var inParamQuery=require("./inparamQuery.vue")
    var inParamHeader=require("./inparamHeader.vue")
    var inParamBody=require("./inparamBody.vue")
    var outParam=require("./outParam.vue")
    var valueList=require("./valueList.vue")
    var restParam=require("./restParam.vue")
    var rawText=require("./rawText.vue")
    var inParamInject=require("./inparamInject.vue")
    module.exports={
        props:["index","item"],
        data:function () {
            return {
                tabType:"query",
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
            "inparaminject":inParamInject
        },
        watch:{
            "interfaceEdit.method":{
                handler:function (val) {
                    if(val=="POST" || val=="PUT" || val=="PATCH")
                    {
                        this.tabType="body";
                    }
                    else if(val=="GET" || val=="DELETE")
                    {
                        this.tabType="query";
                    }
                },
                immediate:true
            }
        },
        computed:{
            rawJSON:function () {
                return this.item.rawJSON
            },
            interfaceEdit:function () {
                return this.$store.state.interfaceEdit
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
        },
    }
</script>
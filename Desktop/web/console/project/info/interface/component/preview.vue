<template>
    <el-row class="row" id="mainPreview">
        <el-row class="row" style="overflow-y: auto;height: calc(100vh - 253px);padding-bottom: 80px;background-color: white;border-radius: 5px;font-size: 14px;">
            <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;color: #17B9E6">
                {{interfaceEdit.name}}&nbsp;
                <el-button size="mini" type="text" icon="el-icon-document" style="margin-left: 5px;font-size: 15px" title="文档引用" @click="docRef" v-if="interfaceEdit._id"></el-button>
                <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" v-if="interfaceEditRole" @click="$store.dispatch('changeType','edit')">
                    返回
                </el-button>
                <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" v-else @click="$store.dispatch('changeType','run')">
                    运行
                </el-button>
            </el-row>
            <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                Method:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;color: #17b9e6">
                {{interfaceEdit.method}}
            </el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                Path:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;color: #17b9e6">
                {{interfaceEdit.url}}
            </el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                状态:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;">
                {{interfaceEdit.finish==1?"开发完成":(interfaceEdit.finish==2?"已废弃":"开发中")}}
            </el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                描述:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;">
                {{interfaceEdit.remark?interfaceEdit.remark:"无"}}
            </el-row>
            <el-row class="row" style="padding-left: 10px;padding-top: 20px">
                分享:
            </el-row>
            <el-row class="row" style="padding-left: 20px;padding-top: 10px;">
                {{shareUrl}}
            </el-row>
            <el-tabs style="margin-top: 20px" v-model="tabIndex" class="previewParam">
                <template v-for="(item, index) in arrParam">
                    <el-tab-pane :key="item.id"  :label="item.name" :name="index">
                        <expand v-if="param && param.length>0" ref="param">
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
                        <expand v-if="(interfaceEdit.method=='PUT' || interfaceEdit.method=='POST' || interfaceEdit.method=='PATCH') && (bodySave.length>0 || bodyInfo.type==1)" ref="body">
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
                                                {{item.must?"必填":"选填"}}
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
    .previewParam .el-tabs__content {
        padding: 10px 5px 20px 10px;
    }
    .previewParam td{
        border-bottom:1px solid #BBB;
    }
    .previewParam th{
        border-bottom:1px solid #BBB;
    }
    .previewParam .el-tabs__content {
        background-color: white;
    }
</style>

<script>
    var sessionChange=require("common/mixins/session");
    var bodyJSONPreview=require("./bodyJSONPreview.vue");
    var outJSONPreview=require("./outJSONPreview.vue");
    var con=require("common/js/config");
    var expand=require("component/expand.vue")
    module.exports={
        data:function () {
            return {
                bodyJSONType:0,
                outJSONType:0
            }
        },
        mixins:[sessionChange],
        components:{
            "bodyjsonpreview":bodyJSONPreview,
            "outjsonpreview":outJSONPreview,
            "expand":expand
        },
        computed:{
            rawJSON:function () {
                return this.$store.getters.rawJSON;
            },
            interfaceEditRole:function () {
                return this.$store.getters.interfaceEditRole;
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
                    this.$store.dispatch("changeType","preview");
                }
            },
            arrParam:function () {
                return this.$store.state.param;
            },
            drawMix:function () {
                return this.$store.state.drawMix
            },
            rawMock:function () {
                return this.$store.getters.rawMock
            },
            outInfo:function () {
                return this.$store.getters.outInfo
            },
            bodyInfo:function () {
                return this.$store.getters.bodyInfo
            },
            param:function () {
                return this.$store.state.param[this.$store.state.index].param;
            },
            querySave:function () {
                return this.$store.getters.querySave.filter(function (obj) {
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
                return this.$store.getters.headerSave.filter(function (obj) {
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
                return this.$store.getters.bodySave.filter(function (obj) {
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
            interfaceEdit:function () {
                return this.$store.state.interfaceEdit
            },
            shareUrl:function () {
                if(this.interfaceEdit)
                {
                    return session.get("baseUrl")+"/html/controller/share/share.html#"+this.interfaceEdit._id;
                }
                else
                {
                    return ""
                }
            },
        },
        methods:{
            methodColor:function (val) {
                return helper.methodColor(val);
            },
            run:function () {
                var _this=this;
                var obj=$.clone(this.interfaceEdit);
                obj.param=$.clone(this.$store.state.param);
                var child=$.showBox(this,require("../run/run.vue"),{
                    "interfaceEdit":obj
                });
            },
            docRef:function () {
                $.startHud();
                var _this=this;
                net.get("/interface/docref",{
                    id:this.interfaceEdit._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        if(data.data.length==0)
                        {
                            $.tip("该接口没有文档引用",2)
                        }
                        else
                        {
                            $.showBox(_this,require("./docRef.vue"),{
                                arr:data.data,
                                id:_this.interfaceEdit._id
                            })
                        }
                    }
                    else
                    {
                        $.tip(data.msg,0)
                    }
                })
            }
        }
    }
</script>
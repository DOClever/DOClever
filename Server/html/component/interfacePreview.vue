<template>
<el-row class="row" style="padding: 15px 10px 10px 0;background-color: white;font-size: 20px;font-weight: bold;">
    <el-row class="row" style="height: 50px;border-bottom: 1px gray solid">
        <el-col class="col" :span="4">

        </el-col>
        <el-col class="col" :span="16" style="text-align:center;line-height: 50px;color: #20A0FF;font-size: 30px">
            {{interfaceEdit.name}}
        </el-col>
        <el-col class="col" :span="4" style="text-align: center;line-height: 50px">
            <el-button type="primary" style="width: 80%" @click="changePreview(0)">
                返回
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
        {{interfaceEdit.finish==1?"开发完成":(interfaceEdit.finish==2?"已废弃":"开发中")}}
    </el-row>
    <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff">
        描述：
    </el-row>
    <el-row class="row" style="padding:0 30px;">
        {{interfaceEdit.remark?interfaceEdit.remark:"无"}}
    </el-row>
    <el-tabs type="card" style="margin-top: 20px" v-model="tabIndex">
        <template v-for="(item, index) in arrParam">
            <el-tab-pane :key="item.id"  :label="item.name" :name="index">
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
                <el-row class="row" style="padding:0 10px;height: 50px;line-height: 50px;color: #50a3ff" v-if="(interfaceEdit.method=='PUT' || interfaceEdit.method=='POST' || interfaceEdit.method=='PATCH') && (bodySave.length>0 || bodyInfo.type==1)">
                    Body:
                </el-row>
                <el-row class="row" style="padding:0 30px;" v-if="(interfaceEdit.method=='PUT' || interfaceEdit.method=='POST' || interfaceEdit.method=='PATCH') && (bodySave.length>0 || bodyInfo.type==1)">
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
            </el-tab-pane>
        </template>
    </el-tabs>
    <el-row class="row" style="height: 100px"></el-row>
</el-row>
</template>


<script>
    module.exports={
        data:function () {
            return {

            }
        },
        computed:{
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
                    this.$store.commit("changePreview",1);
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
                return this.$store.state.param[this.$store.state.index];
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
        },
        methods:{
            changePreview:function (val) {
                this.$store.commit("setPreview",val);
            },
            methodColor:function (val) {
                return helper.methodColor(val);
            },
        }
    }
</script>
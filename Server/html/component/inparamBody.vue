<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 50px;line-height: 50px">
            <el-radio class="radio" :label="0" v-model="info.type" :checked="info.type==0" id="bodyKey">Key-Value</el-radio>&nbsp;&nbsp;
            <el-radio class="radio" :label="1" v-model="info.type" :checked="info.type==1" id="bodyRaw">Raw</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select v-model="rawType" v-if="info.type==1">
                <el-option value="" label="Text"></el-option>
                <el-option value="file" label="File"></el-option>
                <el-option value="text/plain" label="Text(text/plain)"></el-option>
                <el-option value="application/json" label="JSON"></el-option>
                <el-option value="text/html" label="HTML"></el-option>
                <el-option value="application/xml" label="XML(application/xml)"></el-option>
                <el-option value="text/xml" label="XML(text/xml)"></el-option>
                <el-option value="application/javascript" label="JAVASCRIPT"></el-option>
            </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select v-model="rawJSONType" v-if="info.type==1 && info.rawType==2">
                <el-option :value="0" label="Object"></el-option>
                <el-option :value="1" label="Array"></el-option>
            </el-select>
        </el-row>
        <table width="100%" v-if="info.type==0">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input style="width: 90%" placeholder="请填写参数名称" v-model.trim="item.name" :disabled="true"></el-input>
                    </td>
                    <td style="width: 10%;text-align: center;vertical-align: middle;height: 50px">
                        <el-select v-model="item.type" style="width: 90%">
                            <el-option :value="0" label="文本"></el-option>
                            <el-option :value="1" label="文件"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 10%;" >
                        <span style="display: inline-block;">
                            <el-checkbox v-model="item.must" :true-label="1" :false-label="0" :disabled="true">必选</el-checkbox>
                        </span>
                    </td>
                    <td style="width: 45%">
                        <el-input style="width: 90%;" placeholder="请填写备注" v-model="item.remark" :disabled="true"></el-input>
                    </td>
                    <td style="width: 15%">
                        <el-button type="text" size="small" @click="configValue(item)" v-if="item.type==0" style="font-size: 15px">{{(item.value && (item.value.data.length>0 || item.value.status))?"已填值":"未填值"}}</el-button>
                    </td>
                </tr>
            </template>
        </table>
        <el-row class="row" v-else-if="info.type==1 && info.rawType==2">
            <inparambodyjson :index="index" :data="item"></inparambodyjson>
        </el-row>
        <el-row class="row" style="height: 50px;line-height: 50px" v-else>
            <el-col class="col" :span="20" style="text-align: center">
                <el-input style="width: 90%;" placeholder="请填写备注" v-model="info.rawTextRemark" v-if="info.rawType==0" :disabled="true"></el-input>
                <el-input style="width: 90%;" placeholder="请填写备注" v-model="info.rawFileRemark" v-else :disabled="true"></el-input>
            </el-col>
            <el-col class="col" :span="4" style="text-align: center">
                <el-button type="text" size="small" @click="configRawValue"  v-if="info.rawType==0" style="font-size: 15px">{{info.rawText?"已填值":"未填值"}}</el-button>
            </el-col>
        </el-row>
    </el-row>
</template>
<script>
    var inparamBodyJSON=require("./inparamBodyJSON.vue");
    module.exports={
        props:["index","item"],
        data:function () {
            return {

            }
        },
        components:{
            "inparambodyjson":inparamBodyJSON
        },
        watch:{
            "info.type":function (val) {
                if(val==0)
                {
                    var bFind=false,objIndex,value="application/x-www-form-urlencoded";
                    this.item.header.forEach(function (obj,index) {
                        if(obj.name && obj.name.toLowerCase()=="content-type")
                        {
                            obj.value=value;
                            objIndex=index;
                            bFind=true;
                        }
                    })
                    if(!bFind)
                    {
                        this.item.header.unshift({
                            name:'Content-Type',
                            value:value,
                            remark:''
                        })
                    }
                }
            }
        },
        computed:{
            arr:function () {
                return this.item.body
            },
            info:function () {
                return this.item.bodyInfo
            },
            rawJSONType:{
                get:function () {
                    return this.info.rawJSONType
                },
                set:function (val) {
                    this.info.rawJSONType=val;
                    if(val)
                    {
                        this.info.rawJSON=this.item.rawJSONArray;
                    }
                    else
                    {
                        this.info.rawJSON=this.item.rawJSONObject;
                    }
                }
            },
            rawType:{
                get:function () {
                    var type="";
                    this.item.header.forEach(function (obj) {
                        if(obj.name.toLowerCase()=="content-type")
                        {
                            var value=obj.value.toLowerCase();
                            var arr=["text/plain","application/json","text/html","application/xml","text/xml","application/javascript"];
                            var index=arr.indexOf(value);
                            if(index>-1)
                            {
                                type=arr[index];
                            }
                        }
                    })
                    if(type=="" && this.info.rawType==1)
                    {
                        type="file"
                    }
                    else if(type=="application/json")
                    {
                        this.info.rawType=2
                    }
                    else
                    {
                        this.info.rawType=0;
                    }
                    return type;
                },
                set:function (value) {
                    if(value=="application/json")
                    {
                        this.info.rawType=2;
                        var bFind=false,objIndex;
                        this.item.header.forEach(function (obj,index) {
                            if(obj.name && obj.name.toLowerCase()=="content-type")
                            {
                                obj.value=value;
                                objIndex=index;
                                bFind=true;
                            }
                        })
                        if(!bFind)
                        {
                            this.item.header.unshift({
                                name:'Content-Type',
                                value:value,
                                remark:''
                            })
                        }
                    }
                    else
                    {
                        if(value=="file")
                        {
                            this.info.rawType=1;
                        }
                        else
                        {
                            this.info.rawType=0;
                        }
                        var bFind=false,objIndex;
                        this.item.header.forEach(function (obj,index) {
                            if(obj.name && obj.name.toLowerCase()=="content-type")
                            {
                                obj.value=value;
                                objIndex=index;
                                bFind=true;
                            }
                        })
                        if(value=="" || value=="file")
                        {
                            if(bFind)
                            {
                                if(this.item.header.length>1)
                                {
                                    this.item.header.splice(objIndex,1);
                                }
                                else
                                {
                                    this.item.header[0].name="";
                                    this.item.header[0].value="";
                                    this.item.header[0].remark="";
                                }
                            }
                        }
                        else
                        {
                            if(!bFind)
                            {
                                this.item.header.unshift({
                                    name:'Content-Type',
                                    value:value,
                                    remark:''
                                })
                            }
                        }
                    }
                }
            }
        },
        methods:{
            remove:function (index) {
                this.arr.splice(index,1)
            },
            configValue:function (item) {
                if(!item.value)
                {
                    Vue.set(item,"value",{
                        type: 0,
                        data: [],
                        status: ""
                    });
                }
                var child=$.showBox(this.$parent,require("./valueList.vue"),{
                    "source":item.value
                });
                child.$on("save",function (value) {
                    item.value=value;
                });
            },
            configRawValue:function () {
                if(this.info.rawText===undefined)
                {
                    Vue.set(this.info,"rawText","");
                }
                var child=$.showBox(this.$parent,require("./rawText.vue"),{
                    "source":this.info.rawText
                });
                var _this=this;
                child.$on("save",function (value) {
                    _this.info.rawText=value;
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
                    var result=[];
                    for(var key in obj)
                    {
                        helper.handleResultData(key,obj[key],result,null,1,1,1)
                    }
                    _this.info.rawJSON=result;
                    _this.info.rawJSONType=(obj instanceof Array)?1:0;
                    return true;
                });
            }
        }
    }
</script>

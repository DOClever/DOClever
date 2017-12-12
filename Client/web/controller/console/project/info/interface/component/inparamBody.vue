<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 50px;line-height: 50px;white-space: nowrap">
            <el-radio class="radio" :label="0" v-model="info.type" :checked="info.type==0" id="bodyKey">Key-Value</el-radio>&nbsp;&nbsp;
            <el-radio class="radio" :label="1" v-model="info.type" :checked="info.type==1" id="bodyRaw">Raw</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select size="small" v-model="rawType" v-if="info.type==1" style="width: 180px">
                <el-option value="" label="Text"></el-option>
                <el-option value="file" label="File"></el-option>
                <el-option value="text/plain" label="Text(text/plain)"></el-option>
                <el-option value="application/json" label="JSON"></el-option>
                <el-option value="text/html" label="HTML"></el-option>
                <el-option value="application/xml" label="XML(application/xml)"></el-option>
                <el-option value="text/xml" label="XML(text/xml)"></el-option>
                <el-option value="application/javascript" label="JAVASCRIPT"></el-option>
            </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select size="small" v-model="rawJSONType" v-if="info.type==1 && info.rawType==2" style="width: 100px">
                <el-option :value="0" label="Object"></el-option>
                <el-option :value="1" label="Array"></el-option>
            </el-select>
        </el-row>
        <table width="100%" v-if="info.type==0">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input size="small" style="width: 90%" placeholder="请填写参数名称" v-model.trim="item.name" @input="index==arr.length-1?arr.push({name:'',type:0,must:0,remark:''}):''"></el-input>
                    </td>
                    <td style="width: 15%;text-align: center;vertical-align: middle;height: 50px">
                        <el-select size="small" v-model="item.type" style="width: 90%">
                            <el-option :value="0" label="文本"></el-option>
                            <el-option :value="1" label="文件"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 10%;" >
                        <span style="display: inline-block;">
                            <el-checkbox v-model="item.must" :true-label="1" :false-label="0">必选</el-checkbox>
                        </span>
                    </td>
                    <td style="width: 45%">
                        <el-input size="small" style="width: 90%;" placeholder="请填写备注" v-model="item.remark"></el-input>
                    </td>
                    <td style="width: 5%">
                        <el-popover trigger="hover" placement="bottom" width="200" :disabled="!(item.value &&  (item.value.data.length>0 || item.value.status))" v-if="item.type==0">
                            <div style="width: 200px;overflow: auto;text-align: center" v-if="item.value && (item.value.data.length>0 || item.value.status)">
                                <template v-if="item.value.data.length>0">
                                    <table width="100%" class="table-hover" style="border-collapse: collapse">
                                        <template v-for="item1 in item.value.data">
                                            <tr style="text-align: center;vertical-align: middle;">
                                                <td style="width: 40%;border-bottom: 1px solid #e6ebf5">
                                                    {{item1.value}}
                                                </td>
                                                <td style="width: 60%;border-bottom: 1px solid #e6ebf5">
                                                    {{item1.remark?item1.remark:"无备注"}}
                                                </td>
                                            </tr>
                                        </template>
                                    </table>
                                </template>
                                <template v-else>
                                    绑定了状态码：{{validStatus(item.value.status)}}
                                </template>
                            </div>
                            <el-button slot="reference" type="text" size="mini" @click="configValue(item)" style="font-size: 13px">{{(item.value && (item.value.data.length>0 || item.value.status))?"已填值":"未填值"}}</el-button>
                        </el-popover>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" style="color: red;font-size: 15px" size="mini" icon="el-icon-close" @click="remove(index)" v-if="index!=arr.length-1"></el-button>
                    </td>
                </tr>
            </template>
        </table>
        <el-row class="row" v-else-if="info.type==1 && info.rawType==2">
            <inparambodyjson :index="index" :data="item"></inparambodyjson>
            <el-button type="primary" size="mini" style="margin-top: 5px;margin-left: 20px" @click="importJSON">导入JSON</el-button>
        </el-row>
        <el-row class="row" style="height: 50px;line-height: 50px" v-else>
            <el-col class="col" :span="20" style="text-align: center">
                <el-input size="small" style="width: 90%;" placeholder="请填写备注" v-model="info.rawTextRemark" v-if="info.rawType==0"></el-input>
                <el-input size="small" style="width: 90%;" placeholder="请填写备注" v-model="info.rawFileRemark" v-else></el-input>
            </el-col>
            <el-col class="col" :span="4" style="text-align: center">
                <el-button type="text" size="mini" @click="configRawValue"  v-if="info.rawType==0" style="font-size: 13px">{{info.rawText?"已填值":"未填值"}}</el-button>
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
                            var index=arr.indexOf(value.split(";")[0]);
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
                    else if(type.indexOf("application/json")>-1)
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
                    if(value.indexOf("application/json")>-1)
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
            },
            validStatus:function (status) {
                var name="";
                this.$store.getters.status.forEach(function (obj) {
                    if(obj.id==status)
                    {
                        name=obj.name;
                    }
                })
                return name;
            }
        }
    }
</script>

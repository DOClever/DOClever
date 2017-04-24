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
            </el-select>
        </el-row>
        <table width="100%" v-if="info.type==0">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input style="width: 90%" placeholder="请填写参数名称" v-model="item.name"></el-input>
                    </td>
                    <td style="width: 10%;text-align: center;vertical-align: middle;height: 50px">
                        <el-select v-model="item.type" style="width: 90%">
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
                        <el-input style="width: 90%;" placeholder="请填写备注" v-model="item.remark"></el-input>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="small" @click="configValue(item)" v-if="item.type==0" style="font-size: 15px">{{(item.value && (item.value.data.length>0 || item.value.status))?"已填值":"未填值"}}</el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" style="color: red;font-size: 15px" size="small" icon="close" @click="remove(index)"></el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="small" v-if="index==arr.length-1" icon="plus" @click="arr.push({name:'',type:0,must:0,remark:''})" style="font-size: 15px"></el-button>
                    </td>
                </tr>
            </template>
        </table>
        <el-row class="row" v-else-if="info.type==1 && info.rawType==2">
            <inparambodyjson></inparambodyjson>
            <el-button type="primary" size="small" style="margin-top: 10px;margin-left: 20px" @click="importJSON">导入JSON</el-button>
        </el-row>
        <el-row class="row" style="height: 50px;line-height: 50px" v-else>
            <el-col class="col" :span="20" style="text-align: center">
                <el-input style="width: 90%;" placeholder="请填写备注" v-model="info.rawTextRemark" v-if="info.rawType==0"></el-input>
                <el-input style="width: 90%;" placeholder="请填写备注" v-model="info.rawFileRemark" v-else></el-input>
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
                    this.$store.state.header.forEach(function (obj,index) {
                        if(obj.name && obj.name.toLowerCase()=="content-type")
                        {
                            obj.value=value;
                            objIndex=index;
                            bFind=true;
                        }
                    })
                    if(!bFind)
                    {
                        this.$store.state.header.push({
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
                return this.$store.state.body
            },
            info:function () {
                return this.$store.state.bodyInfo
            },
            rawType:{
                get:function () {
                    var type="";
                    this.$store.getters.headerSave.forEach(function (obj) {
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
                    if(value=="file")
                    {
                        this.info.rawType=1;
                    }
                    else if(value=="application/json")
                    {
                        this.info.rawType=2;
                        var bFind=false,objIndex;
                        this.$store.state.header.forEach(function (obj,index) {
                            if(obj.name && obj.name.toLowerCase()=="content-type")
                            {
                                obj.value=value;
                                objIndex=index;
                                bFind=true;
                            }
                        })
                        if(!bFind)
                        {
                            this.$store.state.header.push({
                                name:'Content-Type',
                                value:value,
                                remark:''
                            })
                        }
                    }
                    else
                    {
                        this.info.rawType=0;
                        var bFind=false,objIndex;
                        this.$store.state.header.forEach(function (obj,index) {
                            if(obj.name && obj.name.toLowerCase()=="content-type")
                            {
                                obj.value=value;
                                objIndex=index;
                                bFind=true;
                            }
                        })
                        if(value=="")
                        {
                            if(bFind)
                            {
                                if(this.$store.state.header.length>1)
                                {
                                    this.$store.state.header.splice(objIndex,1);
                                }
                                else
                                {
                                    this.$store.state.header[0].name="";
                                    this.$store.state.header[0].value="";
                                    this.$store.state.header[0].remark="";
                                }
                            }
                        }
                        else
                        {
                            if(!bFind)
                            {
                                this.$store.state.header.push({
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
                if(this.arr.length>1)
                {
                    this.arr.splice(index,1)
                }
                else
                {
                    this.arr[0].name="";
                    this.arr[0].must=0;
                    this.arr[0].type=0;
                    this.arr[0].remark="";
                    if(this.arr[0].value)
                    {
                        this.arr[0].value={
                            type:0,
                            data:[],
                            status:""
                        };
                    }
                }
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
                var child=$.showBox(this.$parent,"valueList",{
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
                var child=$.showBox(this.$parent,"rawText",{
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
                        helper.handleResultData(key,obj[key],result,null,1)
                    }
                    _this.info.rawJSON=result;
                    return true;
                });
            }
        }
    }
</script>

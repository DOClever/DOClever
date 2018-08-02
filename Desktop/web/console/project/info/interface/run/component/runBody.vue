<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 50px;line-height: 50px;white-space: nowrap">
            <el-radio class="radio" :label="0" v-model="info.type" id="bodyKey">
                Key-Value
            </el-radio>
            <el-radio class="radio" :label="1" v-model="info.type" id="bodyRaw">
                Raw
            </el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
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
        <table width="100%" id="bodyTable" v-show="info.type==0">
            <template v-for="(item,index) in arr">
                <tr :style="{textAlign: 'center',verticalAlign: 'middle',backgroundColor:item.enable?'white':'lightgray'}">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input size="small" style="width: 90%;" placeholder="请填写参数名称" v-model.trim="item.name" :disabled="!item.enable" @input="index==arr.length-1?add():''"></el-input>
                    </td>
                    <td style="width: 15%;text-align: center;vertical-align: middle;height: 50px">
                        <el-select size="small" v-model="item.type" style="width: 90%">
                            <el-option :value="0" label="文本"></el-option>
                            <el-option :value="1" label="文件"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px;line-height: 50px;overflow: auto">
                        <div  style="width: 90%;display: inline-block;" v-if="item.type==0 && item.value && (item.value.data.length>0 || item.value.status)">
                            <el-autocomplete size="small" class="inline-input" v-model="item.selValue" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值" @mouseenter.native="focus(item)" :disabled="!item.enable" custom style="width:100%" popper-class="my-autocomplete">
                                <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete" style="cursor: pointer"></i>
                                <template slot-scope="props">
                                    <div class="value">{{ props.item.value }}</div>
                                    <span class="remark">{{ props.item.remark }}</span>
                                </template>
                            </el-autocomplete>
                        </div>
                        <el-input size="small" style="width: 90%;" placeholder="请填写值" v-model="item.selValue" v-else-if="item.type==0" custom></el-input>
                        <a  href="javascript:void(0)" class="file" style="display: inline-block;top: 10px;font-size: 13px;" v-else>
                            <span>选择文件</span><input type="file" onchange="this.previousSibling.innerText=this.files[0].name" custom>
                        </a>
                    </td>
                    <td style="width: 5%;" >
                        <span style="display: inline-block;">
                            {{item.must?"必选":"可选"}}
                        </span>
                    </td>
                    <td style="width: 20%;height: 50px;overflow-y: auto;line-height: normal;">
                        {{item.remark?item.remark:"无备注"}}
                    </td>
                    <td style="width: 10%;height: 50px;">
                        <el-button type="text" size="mini"  style="font-size: 13px" @click="encrypt(item)" v-if="item.type==0">{{(item.encrypt && item.encrypt.type)?item.encrypt.type:"未加密"}}</el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="mini" style="font-size: 15px;" @click="toggleEnable(item,index)"><span :class="item.enable?'fa fa-eye-slash':'fa fa-eye'" :title="item.enable?'发送时不包含此字段':'发送时包含此字段'"></span></el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="mini" icon="el-icon-close" style="color: red;font-size: 15px;" @click="remove(index)" v-if="index!=arr.length-1"></el-button>
                    </td>
                </tr>
            </template>
        </table>
        <el-row class="row" style="padding: 0 0 0 20px;" v-show="info.type==1 && info.rawType==2">
            <runbodyjson :index="index" :data="item" v-if="editType==0"></runbodyjson>
            <el-input type="textarea" :rows="6" v-model="rawStr" v-else></el-input>
            <el-button type="primary" size="mini" style="margin-top: 10px;margin-left: 20px" @click="editJSON">{{editType==0?"Edit JSON":"Commit JSON"}}</el-button>
            <el-button type="primary" size="mini" style="margin-top: 10px;margin-left: 20px" @click="editType=0" v-if="editType==1">Cancel Edit</el-button>
        </el-row>
        <el-row class="row" style="padding: 0 0 0 20px;" v-show="info.type==1 && info.rawType!=2">
            <el-row class="row" style="height: 50px;line-height: 50px;margin: 0;padding: 0" v-if="info.rawType==0">
                <el-col class="col" :span="3" style="text-align: center" v-if="info.rawType==0">
                    加密类型
                </el-col>
                <el-col class="col" :span="5" style="text-align: center">
                    <el-select size="small" id="bodyRawEncryptType" v-model="encryptType" v-if="info.rawType==0">
                        <el-option value="" label="无"></el-option>
                        <el-option value="Base64"></el-option>
                        <el-option value="MD5"></el-option>
                        <el-option value="SHA-1"></el-option>
                        <el-option value="SHA-256"></el-option>
                        <el-option value="SHA-512"></el-option>
                        <el-option value="SHA-3"></el-option>
                        <el-option value="RIPEMD-160"></el-option>
                        <el-option value="AES"></el-option>
                        <el-option value="DES"></el-option>
                        <el-option value="TripleDES"></el-option>
                        <el-option value="Rabbit"></el-option>
                        <el-option value="RC4"></el-option>
                        <el-option value="RC4Drop"></el-option>
                    </el-select>
                </el-col>
                <el-col class="col" :span="3" style="text-align: center" v-show="info.rawType==0 && saltShow">
                    Salt
                </el-col>
                <el-col class="col" :span="5" style="text-align: center" v-show="info.rawType==0 && saltShow">
                    <el-input size="small" placeholder="请填入salt的值" id="bodyRawEncryptSalt" v-model="salt"></el-input>
                </el-col>
            </el-row>
            <el-row class="row" style="margin-top: 10px">
                <el-input size="small" type="textarea" :rows="3" style="width: 100%;height: 200px;" v-if="info.rawType==0"  id="bodyText" v-model="info.rawText" :placeholder="info.rawTextRemark?info.rawTextRemark:'请填入Raw内容'">
                </el-input>
                <a  href="javascript:void(0)" class="file" style="display: inline-block;font-size: 13px" v-else>
                    <span>选择文件</span><input type="file"  id="bodyFile" @change="change" custom>
                </a>
            </el-row>
        </el-row>
    </el-row>
</template>
<script>
    var runBodyJSON=require("./runBodyJSON.vue");
    module.exports={
        props:["index","item"],
        data:function () {
            return {
                salt:"",
                itemSel:null,
                editType:0,
                rawStr:""
            }
        },
        components:{
            "runbodyjson":runBodyJSON
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
            saltShow:function () {
                return helper.isSalt(this.encryptType);
            },
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
            encryptType:{
                get:function () {
                    return this.item.encryptType;
                },
                set:function (val) {
                    this.item.encryptType=val;
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
            add:function () {
                this.arr.push({
                    name:'',
                    type:0,
                    must:0,
                    remark:'',
                    selValue:"",
                    enable:1
                })
            },
            toggleEnable:function (item,index) {
                item.enable=Number(!item.enable);
            },
            change:function () {
                var ele=document.getElementById("bodyFile");
                var file=ele.files[0];
                if(file.size>2*1024*1024)
                {
                    $.tip("不支持大于2M的文件",0);
                    ele.previousSibling.innerText="选择文件";
                    ele.setAttribute("value","");
                    return;
                }
                var _this=this;
                var read=new FileReader();
                var loading;
                read.onloadstart=function () {
                    loading=_this.$loading({fullscreen:true});
                }
                read.onload=function () {
                    loading.close();
                    ele.previousSibling.innerText=file.name
                    _this.item.fileResult=read.result;
                }
                read.onerror=function () {
                    loading.close();
                    $.tip("读取错误",0);
                }
                read.readAsArrayBuffer(file);
            },
            encrypt:function (item) {
                if(!item.encrypt)
                {
                    var obj={
                        type:"",
                        salt:"",
                        key:0
                    }
                    Vue.set(item,"encrypt",obj);
                }
                $.showBox(this.$parent,require("component/encrypt.vue"),{
                    "source":item.encrypt
                });
            },
            querySearch:function (queryString,cb) {
                var results=[];
                if(this.itemSel.value.type==0)
                {
                    results=this.itemSel.value.data.map(function (obj) {
                        return {
                            value:obj.value,
                            remark:obj.remark
                        }
                    })
                }
                else
                {
                    if(this.itemSel.value.status)
                    {
                        var objStatus=null;
                        var _this=this;
                        this.$store.getters.status.forEach(function (obj) {
                            if(obj.id==_this.itemSel.value.status)
                            {
                                objStatus=obj;
                            }
                        })
                        if(objStatus)
                        {
                            results=objStatus.data.map(function (obj) {
                                return {
                                    value:obj.key,
                                    remark:obj.remark
                                }
                            })
                        }
                    }
                }
                if(queryString)
                {
                    results=results.filter(function (obj) {
                        return obj.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
                    })
                }
                cb(results);
            },
            focus:function (item) {
                this.itemSel=item;

            },
            showAutoComplete:function (event) {
                this.itemSel.selValue="";
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
            },
            editJSON:function () {
                var _this=this;
                if(this.editType==0)
                {
                    this.editType=1;
                    var obj=this.item.bodyInfo.rawJSONType==0?{}:[];
                    var result=helper.resultSave(this.item.bodyInfo.rawJSON);
                    helper.convertToJSON(result,obj,null,1);
                    this.rawStr=helper.formatJson(obj);
                }
                else
                {
                    if(!this.rawStr)
                    {
                        $.tip("请输入JSON",0);
                        return false
                    }
                    var obj;
                    try
                    {
                        obj=JSON.parse(this.rawStr)
                    }
                    catch (err)
                    {
                        $.tip("JSON不符合格式",0);
                        return false
                    }
                    this.editType=0;
                    var result=[];
                    for(var key in obj)
                    {
                        helper.handleResultData(key,obj[key],result,this.item.bodyInfo.rawJSON,1,0,1)
                    }
                    _this.info.rawJSON=result;
                    _this.info.rawJSONType=(obj instanceof Array)?1:0;
                }
            }
        }
    }
</script>

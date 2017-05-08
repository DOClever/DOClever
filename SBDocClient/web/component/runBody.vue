<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 50px;line-height: 50px">
            <el-radio class="radio" :label="0" v-model="info.type" id="bodyKey">
                Key-Value
            </el-radio>
            <el-radio class="radio" :label="1" v-model="info.type" id="bodyRaw">
                Raw
            </el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
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
        <table width="100%" id="bodyTable" v-show="info.type==0">
            <template v-for="(item,index) in arr">
                <tr :style="{textAlign: 'center',verticalAlign: 'middle',backgroundColor:item.enable?'white':'lightgray'}">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input style="width: 90%;" placeholder="请填写参数名称" v-model="item.name" :disabled="!item.enable"></el-input>
                    </td>
                    <td style="width: 10%;text-align: center;vertical-align: middle;height: 50px">
                        <el-select v-model="item.type" style="width: 90%">
                            <el-option :value="0" label="文本"></el-option>
                            <el-option :value="1" label="文件"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px;line-height: 50px">
                        <div  style="height: 100%;width: 90%;display: inline-block;" v-if="item.type==0 && item.value && (item.value.data.length>0 || item.value.status)">
                            <el-autocomplete class="inline-input" v-model="item.selValue" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值" icon="caret-bottom" :on-icon-click="showAutoComplete" @mouseenter.native="focus(item)" :disabled="!item.enable" custom style="width:100%" popper-class="my-autocomplete" custom-item="itemauto"></el-autocomplete>
                        </div>
                        <el-input style="width: 90%;" placeholder="请填写值" v-model="item.selValue" v-else-if="item.type==0" custom></el-input>
                        <a  href="javascript:void(0)" class="file" style="display: inline-block;top: 10px" v-else>
                            <span>选择文件</span><input type="file" onchange="this.previousSibling.innerText=this.files[0].name" custom>
                        </a>
                    </td>
                    <td style="width: 5%;" >
                        <span style="display: inline-block;">
                            {{item.must?"必选":"可选"}}
                        </span>
                    </td>
                    <td style="width: 20%;height: 50px;overflow-y: auto">
                        {{item.remark?item.remark:"无备注"}}
                    </td>
                    <td style="width: 10%;height: 50px;">
                        <el-button type="text" size="small"  style="font-size: 15px" @click="encrypt(item)" v-if="item.type==0">{{(item.encrypt && item.encrypt.type)?item.encrypt.type:"未加密"}}</el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="small" style="font-size: 15px;" @click="toggleEnable(item,index)"><span :class="item.enable?'fa fa-eye-slash':'fa fa-eye'" :title="item.enable?'发送时不包含此字段':'发送时包含此字段'"></span></el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="small" icon="close" style="color: red;font-size: 15px;" @click="remove(index)"></el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="small" icon="plus" style="font-size: 15px" v-if="index==arr.length-1" @click="add"></el-button>
                    </td>
                </tr>
            </template>
        </table>
        <el-row class="row" style="padding: 0 0 0 20px;" v-show="info.type==1 && info.rawType==2">
            <runbodyjson></runbodyjson>
            <el-button type="primary" size="small" style="margin-top: 10px;margin-left: 20px" @click="importJSON">导入JSON</el-button>
        </el-row>
        <el-row class="row" style="padding: 0 0 0 20px;" v-show="info.type==1 && info.rawType!=2">
            <el-row class="row" style="height: 50px;line-height: 50px;margin: 0;padding: 0" v-if="info.rawType==0">
                <el-col class="col" :span="3" style="text-align: center" v-if="info.rawType==0">
                    加密类型
                </el-col>
                <el-col class="col" :span="5" style="text-align: center">
                    <el-select id="bodyRawEncryptType" v-model="encryptType" v-if="info.rawType==0">
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
                    <el-input placeholder="请填入salt的值" id="bodyRawEncryptSalt" v-model="salt"></el-input>
                </el-col>
            </el-row>
            <el-row class="row" style="margin-top: 10px">
                <el-input type="textarea" :rows="6" style="width: 100%;height: 200px;" v-if="info.rawType==0"  id="bodyText" v-model="info.rawText" :placeholder="info.rawTextRemark?info.rawTextRemark:'请填入Raw内容'">
                </el-input>
                <a  href="javascript:void(0)" class="file" style="display: inline-block;" v-else>
                    <span>选择文件</span><input type="file"  id="bodyFile" @change="change" custom>
                </a>
            </el-row>
        </el-row>
    </el-row>
</template>
<script>
    var runBodyJSON=require("./runBodyJSON.vue");
    module.exports={
        data:function () {
            return {
                salt:"",
                itemSel:null,
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
            saltShow:function () {
                return helper.isSalt(this.encryptType);
            },
            arr:function () {
                return this.$store.state.body
            },
            info:function () {
                return this.$store.state.bodyInfo
            },
            encryptType:{
                get:function () {
                    return this.$store.state.encryptType;
                },
                set:function (val) {
                    this.$store.commit("setEncryptType",val)
                }
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
                    this.arr[0].value={
                        type: 0,
                        data: [],
                        status: ""
                    };
                    this.arr[0].selValue="";
                }
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
                    _this.$store.commit("setFileResult",read.result);
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
                $.showBox(this.$parent,"encrypt",{
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
                        this.$store.state.arrStatus.forEach(function (obj) {
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
                    event.target.nextSibling.focus();
                },100)
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
                },0);
            }
        }
    }
</script>

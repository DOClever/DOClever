<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 50px;line-height: 50px">
            <el-radio class="radio" :label="0" v-model="info.type" id="bodyKey" :disabled="true">
                Key-Value
            </el-radio>
            <el-radio class="radio" :label="1" v-model="info.type" id="bodyRaw" :disabled="true">
                Raw
            </el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select size="small" v-model="rawType" v-if="info.type==1" :disabled="true">
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
                        <el-input size="small" style="width: 90%;" placeholder="请填写参数名称" v-model="item.name" :disabled="true"></el-input>
                    </td>
                    <td style="width: 10%;text-align: center;vertical-align: middle;height: 50px">
                        <el-select size="small" v-model="item.type" style="width: 90%" :disabled="true">
                            <el-option :value="0" label="文本"></el-option>
                            <el-option :value="1" label="文件"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px;line-height: 50px">
                        <div  style="width: 90%;display: inline-block;" v-if="item.type==0 && item.value && (item.value.data.length>0 || item.value.status)">
                            <el-autocomplete size="small" class="inline-input" v-model="item.selValue" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值" @mouseenter.native="focus(item)" :disabled="!item.enable || interface.example" custom style="width:100%" popper-class="my-autocomplete">
                                <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete" style="cursor: pointer"></i>
                                <template slot-scope="props">
                                    <div class="value">{{ props.item.value }}</div>
                                    <span class="remark">{{ props.item.remark }}</span>
                                </template>
                            </el-autocomplete>
                        </div>
                        <el-input size="small" style="width: 90%;" placeholder="请填写值" v-model="item.selValue" v-else-if="item.type==0" custom :disabled="!item.enable || interface.example"></el-input>
                    </td>
                    <td style="width: 5%;" >
                        <span style="display: inline-block;">
                            {{item.must?"必选":"可选"}}
                        </span>
                    </td>
                    <td style="width: 20%;height: 50px;line-height: normal;overflow-y: auto">
                        {{item.remark?item.remark:"无备注"}}
                    </td>
                    <td style="width: 10%;height: 50px;">
                        <el-button type="text" size="mini"  style="font-size: 13px" @click="encrypt(item)" v-if="item.type==0" :disabled="interface.example">{{(item.encrypt && item.encrypt.type)?item.encrypt.type:"未加密"}}</el-button>
                    </td>
                    <td style="width: 15%">
                        <el-button type="text" size="mini" style="font-size: 15px;" @click="toggleEnable(item,index)" :disabled="interface.example"><span :class="item.enable?'fa fa-eye-slash':'fa fa-eye'" :title="item.enable?'发送时不包含此字段':'发送时包含此字段'"></span></el-button>
                    </td>
                </tr>
            </template>
        </table>
        <el-row class="row" style="padding: 0 0 0 20px;" v-show="info.type==1 && info.rawType==2">
            <testbodyjson :source="info.rawJSON" :status="status"></testbodyjson>
        </el-row>
        <el-row class="row" style="padding: 0 0 0 20px;" v-show="info.type==1 && info.rawType!=2">
            <el-row class="row" style="height: 50px;line-height: 50px;margin: 0;padding: 0" v-if="info.rawType==0">
                <el-col class="col" :span="3" style="text-align: center" v-if="info.rawType==0">
                    加密类型
                </el-col>
                <el-col class="col" :span="5" style="text-align: center">
                    <el-select size="small" id="bodyRawEncryptType" v-model="interface.encrypt.type" v-if="info.rawType==0">
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
                    <el-input size="small" placeholder="请填入salt的值" id="bodyRawEncryptSalt" v-model="interface.encrypt.salt"></el-input>
                </el-col>
            </el-row>
            <el-row class="row" style="margin-top: 10px">
                <el-input size="small" type="textarea" :rows="6" style="width: 100%;height: 200px;" v-if="info.rawType==0"  id="bodyText" v-model="info.rawText" :placeholder="info.rawTextRemark?info.rawTextRemark:'请填入Raw内容'">
                </el-input>
            </el-row>
        </el-row>
    </el-row>
</template>
<script>
    var testBodyJSON=require("./testBodyJSON.vue");
    module.exports={
        props:["interface","status"],
        data:function () {
            return {
                itemSel:null,
            }
        },
        components:{
            "testbodyjson":testBodyJSON
        },
        computed:{
            saltShow:function () {
                return helper.isSalt(this.interface.encrypt.type);
            },
            arr:function () {
                return this.interface.bodyParam
            },
            info:function () {
                return this.interface.bodyInfo
            },
            rawType:{
                get:function () {
                    var type="";
                    this.interface.header.forEach(function (obj) {
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
            }
        },
        methods:{
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
                        this.status.forEach(function (obj) {
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
            toggleEnable:function (item,index) {
                item.enable=Number(!item.enable);
            },
            showAutoComplete:function (event) {
                this.itemSel.selValue="";
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
            },
        }
    }
</script>

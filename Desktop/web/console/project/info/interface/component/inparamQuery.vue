<template>
    <el-row class="row interfaceTabParam">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle" :style="{backgroundColor:item.enable?'white':'lightgray'}">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input size="small" style="width: 90%" placeholder="请填写参数名称" v-model.trim="item.name" @input="index==arr.length-1?arr.push({name:'',type:0,must:0,remark:'',enable:1}):''" :disabled="!item.enable"></el-input>
                    </td>
                    <td style="width: 10%;" >
                        <el-checkbox v-model="item.must" :true-label="1" :false-label="0">必选</el-checkbox>
                    </td>
                    <td style="width: 25%">
                        <el-tooltip class="item" effect="dark" :content="item.remark" placement="bottom" :disabled="!item.remark">
                            <el-input size="small" style="width: 90%" placeholder="请填写备注" v-model="item.remark" :disabled="!item.enable">
                                <i slot="suffix" class="el-input__icon el-icon-edit" @click="editRemark(item)" style="cursor: pointer"></i>
                            </el-input>
                        </el-tooltip>
                    </td>
                    <td style="width: 20%">
                        <div  style="width: 90%;display: inline-block;" v-if="item.value && ((item.value.data && item.value.data.length>0) || item.value.status)">
                            <el-autocomplete size="small" class="inline-input" v-model="item.selValue" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值" @mouseenter.native="focus(item)" :disabled="!item.enable" style="width:100%" popper-class="my-autocomplete">
                                <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete" style="cursor: pointer"></i>
                                <template slot-scope="props">
                                    <div class="value">{{ props.item.value }}</div>
                                    <span class="remark">{{ props.item.remark }}</span>
                                </template>
                                <i class="el-icon-edit el-input__icon" slot="prefix" @click="configValue(item)" style="cursor: pointer"></i>
                            </el-autocomplete>
                        </div>
                        <el-input size="small" v-else style="width: 90%" v-model="item.selValue" :disabled="!item.enable">
                            <i class="el-icon-edit el-input__icon" slot="suffix" @click="configValue(item)" style="cursor: pointer"></i>
                        </el-input>
                    </td>
                    <td style="width: 10%;">
                        <el-button type="text" size="mini"  style="font-size: 13px" @click="encrypt(item)">{{(item.encrypt && item.encrypt.type)?item.encrypt.type:"未加密"}}</el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button size="mini" type="text" style="font-size: 15px;" @click="toggleEnable(item,index)"><span :class="item.enable?'fa fa-eye-slash':'fa fa-eye'" :title="item.enable?'发送时不包含此字段':'发送时包含此字段'"></span></el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button size="mini" type="text" style="color: red;font-size: 15px" @click="remove(index)" icon="el-icon-close" v-if="index!=arr.length-1"></el-button>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>
<script>
    var valueList=require("./valueList.vue")
    module.exports={
        props:["index","item"],
        data:function () {
            return {
                itemSel:null,
            }
        },
        computed: {
            arr:function () {
                return this.item.query
            }
        },
        components:{
            "valuelist":valueList
        },
        methods:{
            remove:function (index) {
                this.arr.splice(index,1)
            },
            configValue:function (item) {
                if(!item.value)
                {
                    Vue.set(item,"value", {
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
            validStatus:function (status) {
                var name="";
                this.$store.getters.status.forEach(function (obj) {
                    if(obj.id==status)
                    {
                        name=obj.name;
                    }
                })
                return name;
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
                        return obj.value.toString().toLowerCase().indexOf(queryString.toString().toLowerCase()) > -1
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
            toggleEnable:function (item,index) {
                item.enable=Number(!item.enable);
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
            editRemark:function (item) {
                $.inputMul(this,"编辑remark",function (val) {
                    item.remark=val;
                    return true;
                },1,item.remark)
            },
            toggleEnable:function (item,index) {
                item.enable=Number(!item.enable);
            },
        }
    }
</script>

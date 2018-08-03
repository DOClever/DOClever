<template>
    <el-row class="row">
        <table style="width: 100%">
            <template v-for="item in arr">
                <tr style="text-align: center;vertical-align: middle;height: 50px;line-height: 50px">
                    <td style="width: 20%">
                        {{item.name}}
                    </td>
                    <td style="width: 40%">
                        <el-tooltip class="item" effect="dark" :content="item.remark" placement="bottom" :disabled="!item.remark">
                            <el-input size="small" style="width: 90%" v-model="item.remark" placeholder="请填写备注">
                                <i slot="suffix" class="el-input__icon el-icon-edit" @click="editRemark(item)" style="cursor: pointer"></i>
                            </el-input>
                        </el-tooltip>
                    </td>
                    <td style="width: 40%">
                        <div  style="width: 90%;display: inline-block;" v-if="item.value && ((item.value.data && item.value.data.length>0)|| item.value.status)">
                            <el-autocomplete size="small" class="inline-input" v-model="item.selValue" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值" @mouseenter.native="focus(item)" style="width:100%" popper-class="my-autocomplete">
                                <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete" style="cursor: pointer"></i>
                                <template slot-scope="props">
                                    <div class="value">{{ props.item.value }}</div>
                                    <span class="remark">{{ props.item.remark }}</span>
                                </template>
                                <i class="el-icon-edit el-input__icon" slot="prefix" @click="configValue(item)" style="cursor: pointer"></i>
                            </el-autocomplete>
                        </div>
                        <el-input size="small" v-else style="width: 90%" v-model="item.selValue" placeholder="请填写值">
                            <i  class="el-icon-edit el-input__icon" slot="suffix" style="cursor: pointer" @click="configValue(item)"></i>
                        </el-input>
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
                return this.item.param
            }
        },
        components:{
            "valuelist":valueList
        },
        methods:{
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
            editRemark:function (item) {
                $.inputMul(this,"编辑remark",function (val) {
                    item.remark=val;
                    return true;
                },1,item.remark)
            },
        }
    }
</script>

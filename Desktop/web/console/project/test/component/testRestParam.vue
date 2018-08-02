<template>
    <el-row class="row">
        <table style="width: 100%" id="paramTable">
            <template v-for="item in arr">
                <tr style="text-align: center;vertical-align: middle;height: 50px;line-height: 50px">
                    <td style="width: 30%">
                        {{item.name}}
                    </td>
                    <td style="width: 40%;line-height: normal;">
                        {{item.remark?item.remark:"无备注"}}
                    </td>
                    <td style="width: 30%">
                        <div  style="width: 90%;display: inline-block;" v-if="item.value && (item.value.data.length>0 || item.value.status)">
                            <el-autocomplete size="small" class="inline-input" v-model="item.selValue" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值"  @mouseenter.native="focus(item)" style="width:100%" popper-class="my-autocomplete" :disabled="interface.example">
                                <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete" style="cursor: pointer"></i>
                                <template slot-scope="props">
                                    <div class="value">{{ props.item.value }}</div>
                                    <span class="remark">{{ props.item.remark }}</span>
                                </template>
                            </el-autocomplete>
                        </div>
                        <el-input size="small" v-else style="width: 90%" v-model="item.selValue" placeholder="请填写值" :disabled="interface.example"></el-input>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>
<script>
    module.exports={
        props:["interface","status"],
        data:function () {
            return {
                itemSel:null,
            }
        },
        computed: {
            arr:function () {
                return this.interface.restParam
            }
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
                var child=$.showBox(this.$parent,require("../../info/interface/component/valueList.vue"),{
                    "source":item.value
                });
                child.$on("save",function (value) {
                    item.value=value;
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
            showAutoComplete:function (event) {
                this.itemSel.selValue="";
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
            }
        }
    }
</script>

<template>
    <el-row class="row">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 20%;height: 50px">
                        <el-autocomplete size="small" style="width: 90%" class="inline-input" placeholder="请填写header" v-model="item.name" :fetch-suggestions="querySearchKey" @input="index==arr.length-1?add():''"></el-autocomplete>
                    </td>
                    <td style="width: 30%">
                        <el-autocomplete size="small" style="width: 90%;" class="inline-input" placeholder="请填写value" v-model="item.value" :fetch-suggestions="querySearchValue" @mouseenter.native="focus(item)"></el-autocomplete>
                    </td>
                    <td style="width: 30%">
                        <el-tooltip class="item" effect="dark" :content="item.remark" placement="bottom" :disabled="!item.remark">
                            <el-input size="small" style="width: 90%;font-size: 14px" placeholder="请填写备注" v-model="item.remark">
                                <i slot="suffix" class="el-input__icon el-icon-edit" @click="editRemark(item)" style="cursor: pointer"></i>
                            </el-input>
                        </el-tooltip>
                    </td>
                    <td style="width: 10%">
                        <el-button type="text" size="mini" style="font-size: 13px" @click="encrypt(item)">{{(item.encrypt && item.encrypt.type)?item.encrypt.type:"未加密"}}</el-button>
                    </td>
                    <td style="width: 10%">
                        <el-button size="mini" type="text" icon="el-icon-close" style="color: red;font-size: 15px" @click="remove(index)" v-if="index!=arr.length-1"></el-button>
                    </td>
                </tr>
            </template>
        </table>

    </el-row>
</template>
<script>
    var headerData=require("common/js/header")
    module.exports={
        props:["index","item"],
        data:function () {
            return {
                keys:Object.keys(headerData).map(function (obj) {
                    return {value:obj}
                }),
                itemSel:null
            }
        },
        computed:{
            arr:function () {
                return this.item.header
            }
        },
        methods:{
            querySearchKey:function(queryString, cb) {
                var results;
                if(queryString)
                {
                    results=this.keys.filter(function (obj) {
                        return obj.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
                    })
                }
                else
                {
                    results=this.keys;
                }
                cb(results);
            },
            querySearchValue:function(queryString, cb) {
                var results;
                if(headerData[this.itemSel.name])
                {
                    results=headerData[this.itemSel.name].map(function (obj) {
                        return {value:obj}
                    })
                }
                else
                {
                    cb([]);
                    return;
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
            add:function () {
                this.arr.push({name:'',value:'',remark:''});
            },
            remove:function (index) {
                this.arr.splice(index,1)
            },
            editRemark:function (item) {
                $.inputMul(this,"编辑remark",function (val) {
                    item.remark=val;
                    return true;
                },1,item.remark)
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
        },
        created:function () {

        }
    }
</script>

<template>
    <el-row class="row">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle" :style="{backgroundColor:item.enable?'white':'lightgray'}">
                    <td style="width: 20%;height: 50px">
                        <el-input style="width: 90%;" placeholder="请填写参数名称" v-model="item.name" :disabled="true"></el-input>
                    </td>
                    <td style="width: 30%">
                        <el-autocomplete style="width: 90%;" class="inline-input" placeholder="请填写value" v-model="item.value" :fetch-suggestions="querySearchValue" @mouseenter.native="focus(item)"></el-autocomplete>
                    </td>
                    <td style="width: 30%">
                        {{item.remark?item.remark:"无备注"}}
                    </td>
                    <td style="width: 10%;height: 50px;">
                        <el-button type="text" size="small" style="font-size: 15px" @click="encrypt(item)">{{(item.encrypt && item.encrypt.type)?item.encrypt.type:"未加密"}}</el-button>
                    </td>
                    <td style="width: 10%">
                        <el-button size="small" type="text" style="font-size: 15px;" @click="toggleEnable(item,index)"><span :class="item.enable?'fa fa-eye-slash':'fa fa-eye'" :title="item.enable?'发送时不包含此字段':'发送时包含此字段'"></span></el-button>
                    </td>
                </tr>
            </template>
        </table>

    </el-row>
</template>
<script>
    var headerData=require("./inparamHeader")
    module.exports={
        props:["interface"],
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
                return this.interface.header
            }
        },
        methods:{
            focus:function (item) {
                this.itemSel=item;
            },
            toggleEnable:function (item,index) {
                item.enable=Number(!item.enable);
            },
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
                    "source":item.encrypt,
                    "notKey":1
                });
            }
        },
    }
</script>

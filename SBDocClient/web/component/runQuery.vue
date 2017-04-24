<template>
    <el-row class="row">
        <table width="100%" id="queryTable">
            <template v-for="(item,index) in arr">
                <tr :style="{textAlign: 'center',verticalAlign: 'middle',backgroundColor:item.enable?'white':'lightgray'}">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input style="width: 90%;" placeholder="请填写参数名称" v-model="item.name" :disabled="!item.enable"></el-input>
                    </td>
                    <td style="width: 10%;" >
                        <span style="display: inline-block;">
                            {{item.must?"必选":"可选"}}
                        </span>
                    </td>
                    <td style="width: 20%;height: 50px;overflow-y: auto">
                        {{item.remark?item.remark:"无备注"}}
                    </td>
                    <td style="width: 25%;height: 50px;line-height: 50px">
                        <div  style="height: 100%;width: 90%;display: inline-block;" v-if="item.value && (item.value.data.length>0 || item.value.status)">
                            <el-autocomplete class="inline-input" v-model="item.selValue" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值" icon="caret-bottom" :on-icon-click="showAutoComplete" @mouseenter.native="focus(item)" :disabled="!item.enable" style="width:100%" popper-class="my-autocomplete" custom-item="itemauto"></el-autocomplete>
                        </div>
                        <el-input v-else style="width: 90%" v-model="item.selValue" :disabled="!item.enable"></el-input>
                    </td>
                    <td style="width: 10%;height: 50px;">
                        <el-button type="text" size="small"  style="font-size: 15px" @click="encrypt(item)">{{(item.encrypt && item.encrypt.type)?item.encrypt.type:"未加密"}}</el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button size="small" type="text" style="font-size: 15px;" @click="toggleEnable(item,index)"><span :class="item.enable?'fa fa-eye-slash':'fa fa-eye'" :title="item.enable?'发送时不包含此字段':'发送时包含此字段'"></span></el-button>
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
    </el-row>
</template>
<script>
    module.exports={
        data:function () {
            return {
                itemSel:null,
            }
        },
        computed:{
            arr:function () {
                return this.$store.state.query
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
                    this.arr[0].remark="";
                    this.arr[0].enable=1;
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
            }
        }
    }
</script>

<template>
    <el-row class="row" style="cursor: pointer;height: 100%">
        <table width="100%" style="border-spacing: 0;border-collapse: collapse;table-layout:fixed;word-wrap:break-word;word-break: break-all;" :style="{backgroundColor:'rgb(255,255,'+(255-level*20)+')'}">
            <tr v-if="level==0" style="text-align: center;vertical-align: middle;cursor: move;height: 40px;line-height: 40px;color: gray">
                <td style="width: 30%">
                    名称
                </td>
                <td style="width: 14%">
                    类型
                </td>
                <td style="width: 8%">
                    必选
                </td>
                <td style="width: 28%">
                    备注
                </td>
                <td style="width: 20%">
                    参考值
                </td>
            </tr>
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle;cursor: pointer;height: 40px;line-height: 40px">
                    <td style="width: 30%;vertical-align: middle">
                        <el-row class="row" :style="{paddingLeft:level*20+'px'}" @click.native="toggle(item)">
                            <el-col class="col" :span="2" v-if="(item.type==4 || item.type==3)" :style="{borderLeft:level>0?'1px lightgray dashed':'none'}">
                                <span :class="item.show?'el-icon-caret-bottom':'el-icon-caret-right'" style="color:#c7c7c7 "></span>
                            </el-col>
                            <el-col class="col" :span="2" :style="{borderLeft:level>0?'1px lightgray dashed':'none'}" v-else>
                                &nbsp;
                            </el-col>
                            <el-col class="col" :span="22">
                            <span v-if="(item.name!=null && (level!=0 || type!=1))">
                                {{item.name}}
                            </span>
                                <span v-else>
                                &nbsp;
                            </span>
                            </el-col>
                        </el-row>
                    </td>
                    <td style="width: 14%">
                        {{jsonType[item.type]}}
                    </td>
                    <td style="width: 8%">
                        {{item.must?"是":"否"}}
                    </td>
                    <td style="width: 28%;line-height: normal;line-height: normal;">
                        {{item.remark?item.remark:"无备注"}}
                    </td>
                    <td style="width: 20%">
                        <el-autocomplete size="small" v-model="item.mock" :fetch-suggestions="querySearch" placeholder="选择参考值" @mouseenter.native="focusAuto(item)" style="width:100%" popper-class="my-autocomplete" v-if="item.value && (item.value.data.length>0 || item.value.status)">
                            <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete"></i>
                            <template slot-scope="props">
                                <div class="value">{{ props.item.value }}</div>
                                <span class="remark">{{ props.item.remark }}</span>
                            </template>
                        </el-autocomplete>
                    </td>
                </tr>
                <tr v-if="(item.type==4 || item.type==3) && item.show">
                    <td colspan="5" style="width: 100%;margin:0;padding: 0 ">
                        <bodyjsonpreview :source="item.data" :le="level+1" :parent="item" :index="index" :data="data"></bodyjsonpreview>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>
<script>
    module.exports={
        name:"bodyjsonpreview",
        props:["source","le","parent","index","data"],
        data:function () {
            return {
                level:this.le?this.le:0,
                jsonType:["String","Number","Boolean","Array","Object","Mixed"],
                itemSel:null,
                temp:""
            }
        },
        computed:{
            arr:function () {
                return this.source?this.source:(this.temp=$.clone(this.data.bodyInfo.rawJSON),this.temp)
            },
            type:function () {
                return this.data.bodyInfo.rawJSONType;
            }
        },
        methods:{
            toggle:function (item) {
                item.show=Number(!item.show);
            },
            focusAuto:function (item) {
                this.itemSel=item;
            },
            showAutoComplete:function (event) {
                this.itemSel.mock="";
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
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
            }
        }
    }
</script>

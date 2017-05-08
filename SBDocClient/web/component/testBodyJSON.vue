<template>
    <el-row class="row" style="cursor: pointer;height: 100%">
        <table width="100%" style="border-spacing: 0">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle;cursor: move;height: 50px;line-height: 50px">
                    <td :style="{width: '30%',verticalAlign: 'middle',paddingLeft:level*20+'px'}">
                        <el-col class="col" :span="2" v-if="(item.type==4 || item.type==3)" @click.native="toggle(item)">
                            <span :class="item.show?'el-icon-caret-bottom':'el-icon-caret-right'" style="color:#c7c7c7 "></span>
                        </el-col>
                        <el-col class="col" :span="2" v-else>
                            &nbsp;
                        </el-col>
                        <el-col class="col" :span="22">
                            <el-input style="width: 90%;" placeholder="请填写名称" v-model="item.name" v-if="item.name!=null" :disabled="true"></el-input>
                            <el-input style="width: 90%;" placeholder="该字段没有名称" disabled v-else></el-input>
                        </el-col>
                    </td>
                    <td style="width: 14%">
                        <el-select v-model="item.type" style="width: 90%" @input="changeType(item)" :disabled="true">
                            <el-option :value="0" label="String"></el-option>
                            <el-option :value="1" label="Number"></el-option>
                            <el-option :value="2" label="Boolean"></el-option>
                            <el-option :value="3" label="Array"></el-option>
                            <el-option :value="4" label="Object"></el-option>
                            <el-option :value="5" label="Mixed"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 8%">
                        <span style="display: inline-block;">
                            <el-checkbox v-model="item.must" :true-label="1" :false-label="0" :disabled="true">必有</el-checkbox>
                        </span>
                    </td>
                    <td style="width: 18%">
                        <el-input type="textarea" style="width: 90%;height: 46px;line-height: 46px" resize="none" :rows="0" placeholder="请填写备注;" v-model="item.remark" :disabled="true"></el-input>
                    </td>
                    <td style="width: 30%">
                        <el-autocomplete class="inline-input" v-model="item.mock" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值" icon="caret-bottom" :on-icon-click="showAutoComplete" @mouseenter.native="focusAuto(item)" style="width:100%" popper-class="my-autocomplete" custom-item="itemauto" v-if="item.value && (item.value.data.length>0 || item.value.status)"></el-autocomplete>
                        <el-input placeholder="请填写值" v-model="item.mock" v-else-if="item.type!=3 && item.type!=4 && !item.value"></el-input>
                    </td>
                </tr>
                <tr v-if="(item.type==4 || item.type==3) && (item.data && item.data.length>0) && item.show">
                    <td colspan="7" style="width: 100%;margin:0;padding: 0 ">
                        <inparambodyjson :source="item.data" :le="level+1"></inparambodyjson>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>

<script>
    module.exports={
        name:"inparambodyjson",
        props:["source","le","status"],
        data:function () {
            return {
                level:this.le?this.le:0,
                itemSel:null,
            }
        },
        computed:{
            arr:function () {
                return this.source
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
                    event.target.nextSibling.focus();
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
        }
    }
</script>
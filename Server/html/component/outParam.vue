<template>
    <el-row class="row" style="cursor: pointer;height: 100%">
        <table width="100%" style="border-spacing: 0">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle;cursor: move;height: 50px;line-height: 50px" :draggable="false">
                    <td :style="{width: '30%',verticalAlign: 'middle',paddingLeft:level*20+'px'}">
                        <el-col class="col" :span="2" v-if="(item.type==4 || item.type==3)" @click.native="toggle(item)">
                            <span :class="item.show?'el-icon-caret-bottom':'el-icon-caret-right'" style="color:#c7c7c7 "></span>
                        </el-col>
                        <el-col class="col" :span="2" v-else>
                            &nbsp;
                        </el-col>
                        <el-col class="col" :span="22">
                            <el-input style="width: 90%;" placeholder="请填写名称" v-model.trim="item.name" v-if="item.name!=null && (level!=0 || type!=1)" :disabled="true">
                                <el-popover slot="append" placement="bottom" width="100" trigger="hover" v-if="(item.type==0 || item.type==1) && statusExist">
                                    <el-row class="row" style="font-size: 15px;color: #20A0FF;text-align: center">
                                        {{statusValid(item)}}
                                    </el-row>
                                    <el-button type="text" style="width:30px" slot="reference" @click="editStatus(item)"><i class="fa fa-tag"></i></el-button>
                                </el-popover>
                            </el-input>
                            <el-input style="width: 90%;" placeholder="该字段没有名称" disabled v-else>
                                <el-popover slot="append" placement="bottom" width="100" trigger="hover" v-if="(item.type==0 || item.type==1) && statusExist">
                                    <el-row class="row" style="font-size: 15px;color: #20A0FF;text-align: center">
                                        {{statusValid(item)}}
                                    </el-row>
                                    <el-button type="text" style="width:30px" slot="reference" @click="editStatus(item)"><i class="fa fa-tag"></i></el-button>
                                </el-popover>
                            </el-input>
                        </el-col>
                    </td>
                    <td style="width: 14%">
                        <el-select v-model="item.type" style="width: 90%" @input="changeType(item)">
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
                        <el-input type="textarea" style="width: 90%;height: 46px;line-height: 46px" resize="none" :rows="0" placeholder="请填写Mock数据;" v-model="item.mock" v-if="item.type!=4" :disabled="true"></el-input>
                    </td>
                </tr>
                <tr v-if="(item.type==4 || item.type==3) && (item.data && item.data.length>0) && item.show">
                    <td colspan="7" style="width: 100%;margin:0;padding: 0 ">
                        <outparam :source="item.data" :le="level+1" :parent="item"></outparam>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>

<script>
    module.exports={
        name:"outparam",
        props:["source","le","parent","index","data"],
        data:function () {
            return {
                level:this.le?this.le:0,
            }
        },
        computed:{
            arr:function () {
                return this.source?this.source:this.data.result
            },
            statusExist:function () {
                return (this.$store.state.status && this.$store.state.status.length>0)?true:false;
            },
            type:function () {
                return this.data.outInfo.jsonType;
            }
        },
        methods:{
            remove:function (item,index,level) {
                if(item.type==3 || item.type==4)
                {
                    var _this=this;
                    $.confirm("该元素是"+(item.type==3?"Array":"Object")+"类型,是否确认删除！",function () {
                        _remove.call(_this,index,level);
                    })
                }
                else
                {
                    _remove.call(this,index,level);
                }
                function _remove(index,level) {
                    if(this.arr.length==1 && level==0)
                    {
                        this.arr[0].name="";
                        this.arr[0].must=0;
                        this.arr[0].remark="";
                        this.arr[0].type=0;
                        this.arr[0].show=0;
                        this.arr[0].mock="";
                        this.arr[0].drag=1;
                    }
                    else
                    {
                        this.arr.splice(index,1)
                    }
                }

            },
            toggle:function (item) {
                item.show=Number(!item.show);
            },
            add:function (arr) {
                arr.push({
                    name:(this.parent && this.parent.type==3)?null:"",
                    must:1,
                    type:0,
                    remark:"",
                    show:1,
                    mock:"",
                    drag:1
                })
            },
            addChild:function(item)
            {
                if(!item.data)
                {
                    this.$set(item,"data",[]);
                }
                item.data.push({
                    name:item.type==4?"":null,
                    must:1,
                    type:0,
                    remark:"",
                    show:1,
                    mock:"",
                    drag:1
                })
                item.show=1
            },
            changeType:function (item) {
                if(item.type==4 || item.type==3)
                {
                    if(!item.data)
                    {
                        this.$set(item,"data",[]);
                    }
                    else
                    {
                        item.data=[];
                    }
                    item.show=0;
                }
                else
                {
                    delete item.data
                }
            },
            editStatus:function (item) {
                if(!item.status)
                {
                    Vue.set(item,"status","");
                }
                var child=$.showBox(this,require("./chooseStatus.vue"),{
                    status:item.status
                });
                child.$on("save",function (data) {
                    item.status=data;
                })
            },
            statusValid:function (item) {
                if(!item.status)
                {
                    return "没有绑定状态码";
                }
                else
                {
                    var bFind=false,name="";
                    this.$store.state.status.forEach(function (obj) {
                        if(obj.id==item.status)
                        {
                            bFind=true;
                            name=obj.name;
                        }
                    })
                    if(bFind)
                    {
                        return "状态码:"+name;
                    }
                    else
                    {
                        item.status="";
                        return "状态码已不存在"
                    }
                }
            }
        }
    }
</script>

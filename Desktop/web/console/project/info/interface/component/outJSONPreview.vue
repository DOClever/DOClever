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
                    <td style="width: 20%;line-height: normal">
                        <span v-if="item.type!=3 && item.type!=4">
                            {{mock(item)}}
                        </span>
                    </td>
                </tr>
                <tr v-if="(item.type==4 || item.type==3) && item.show">
                    <td colspan="5" style="width: 100%;margin:0;padding: 0 ">
                        <outjsonpreview :source="item.data" :le="level+1" :parent="item" :index="index" :data="data"></outjsonpreview>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>
<script>
    module.exports={
        name:"outjsonpreview",
        props:["source","le","parent","index","data"],
        data:function () {
            return {
                level:this.le?this.le:0,
                jsonType:["String","Number","Boolean","Array","Object","Mixed"],
                temp:""
            }
        },
        computed:{
            arr:function () {
                return this.source?this.source:(this.temp=$.clone(this.data.result),this.temp)
            },
            type:function () {
                return this.data.outInfo.jsonType;
            }
        },
        methods:{
            toggle:function (item) {
                item.show=Number(!item.show);
            },
            mock:function (item) {
                if(item.retMock===undefined)
                {
                    var bJSON=false,obj={};
                    if(this.data.bodyInfo.type==1 && this.data.bodyInfo.rawType==2 && this.data.bodyInfo.rawJSON)
                    {
                        obj=this.data.bodyInfo.rawJSONType==0?{}:[];
                        bJSON=true;
                        var result=helper.resultSave(this.data.bodyInfo.rawJSON);
                        helper.convertToJSON(result,obj);
                    }
                    var info=helper.handleMockInfo(0,this.data.param,this.data.query,this.data.header,bJSON?obj:this.data.body,this.$store?this.$store.state:this.$root);
                    item.retMock=helper.mock(item.mock,info);
                }
                return item.retMock;
            }
        }
    }
</script>

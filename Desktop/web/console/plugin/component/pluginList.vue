<template>
    <el-dialog title="插件列表" width="60%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <table class="table-hover" style="width: 100%">
                <thead>
                <th>
                    名称
                </th>
                <th>
                    最新版本
                </th>
                <th>
                    简介
                </th>
                <th>
                    购买
                </th>
                <th>
                    操作
                </th>
                </thead>
                <tbody>
                <template v-for="item in list">
                    <tr class="row" style="height: 40px;vertical-align: middle;text-align: center">
                        <td style="width: 20%">
                            <img v-proxy="item.logo" style="height: 36px;width: 36px;border-radius: 18px">&nbsp;
                            {{item.name}}
                        </td>
                        <td style="width: 20%">
                            {{item.version}}
                        </td>
                        <td style="width: 25%;overflow: hidden;text-overflow: ellipsis">
                            {{item.remark?item.remark:"无"}}
                        </td>
                        <td style="width: 15%">
                            {{item.buy?"已购买":"未购买"}}
                        </td>
                        <td style="width: 20%">
                            <el-button size="mini" type="text" @click="pluginInfo(item,index)">
                                详情
                            </el-button>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    var config=require("common/js/config")
    module.exports={
        props:["propList"],
        data:function () {
            return {
                showDialog:false,
                list:this.propList
            }
        },
        computed:{

        },
        directives:{
            "proxy":proxyImg
        },
        methods:{
            pluginInfo:function (item,index) {
                var _this=this;
                $.startHud();
                this.$store.dispatch("pluginInfo",item._id).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./pluginInfo.vue"),{
                            propObj:data.data
                        });
                        child.$on("refreshList",async function () {
                            _this.$store.dispatch("pluginList").then(function (data) {
                                if(data.code==200)
                                {
                                    _this.propList=_this.list=data.data;
                                }
                            })
                            this.$store.getters.event.$emit("refreshPluginList");
                        })
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            }
        }
    }
</script>
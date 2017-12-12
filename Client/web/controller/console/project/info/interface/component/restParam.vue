<template>
    <el-row class="row">
        <table style="width: 100%">
            <template v-for="item in arr">
                <tr style="text-align: center;vertical-align: middle;height: 50px;line-height: 50px">
                    <td style="width: 30%">
                        {{item.name}}
                    </td>
                    <td style="width: 50%">
                        <el-input size="small" style="width: 90%" v-model="item.remark" placeholder="请填写备注"></el-input>
                    </td>
                    <td style="width: 20%">
                        <el-popover trigger="hover" placement="bottom" width="200" :disabled="!(item.value && (item.value.data.length>0 || item.value.status))">
                            <div style="width: 200px;overflow: auto;text-align: center" v-if="item.value && (item.value.data.length>0 || item.value.status)">
                                <template v-if="item.value.data.length>0">
                                    <table width="100%" class="table-hover" style="border-collapse: collapse">
                                        <template v-for="item1 in item.value.data">
                                            <tr style="text-align: center;vertical-align: middle;">
                                                <td style="width: 40%;border-bottom: 1px solid #e6ebf5">
                                                    {{item1.value}}
                                                </td>
                                                <td style="width: 60%;border-bottom: 1px solid #e6ebf5">
                                                    {{item1.remark?item1.remark:"无备注"}}
                                                </td>
                                            </tr>
                                        </template>
                                    </table>
                                </template>
                                <template v-else>
                                    绑定了状态码：{{validStatus(item.value.status)}}
                                </template>
                            </div>
                            <el-button slot="reference" size="mini" style="font-size: 13px" type="text" @click="configValue(item)">{{(item.value && (item.value.data.length>0 || item.value.status))?"已填值":"未填值"}}</el-button>
                        </el-popover>
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
            }
        }
    }
</script>

<template>
    <el-row class="row">
        <table style="width: 100%">
            <template v-for="item in arr">
                <tr style="text-align: center;vertical-align: middle;height: 50px;line-height: 50px">
                    <td style="width: 30%">
                        {{item.name}}
                    </td>
                    <td style="width: 50%">
                        <el-input style="width: 90%" v-model="item.remark" placeholder="请填写备注" :disabled="true"></el-input>
                    </td>
                    <td style="width: 20%">
                        <el-button style="font-size: 15px" type="text" size="small" @click="configValue(item)">{{(item.value && (item.value.data.length>0 || item.value.status))?"已填值":"未填值"}}</el-button>
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
            }
        }
    }
</script>

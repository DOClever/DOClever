<template>
    <el-row class="row">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input style="width: 90%" placeholder="请填写参数名称" v-model.trim="item.name" :disabled="true"></el-input>
                    </td>
                    <td style="width: 10%;" >
                        <el-checkbox v-model="item.must" :true-label="1" :false-label="0" :disabled="true">必选</el-checkbox>
                    </td>
                    <td style="width: 55%">
                        <el-input style="width: 90%" placeholder="请填写备注" v-model="item.remark" :disabled="true"></el-input>
                    </td>
                    <td style="width: 15%">
                        <el-button type="text" style="font-size: 15px" size="small" @click="configValue(item)">{{(item.value && (item.value.data.length>0 || item.value.status))?"已填值":"未填值"}}</el-button>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>
<script>
    var valueList=require("./valueList.vue")
    module.exports={
        data:function () {
            return {

            }
        },
        computed: {
            arr:function () {
                return this.$store.state.query
            }
        },
        components:{
            "valuelist":valueList
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
                    if(this.arr[0].value)
                    {
                        this.arr[0].value={
                            type:0,
                            data:[],
                            status:""
                        };
                    }
                }
            },
            configValue:function (item) {
                if(!item.value)
                {
                    Vue.set(item,"value", {
                        type: 0,
                        data: [],
                        status: ""
                    });
                }
                var child=$.showBox(this.$parent,"valueList",{
                    "source":item.value
                });
                child.$on("save",function (value) {
                    item.value=value;
                });
            }
        }
    }
</script>

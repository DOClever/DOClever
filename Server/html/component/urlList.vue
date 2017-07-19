<template>
    <div style="width: 100%">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 70%">
                        <el-input style="width: 90%;margin: 0 auto" placeholder="请填写baseurl地址" v-model="item.url" :disabled="true"></el-input>
                    </td>
                    <td style="width: 30%">
                        <el-input style="width: 90%;margin: 0 auto" placeholder="请填写备注" v-model="item.remark" :disabled="true"></el-input>
                    </td>
                </tr>
            </template>
            <tfoot>
            </tfoot>
        </table>
    </div>
</template>

<script>
    module.exports={
        props:["source"],
        data:function () {
            return {
                arr:function () {
                    if(this.source.length>0)
                    {
                        return this.source
                    }
                    else
                    {
                        return [{
                            url:"",
                            remark:""
                        }]
                    }
                }.call(this),
                savePending:false
            }
        },
        watch:{
            source:function (val) {
                if(val && val.length>0)
                {
                    this.arr= val;
                }
                else
                {
                    this.arr= [{
                        url:"",
                        remark:""
                    }]
                }
            }
        },
        methods:{

        },
    }
</script>

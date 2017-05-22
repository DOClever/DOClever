<template>
    <el-dialog title="编辑状态码"  size="small" ref="box">
        <el-row class="row">
            <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                <el-col class="col" :span="4">
                    名称
                </el-col>
                <el-col class="col" :span="20">
                    <el-input placeholder="请输入状态码名称" style="width: 90%" v-model="obj.name" :disabled="true"></el-input>
                </el-col>
            </el-row>
            <table style="width: 100%" class="table-hover">
                <template v-for="(item,index) in obj.data">
                    <tr style="text-align: center;vertical-align: middle">
                        <td style="width: 40%">
                            <el-input style="width: 90%;margin: 0 auto" placeholder="请填写键" v-model="item.key" :disabled="true"></el-input>
                        </td>
                        <td style="width: 50%">
                            <el-input style="width: 90%;margin: 0 auto" placeholder="请填写值" v-model="item.remark" :disabled="true"></el-input>
                        </td>
                    </tr>
                </template>
            </table>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["source"],
        data:function () {
            return {
                obj:function () {
                    if(this.source)
                    {
                        var obj=$.clone(this.source)
                        if(obj.data.length==0)
                        {
                            obj.data.push({
                                key:"",
                                remark:""
                            })
                        }
                        return obj;
                    }
                    else
                    {
                        return {
                            name:"",
                            data:[
                                {
                                    key:"",
                                    remark:""
                                }
                            ]
                        }
                    }
                }.call(this),
                savePending:false
            }
        },
        methods:{
            remove:function (index) {
                if(this.obj.data.length>1)
                {
                    this.obj.data.splice(index,1)
                }
                else
                {
                    this.obj.data[0].key="";
                    this.obj.data[0].remark="";
                }
            },
        }
    }
</script>

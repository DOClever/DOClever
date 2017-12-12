<template>
    <el-dialog title="选择模板"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" id="chooseTemplate" style="font-size: 14px">
            <table class="table-hover" style="width: 100%;border-collapse: collapse" v-if="arr.length>0">
                <thead>
                <th>
                    选择
                </th>
                <th>
                    名称
                </th>
                <th>
                    创建时间
                </th>
                </thead>
                <template v-for="(item,index) in arr">
                    <tr :key="item._id" style="height: 50px;text-align: center;vertical-align: middle">
                        <td style="width:10%">
                            <el-radio class="radio" :label="index" v-model="selIndex">
                            </el-radio>
                        </td>
                        <td style="width: 50%">
                            {{item.name}}
                        </td>
                        <td style="width: 40%">
                            {{item.createdAt}}
                        </td>
                    </tr>
                </template>
            </table>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" size="small" :loading="savePending">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>
    #chooseTemplate td{
        border-bottom:1px solid #BBB;
    }
    #chooseTemplate th{
        border-bottom:1px solid #BBB;
    }
    #chooseTemplate .el-radio__label {
        display: none;
    }
    #chooseTemplate .el-tabs__content {
        padding: 10px 5px 20px 10px;
    }
</style>

<script>
    module.exports={
        props:["groupId"],
        data:function () {
            return {
                showDialog:false,
                savePending:false,
                selIndex:0
            }
        },
        computed:{
            interface:function () {
                return this.$store.state.interfaceEdit;
            },
            arr:function () {
                return this.$store.getters.template
            }
        },
        methods:{
            save:function () {
                var _this=this;
                this.savePending=true;
                net.get("/template/item",{
                    id:this.arr[this.selIndex]._id
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        var obj=data.data;
                        obj={
                            name: obj.name,
                            group: {
                                _id: _this.groupId,
                            },
                            url: obj.url,
                            remark: obj.remark,
                            method: obj.method,
                            finish:0,
                            param:obj.param,
                        };
                        _this.$store.dispatch("add",{
                            item:obj,
                            id:null
                        })
                        _this.showDialog=false;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            }
        }
    }
</script>
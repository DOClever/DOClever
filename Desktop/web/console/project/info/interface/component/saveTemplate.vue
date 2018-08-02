<template>
    <el-dialog title="保存模板"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" id="saveTemplate" style="font-size: 14px">
            <el-tabs  v-model="type">
                <el-tab-pane label="新模板" :name="0">
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="4">
                            模板名称
                        </el-col>
                        <el-col class="col" :span="20">
                            <el-input size="small" style="width: 80%" v-model="name"></el-input>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="覆盖老模板" :name="1">
                    <table class="table-hover" style="width: 100%;border-collapse: collapse" v-if="arr.length>0">
                        <thead>
                            <th>
                                名称
                            </th>
                            <th>
                                创建时间
                            </th>
                            <th>
                                操作
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
                    <div style="text-align: center" v-else>暂无老模板</div>
                </el-tab-pane>
            </el-tabs>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" size="small" :loading="savePending">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>
    #saveTemplate td{
        border-bottom:1px solid #BBB;
    }
    #saveTemplate th{
        border-bottom:1px solid #BBB;
    }
    #saveTemplate .el-radio__label {
        display: none;
    }
    #saveTemplate .el-tabs__content {
        padding: 10px 5px 20px 10px;
    }
</style>

<script>
    module.exports={
        props:[],
        data:function () {
            return {
                showDialog:false,
                type:0,
                name:this.$store.state.interfaceEdit.name,
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
                if(this.type==0)
                {
                    if(!this.name)
                    {
                        $.tip("请输入模板名称",0);
                        return;
                    }
                }
                else if(this.type==1)
                {
                    if(this.arr.length==0)
                    {
                        $.tip("暂无老模板",0);
                        return;
                    }
                }
                this.savePending=true;
                var _this=this;
                var query={
                    name:this.name
                }
                if(this.type==1)
                {
                    query.id=this.arr[this.selIndex]._id;
                }
                this.$store.dispatch("saveTemplate",query).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.tip("保存成功",1);
                        _this.arr.unshift({
                            _id:data.data._id,
                            name:data.data.name,
                            createdAt:data.data.createdAt
                        })
                        _this.showDialog=false;
                    }
                    else
                    {
                        $.tip(data.msg,0)
                    }
                })

            }
        }
    }
</script>

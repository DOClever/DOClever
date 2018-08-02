<template>
    <el-dialog title="添加用例"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="height: 250px;overflow-y: auto">
            <el-input size="small" placeholder="请输入关键词过滤" v-model="text"></el-input>
            <el-tree :data="arrTest" :props="defaultProps" show-checkbox node-key="_id"  ref="tree" :filter-node-method="filterNode" style="margin-top: 10px">
            </el-tree>
        </el-row>
        <el-row class="row" style="height: 50px;line-height: 50px">
            <el-col class="col" :span="4" style="text-align: center">
                模式:
            </el-col>
            <el-col class="col" :span="20">
                <el-switch v-model="editMode" active-value="code" inactive-value="ui" active-text="代码" inactive-text="UI">
                </el-switch>
            </el-col>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button size="mini" type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style scoped>

</style>

<script>
    module.exports = {
        data: function () {
            return {
                showDialog:false,
                defaultProps:{
                    children:"data",
                    label:"name"
                },
                text:"",
                editMode:"code"
            }
        },
        watch:{
            text:function (val) {
                this.$refs.tree.filter(val);
            }
        },
        computed:{
            arrTest:function () {
                return this.$store.state.data
            }
        },
        methods: {
            filterNode:function(value, data) {
                if (!value) return true;
                return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
            },
            save:function () {
                var arrTest=this.$refs.tree.getCheckedNodes();
                arrTest=arrTest.filter(function (obj) {
                    if(!obj.data)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                })
                if(arrTest.length==0)
                {
                    $.tip("请选择用例",0);
                    return;
                }
                this.$emit("save",{
                    data:arrTest,
                    mode:this.editMode
                });
                this.showDialog=false;
            }
        }
    }
</script>
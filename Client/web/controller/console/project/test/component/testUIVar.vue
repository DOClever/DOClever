<template>
    <el-dialog title="编辑变量"  width="60%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-radio size="small" v-model="globalEdit" :label="0">
                局部变量
            </el-radio>
            <el-radio size="small" v-model="globalEdit" :label="1">
                全局变量
            </el-radio>
                <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
                    <el-col class="col" :span="6">
                        <el-input size="small" placeholder="请输入变量名" style="width: 90%" v-model="varEdit"></el-input>
                    </el-col>
                    <el-col class="col" :span="18">
                        <el-input size="small" placeholder="请输入变量值或表达式，字符串请加双引号" style="width: 90%" v-model="valueEdit"></el-input>
                    </el-col>
                </el-row>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>

</style>

<script>
    module.exports = {
        props:["global","var","value"],
        data: function () {
            return {
                showDialog:false,
                globalEdit:this.global!==undefined?this.global:0,
                varEdit:this.var!==undefined?this.var:"",
                valueEdit:this.value!==undefined?this.value:"",
            }
        },
        methods: {
            save:function () {
                if(!this.varEdit)
                {
                    $.tip("请输入变量名！");
                    return;
                }
                if(!this.valueEdit)
                {
                    this.valueEdit="undefined";
                }
                this.$emit("save",this.globalEdit,this.varEdit,this.valueEdit);
                this.showDialog=false;
            }
        }
    }
</script>
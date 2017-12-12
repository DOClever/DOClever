<template>
    <el-dialog title="编辑用户的权限" width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form label-width="80px">
            <el-form-item label="接口" style="text-align: center">
                <el-checkbox :true-label="1" :false-label="0" v-model="option.ie">接口编辑</el-checkbox>
            </el-form-item>
            <el-form-item label="测试" style="text-align: center">
                <el-checkbox :true-label="1" :false-label="0" v-model="option.te">用例编辑</el-checkbox>
            </el-form-item>
            <el-form-item label="全局" style="text-align: center">
                <el-checkbox :true-label="1" :false-label="0" v-model="option.gb">
                    BaseUrl
                </el-checkbox>&nbsp;&nbsp;
                <el-checkbox :true-label="1" :false-label="0" v-model="option.gs">
                    状态码
                </el-checkbox>&nbsp;&nbsp;
                <el-checkbox :true-label="1" :false-label="0" v-model="option.gi">
                    环境注入
                </el-checkbox>&nbsp;&nbsp;
                <el-checkbox :true-label="1" :false-label="0" v-model="option.gt">
                    接口模板
                </el-checkbox>&nbsp;&nbsp;
                <el-checkbox :true-label="1" :false-label="0" v-model="option.gd">
                    文档
                </el-checkbox>
            </el-form-item>
            <el-form-item label="版本" style="text-align: center">
                <el-checkbox :true-label="1" :false-label="0" v-model="option.ve">版本编辑</el-checkbox>&nbsp;&nbsp;
                <el-checkbox :true-label="1" :false-label="0" v-model="option.vr">版本回滚</el-checkbox>
            </el-form-item>
        </el-form>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["data","hudremove"],
        data:function () {
            return {
                option:this.data?$.clone(this.data):{
                    "ie":0,
                    "te":0,
                    "gb":0,
                    "gs":0,
                    "gi":0,
                    "gt":0,
                    "gd":0,
                    "ve":0,
                    "vr":0
                },
                showDialog:false,
                hud:this.hudremove===undefined?true:!Boolean(this.hudremove),
            }
        },
        methods:{
            save:function () {
                this.$emit("save",this.option);
                this.showDialog=false;
            }
        }
    }
</script>
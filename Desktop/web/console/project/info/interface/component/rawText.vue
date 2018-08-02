<template>
    <el-dialog title="Raw文本内容"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row style="background-color: white;height: 100%;padding: 20px;" class="row">
            <el-input size="small" type="textarea" :rows="10" placeholder="请输入您的文本内容" v-model="text"></el-input>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["source"],
        data:function () {
            return {
                text:this.source,
                showDialog:false
            }
        },
        methods:{
            save:function () {
                this.$emit("save",this.text);
                this.showDialog=false;
            }
        }
    }
</script>

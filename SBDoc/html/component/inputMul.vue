<template>
    <el-dialog title="DOClever"  size="small" ref="box" :modal="hud">
        <el-row style="background-color: white;height: 100%;padding: 20px;" class="row">
            <el-input type="textarea" :rows="6" :placeholder="placeholder" v-model="text" :disabled="true"></el-input>
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
        props:["source","placeholder","hudremove"],
        data:function () {
            return {
                text:this.source,
                hud:this.hudremove===undefined?true:Boolean(this.hudremove)
            }
        },
        methods:{
            save:function () {
                this.$emit("save",this.text);
            }
        }
    }
</script>

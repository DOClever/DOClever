<template>
    <el-dialog title="DOClever"  size="50%" ref="box" :modal="hud" :visible.sync="showDialog" append-to-body>
        <el-form label-width="100px">
            <el-form-item style="text-align: center" :label="data.labelTitle">
                <el-input size="small" :placeholder="data.placeholderTitle"  v-model="data.textTitle"></el-input>
            </el-form-item>
            <el-form-item  style="text-align: center" :label="data.labelContent">
                <el-input size="small" type="textarea" :rows="6" :placeholder="data.placeholderContent"  v-model="data.textContent"></el-input>
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
        props:["name1","name2","placeholder1","placeholder2","text1","text2","hudremove"],
        data:function () {
            return {
                data:{
                    labelTitle:this.name1,
                    labelContent:this.name2,
                    placeholderTitle:this.placeholder1,
                    placeholderContent:this.placeholder2,
                    textTitle:this.text1,
                    textContent:this.text2
                },
                hud:this.hudremove===undefined?true:Boolean(this.hudremove),
                showDialog:false
            }
        },
        methods:{
            save:function () {
                this.$emit("save",this.data.textTitle,this.data.textContent);
            }
        }
    }
</script>

<template>
    <el-dialog title="设置BaseUrl"  size="small" ref="box" >
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-col class="col" :span="4">
                BaseUrl
            </el-col>
            <el-col class="col" :span="20">
                <el-select style="width: 90%" v-model="urlEdit">
                    <el-option v-for="item in arrUrl" :value="item" :label="item"></el-option>
                </el-select>
            </el-col>
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
        props:["url","arrUrl"],
        data:function () {
            return {
                urlEdit:this.url
            }
        },
        computed:{
        },
        methods:{
            save:function () {
                this.$emit("save",this.urlEdit);
                this.$refs.box.close();
            }
        }
    }
</script>

<template>
    <el-dialog title="设置BaseUrl"  size="small" ref="box" v-model="showDialog">
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-col class="col" :span="4">
                BaseUrl
            </el-col>
            <el-col class="col" :span="20">
                <el-select style="width: 90%" v-model="urlEdit">
                    <el-option v-for="item in arrUrl" :value="item.url" style="height: auto" :key="item.url"><span>{{item.url}}</span><br><span style="font-size: 13px;color: gray">{{item.remark}}</span></el-option>
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
                urlEdit:this.url,
                showDialog:false
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

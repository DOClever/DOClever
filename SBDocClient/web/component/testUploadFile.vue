<template>
    <el-dialog title="选择文件"  size="small" ref="box" >
        <el-row class="row" style="height: 50px;line-height: 50px">
            {{name+"("+url+"):"}}
        </el-row>
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-col class="col" :span="4">
                {{keyName?keyName:"Raw"}}
            </el-col>
            <el-col class="col" :span="12">
                {{remark?remark:"无备注"}}
            </el-col>
            <el-col class="col" :span="8" style="overflow: auto">
                <a  href="javascript:void(0)" class="file" style="display: inline-block;top: 10px">
                    <span>选择文件</span><input type="file" onchange="this.previousSibling.innerText=this.files[0].name" id="testUploadFile">
                </a>
            </el-col>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["name","url","keyName","remark"],
        data:function () {
            return {

            }
        },
        computed:{

        },
        methods:{
            save:function () {
                this.$emit("save",document.getElementById("testUploadFile"));
                this.$refs.box.close();
            }
        }
    }
</script>

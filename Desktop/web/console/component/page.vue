<template>
    <el-row class="row" style="text-align: center;height: 30px;line-height: 30px">
        <el-button type="text" size="small" icon="el-icon-arrow-left" @click="pre">
        </el-button>&nbsp;&nbsp;&nbsp;{{page+1}}&nbsp;&nbsp;&nbsp;<el-button type="text" size="small" icon="el-icon-arrow-right" @click="next" style="margin-left: 0">
        </el-button>
    </el-row>
</template>

<script>
    module.exports={
        data:function () {
            return {
                page:0
            }
        },
        methods:{
            pre:function () {
                if(this.page>0)
                {
                    this.page--;
                    this.$emit("change",this.page);
                }
            },
            next:function () {
                this.page++;
                this.$emit("change",this.page);
            },
            init:function () {
                this.page=0;
                this.$emit("change",this.page);
            }
        }
    }
</script>
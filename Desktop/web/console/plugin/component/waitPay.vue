<template>
    <el-dialog title="支付" width="50%" ref="box" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" append-to-body>
        <el-row class="row" style="height: 100px;line-height: 100px;text-align: center;font-size: 25px">
            等待支付
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button size="mini" type="primary" @click="close">
                支付完成
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        data:function () {
            return {
                showDialog:false,
            }
        },
        computed:{

        },
        directives:{

        },
        methods:{
            close:function () {
                this.showDialog=false;
                this.$store.dispatch("initMemberInfo",null,{
                    root:true
                })
                this.$emit("close");
            },
        }
    }
</script>
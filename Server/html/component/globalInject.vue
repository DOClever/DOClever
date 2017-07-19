<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 30px;line-height: 30px">
            <el-radio class="radio" :label="0" v-model="type">
                Before
            </el-radio>
            <el-radio class="radio" :label="1" v-model="type">
                After
            </el-radio>
        </el-row>
        <el-row class="row" style="text-align: center;margin-top: 10px">
            <el-input style="width: 95%" v-model="beforeEdit" type="textarea" :rows="10" v-if="type==0" placeholder="请输入你需要在运行前注入的JS代码" :disabled="true">

            </el-input>
            <el-input style="width: 95%" v-model="afterEdit" type="textarea" :rows="10" v-else placeholder="请输入你需要在运行后注入的JS代码" :disabled="true">

            </el-input>
        </el-row>
    </el-row>
</template>

<script>
    var bus=require("../bus/projectInfoBus")
    module.exports={
        props:["before","after"],
        data:function () {
            return {
                type:0,
                beforeEdit:this.before,
                afterEdit:this.after,
                savePending:false,
            }
        },
        computed:{
            interface:function () {
                return this.$store.state.interfaceEdit;
            }
        },
        methods:{

        }
    }
</script>

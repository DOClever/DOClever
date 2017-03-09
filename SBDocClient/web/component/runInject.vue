<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 30px;line-height: 30px">
            <el-radio class="radio" :label="0" v-model="type">
                Before
            </el-radio>
            <el-radio class="radio" :label="1" v-model="type">
                After
            </el-radio>
            <el-button type="text" size="small" style="font-size: 15px;float: right;margin-right: 10px" onclick="window.open('../projectinfo/inject.html','_blank')">
                注入规则
            </el-button>
        </el-row>
        <el-input style="margin-top: 10px" v-model="interface.before" type="textarea" :rows="8" v-if="type==0" placeholder="请输入你需要在运行前注入的JS代码">

        </el-input>
        <el-input style="margin-top: 10px" v-model="interface.after" type="textarea" :rows="8" v-else placeholder="请输入你需要在运行后注入的JS代码">

        </el-input>
    </el-row>
</template>

<script>
    module.exports={
        data:function () {
            return {
                type:0
            }
        },
        computed:{
            interface:function () {
                return this.$store.state.interface;
            }
        },
        methods:{

        }
    }
</script>

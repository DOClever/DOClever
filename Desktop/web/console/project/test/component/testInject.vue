<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 30px;line-height: 30px">
            <el-radio class="radio" :label="0" v-model="type">
                Before
            </el-radio>
            <el-radio class="radio" :label="1" v-model="type">
                After
            </el-radio>&nbsp;&nbsp;&nbsp;
            <el-checkbox v-model="interface.before.mode" :true-label="1" :false-label="0" v-if="type==0" :disabled="true">不执行全局注入</el-checkbox>
            <el-checkbox v-model="interface.before.mode" :true-label="1" :false-label="0" v-else :disabled="true">不执行全局注入</el-checkbox>
            <el-button type="text" size="mini" style="font-size: 15px;float: right;margin-right: 10px" onclick="window.open('http://doclever.cn/resource/other/inject.html','_blank')">
                注入规则
            </el-button>
        </el-row>
        <el-input size="small" style="margin-top: 10px" v-model="interface.before.code" type="textarea" :rows="8" v-if="type==0" placeholder="请输入你需要在运行前注入的JS代码" :disabled="true">

        </el-input>
        <el-input size="small" style="margin-top: 10px" v-model="interface.after.code" type="textarea" :rows="8" v-else placeholder="请输入你需要在运行后注入的JS代码" :disabled="true">

        </el-input>
    </el-row>
</template>

<script>
    module.exports={
        props:["interface"],
        data:function () {
            return {
                type:0
            }
        },
        methods:{

        }
    }
</script>

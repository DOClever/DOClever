<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 30px;line-height: 30px">
            <el-radio class="radio" :label="0" v-model="type">
                Before
            </el-radio>
            <el-radio class="radio" :label="1" v-model="type">
                After
            </el-radio>&nbsp;&nbsp;&nbsp;
            <el-checkbox v-model="obj.before.mode" :true-label="1" :false-label="0" v-if="type==0">不执行全局注入</el-checkbox>
            <el-checkbox v-model="obj.before.mode" :true-label="1" :false-label="0" v-else>不执行全局注入</el-checkbox>
            <el-button type="text" size="mini" style="font-size: 15px;float: right;margin-right: 10px" onclick="window.open('http://doclever.cn/resource/other/inject.html','_blank')">
                注入规则
            </el-button>
        </el-row>
        <el-input size="small" style="margin-top: 10px;margin-left: 10px;width: calc(100% - 20px)" v-model="obj.before.code" type="textarea" :rows="3" v-if="type==0" placeholder="请输入你需要在运行前注入的JS代码">

        </el-input>
        <el-input size="small" style="margin-top: 10px;margin-left: 10px;width: calc(100% - 20px)" v-model="obj.after.code" type="textarea" :rows="3" v-else placeholder="请输入你需要在运行后注入的JS代码">

        </el-input>
    </el-row>
</template>

<script>
    module.exports={
        props:["index","item"],
        data:function () {
            return {
                type:0
            }
        },
        computed:{
            obj:function () {
                return this.item;
            }
        },
        methods:{

        }
    }
</script>

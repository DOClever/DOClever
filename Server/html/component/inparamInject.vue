<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 30px;line-height: 30px">
            <el-radio class="radio" :label="0" v-model="type">
                Before
            </el-radio>
            <el-radio class="radio" :label="1" v-model="type">
                After
            </el-radio>&nbsp;&nbsp;&nbsp;
            <el-checkbox v-model="obj.before.mode" :true-label="1" :false-label="0" v-if="type==0" :disabled="true">不执行全局注入</el-checkbox>
            <el-checkbox v-model="obj.before.mode" :true-label="1" :false-label="0" v-else :disabled="true">不执行全局注入</el-checkbox>
        </el-row>
        <el-input style="margin-top: 10px" v-model="obj.before.code" type="textarea" :rows="3" v-if="type==0" placeholder="请输入你需要在运行前注入的JS代码" :disabled="true">

        </el-input>
        <el-input style="margin-top: 10px" v-model="obj.after.code" type="textarea" :rows="3" v-else placeholder="请输入你需要在运行后注入的JS代码" :disabled="true">

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

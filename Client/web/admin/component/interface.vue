<template>
    <el-row class="row" style="padding-bottom: 10px">
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
            <el-col class="col" :span="12" style="border-right: 1px gray solid">
                总共:{{total}}
            </el-col>
            <el-col class="col" :span="12" style="border-right: 1px gray solid">
                今日新建:{{create}}
            </el-col>
        </el-row>
    </el-row>
</template>


<script>
    var page=require("../../component/page.vue");
    module.exports={
        data:function () {
            return {

            }
        },
        computed:{
            total:function () {
                return this.$store.state.interface.total;
            },
            create:function () {
                return this.$store.state.interface.todayCreate;
            },
        },
        components:{
            "page":page
        },
        methods:{

        }
    }
</script>
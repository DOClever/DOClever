<template>
    <el-row class="row" style="padding-bottom: 10px">
        <el-tabs tab-position="left" v-model="category">
            <el-tab-pane :name="0" label="接口">
                <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        总共:{{interfaceTotal}}
                    </el-col>
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        今日新建:{{interfaceCreate}}
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :name="1" label="文档">
                <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        总共:{{docTotal}}
                    </el-col>
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        今日新建:{{docCreate}}
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :name="2" label="测试">
                <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        总共:{{testTotal}}
                    </el-col>
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        今日新建:{{testCreate}}
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>


<script>
    var page=require("component/page.vue");
    module.exports={
        data:function () {
            return {
                category:0
            }
        },
        computed:{
            interfaceTotal:function () {
                return this.$store.state.item.interface.total;
            },
            interfaceCreate:function () {
                return this.$store.state.item.interface.todayCreate;
            },
            docTotal:function () {
                return this.$store.state.item.doc.total;
            },
            docCreate:function () {
                return this.$store.state.item.doc.todayCreate;
            },
            testTotal:function () {
                return this.$store.state.item.test.total;
            },
            testCreate:function () {
                return this.$store.state.item.test.todayCreate;
            },
        },
        components:{
            "page":page
        },
        methods:{

        }
    }
</script>
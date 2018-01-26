<template>
    <el-row class="row" style="margin-top: 10px" id="list">
        <el-tabs v-model="type" style="height: 50px;">
            <el-tab-pane name="interface" label="接口">
                <list type="interface"></list>
            </el-tab-pane>
            <el-tab-pane name="doc" label="文档">
                <list type="doc"></list>
            </el-tab-pane>
            <el-tab-pane name="test" label="测试">
                <list type="test"></list>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<style>
    #list .el-tabs__header {
        background-color: white;
    }
    #list .el-tabs__nav-scroll {
        padding-left: 20px;
        padding-right: 20px;
    }
    #list .el-tabs__header {
        margin-bottom: 5px;
    }
</style>

<script>
    var store=require("../../store")._modulesNamespaceMap["project/list/"].context;
    var list=require("./component/list.vue")
    var refresh=require("common/mixins/refresh");
    var sessionChange=require("common/mixins/session");
    module.exports = {
        data: function () {
            return {
                type:"interface"
            }
        },
        store:store,
        mixins:[sessionChange,refresh],
        components:{
            list:list
        },
        methods: {

        }
    }
</script>
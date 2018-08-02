<template>
    <el-row class="row test" style="margin-top: 10px;font-size: 14px">
        <switchproject style="position: absolute;top: 5px;right: 10px;z-index: 1000;font-size: 14px">
        </switchproject>
        <el-tabs v-model="type" style="height: 50px;">
            <el-tab-pane name="edit" label="编辑">
                <edit></edit>
            </el-tab-pane>
            <el-tab-pane name="setting" label="设置">
                <setting></setting>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>


<style>
    .test>.el-tabs>.el-tabs__content {
        background-color: rgb(248,248,248);
    }
    .test .el-tabs__header {
        background-color: white;
    }
    .test .el-tabs__nav-scroll {
        padding-left: 0px;
        padding-right: 0px;
    }
    .test .el-tabs__header {
        margin-bottom: 0px;
    }
</style>

<script>
    //var store=require("../../store")._modulesNamespaceMap["project/test/"].context;
    var sessionChange=require("common/mixins/session");
    var refresh=require("common/mixins/refresh");
    var switchProject=require("component/switchProject.vue");
    var expand=require("component/expand.vue")
    var edit=require("./component/edit.vue")
    var setting=require("./component/setting.vue")
    module.exports = {
        data: function () {
            return {
                type:"edit",
            }
        },
        store:function () {
            return $.getProjectStore("test/");
        },
        mixins:[sessionChange,refresh],
        components:{
            "switchproject":switchProject,
            "expand":expand,
            "edit":edit,
            "setting":setting
        },
        computed:{

        },
        methods: {

        }
    }
</script>
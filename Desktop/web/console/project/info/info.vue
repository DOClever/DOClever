<template>
    <el-row class="row" style="margin-top: 10px;height: calc(100% - 10px)" v-loading="loading" element-loading-text="DOClever,做最好的接口管理平台" element-loading-spinner="fa fa-2x fa-spinner fa-spin" element-loading-background="white">
        <switchproject style="position: absolute;top: 5px;right: 10px;z-index: 1000;font-size: 14px" v-if="!shareRole">
        </switchproject>
        <el-tabs v-model="type" style="height: 50px;" class="interfaceTab">
            <el-tab-pane :name="0" label="接口">
                <interface></interface>
            </el-tab-pane>
            <el-tab-pane :name="2" label="全局">
                <global></global>
            </el-tab-pane>
            <el-tab-pane :name="3" label="设置">
                <setting></setting>
            </el-tab-pane>
            <el-tab-pane :name="4">
                <span slot="label">版本{{session.versionName?("("+session.versionName+")"):""}}</span>
                <version></version>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<style>
    .interfaceTab .el-tabs__header {
        background-color: white;
        margin-bottom: 0px;
    }
    .interfaceTab .el-tabs__nav-scroll {
        padding-right: 20px;
    }
    .interfaceTab .el-tabs__content {
        background-color: rgb(248,249,248);
    }
</style>

<script>
    //var store=require("../store")._modulesNamespaceMap["info/"].context;
    var inter=require("./interface/interface.vue")
    var setting=require("./setting/setting.vue")
    var global=require("./global/global.vue")
    var version=require("./version/version.vue")
    var sessionChange=require("common/mixins/session");
    var refresh=require("common/mixins/refresh");
    var switchProject=require("component/switchProject.vue");
    module.exports = {
        data: function () {
            return {
                type:0,
                selProject:session.get("projectName"),
                timerSave:null
            }
        },
        mixins:[sessionChange,refresh],
        store:function () {
            return $.getProjectStore("info/");
        },
        components:{
            "interface":inter,
            "setting":setting,
            "global":global,
            "version":version,
            "switchproject":switchProject
        },
        computed:{
            shareRole:function () {
                return this.$store.getters.shareRole;
            }
        },
        methods: {

        },
        created:function () {

        },
    }
</script>
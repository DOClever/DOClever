<template>
    <el-row class="row projectListTab" style="margin-top: 10px;height: calc(100% - 10px);" v-loading="loading" element-loading-text="DOClever,做最好的接口管理平台" element-loading-spinner="fa fa-2x fa-spinner fa-spin" element-loading-background="white">
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
    .projectListTab>.el-tabs>.el-tabs__header {
        background-color: white;
        margin-bottom: 0px;
    }
    /*#list .el-tabs__nav-scroll {*/
        /*padding-left: 20px;*/
        /*padding-right: 20px;*/
    /*}*/
    .el-tabs .el-loading-text {
        margin-top: 20px;
        color: gray;
    }
</style>

<script>
    var list=require("./component/list.vue")
    //var refresh=require("common/mixins/refresh");
    //var sessionChange=require("common/mixins/session");
    module.exports = {
        props:["id"],
        data: function () {
            return {
                type:"interface",
                loading:false
            }
        },
        //mixins:[sessionChange],
        components:{
            list:list
        },
        store:function () {
            return $.getProjectStore("list/");
        },
        methods: {
            refresh:async function () {
                this.loading=true;
                await this.$store.dispatch("init");
                this.loading=false;
            }
        },
        created:function () {
            this.$store.getters.event.$on("refreshProjectList",this.refresh);
            this.$store.commit("setTeamId",this.id==1?"":this.id);
            this.refresh();
        },
        beforeDestroyed:function () {
            this.$store.getters.event.$off("refreshProjectList",this.refresh);
        }
    }
</script>
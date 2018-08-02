<template>
    <el-row class="row" style="font-size: 14px" id="teamInfo" v-loading="loading">
        <el-tabs v-model="type" style="height: 50px;">
            <el-tab-pane :name="0" label="概况">
                <teaminfo></teaminfo>
            </el-tab-pane>
            <el-tab-pane :name="1" label="成员">
                <teamuser></teamuser>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<style>
    #teamInfo .el-tabs__header {
        background-color: white;
    }
    #teamInfo .el-tabs__nav-scroll {
        padding-left: 20px;
        padding-right: 20px;
    }
    #teamInfo .el-tabs__header {
        margin-bottom: 5px;
    }
</style>

<script>
    var teamInfo=require("./component/teamInfo.vue");
    var teamUser=require("./component/teamUser.vue");
    var refresh=require("common/mixins/refresh");
    module.exports = {
        props:["teamId"],
        data: function () {
            return {
                type:0
            }
        },
        mixins:[refresh],
        store:function () {
            let obj=new Vuex.Store(require("./store"));
            return obj;
        },
        components:{
            "teaminfo":teamInfo,
            "teamuser":teamUser

        },
        methods: {
            updateTeamProjectList:function (list) {
                this.$store.state.project=list;
            }
        },
        beforeCreate:function () {
            this.$store.commit("setTeamId",this.$options.propsData.teamId);
        },
        created:function () {
            this.$store.getters.event.$on("updateTeamProjectList",this.updateTeamProjectList)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("updateTeamProjectList",this.updateTeamProjectList)
        }
    }
</script>
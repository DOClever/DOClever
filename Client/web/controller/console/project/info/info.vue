<template>
    <el-row class="row" style="margin-top: 10px">
        <div style="position: absolute;top: 5px;right: 10px;z-index: 1000;font-size: 14px" v-if="!shareRole">
            项目：&nbsp;
            <el-autocomplete size="mini" v-model="selProject" :fetch-suggestions="querySearch" placeholder="筛选你的项目" @select="changeProject" popper-class="my-autocomplete" id="projectChange">
                <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete"></i>
                <template slot-scope="props">
                    <div class="value">{{ props.item.value }}</div>
                    <span class="remark">{{ props.item.remark }}</span>
                </template>
            </el-autocomplete>
        </div>
        <el-tabs v-model="type" style="height: 50px;" id="interfaceTab">
            <el-tab-pane :name="0" label="接口">
                <interface></interface>
            </el-tab-pane>
            <el-tab-pane :name="1" label="测试">
                <test></test>
            </el-tab-pane>
            <el-tab-pane :name="2" label="全局">
                <global></global>
            </el-tab-pane>
            <el-tab-pane :name="3" label="设置">
                <setting></setting>
            </el-tab-pane>
            <el-tab-pane :name="4" label="版本">
                <version></version>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<style>
    #interfaceTab .el-tabs__header {
        background-color: white;
    }
    #interfaceTab .el-tabs__nav-scroll {
        padding-left: 20px;
        padding-right: 20px;
    }
    #interfaceTab .el-tabs__header {
        margin-bottom: 5px;
    }
</style>

<script>
    var store=require("../../store")._modulesNamespaceMap["project/info/"].context;
    var inter=require("./interface/interface.vue")
    var setting=require("./setting/setting.vue")
    var global=require("./global/global.vue")
    var test=require("./test/test.vue")
    var version=require("./version/version.vue")
    var sessionChange=require("common/mixins/session");
    var refresh=require("common/mixins/refresh");
    module.exports = {
        data: function () {
            return {
                type:0,
                selProject:session.get("projectName"),
                timerSave:null
            }
        },
        store:store,
        mixins:[sessionChange,refresh],
        components:{
            "interface":inter,
            "setting":setting,
            "global":global,
            "test":test,
            "version":version
        },
        computed:{
            shareRole:function () {
                return this.$store.getters.shareRole;
            }
        },
        methods: {
            querySearch:function (queryString,cb) {
                var _this=this;
                var query={
                    name:""
                }
                if(_this.session.teamId)
                {
                    query.team=_this.session.teamId
                }
                net.get("/project/filterlist",query).then(function (data) {
                    if(data.code==200)
                    {
                        var results=data.data.map(function (obj) {
                            return {
                                value:obj.name,
                                remark:obj.dis!="undefined"?obj.dis:"",
                                id:obj._id,
                                own:obj.own,
                                role:obj.role
                            }
                        })
                        cb(results);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                        cb([]);
                    }
                })
            },
            showAutoComplete:function (event) {
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
            },
            changeProject:function (obj) {
                $.startLoading(1);
                store.dispatch("switchProject",obj).then(function () {
                    $.stopLoading();
                })
            },
        },
        created:function () {

        },
    }
</script>
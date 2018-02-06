<template>
    <el-row class="row" style="padding: 0 10px 0 10px;">
        <el-col class="col" :span="bMax?0:6" style="padding-right: 5px;">
            <el-row class="row" style="height: 35px;line-height: 35px">
                <el-tooltip class="item" effect="dark" content="新增分组" placement="bottom">
                    <el-button size="mini" type="primary" @click.native="addGroup" v-if="interfaceEditRole">
                        <i class="el-icon-plus" style="font-weight:900"></i>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="导入分组" placement="bottom" v-if="interfaceEditRole">
                    <el-button size="mini" type="primary" style="margin-left: 3px" @click.native="importGroup">
                        <i class="el-icon-download" style="font-weight:900"></i>
                    </el-button>
                </el-tooltip>
                <el-dropdown trigger="hover" @command="quickTest">
                    <div class="el-dropdown-link">
                        <el-button size="mini" type="primary" icon="fa fa-bolt" plain>
                        </el-button>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="1">新用例</el-dropdown-item>
                        <el-dropdown-item :command="2">已有用例</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="hover">
                    <div class="el-dropdown-link">
                        <el-button size="mini" icon="fa fa-sort-amount-desc">
                        </el-button>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><div @click="sortType=0"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==0"></i>&nbsp;名称</div></el-dropdown-item>
                        <el-dropdown-item><div @click="sortType=1"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==1"></i>&nbsp;修改时间</div></el-dropdown-item>
                        <el-dropdown-item><el-tooltip class="item" effect="dark" content="自定义排序下可以拖动接口或分组来排序" placement="right"><div @click="sortType=2"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==2"></i>&nbsp;自定义</div></el-tooltip></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-row>
            <el-row class="row" style="background-color: white;padding: 5px;border-radius: 5px;height: calc(100vh - 150px);overflow-y: auto;margin-top: 5px">
                <el-input size="small" placeholder="请输入查找的接口" style="width: 100%;margin-bottom: 10px" v-model="searchText" @input="searchInterface">
                    <template slot="prepend">
                        <el-select v-model="searchType" @input="searchInterface" style="width: 60px" id="searchInterface">
                            <el-option :value="0" label="名称"></el-option>
                            <el-option :value="1" label="路径"></el-option>
                        </el-select>
                    </template>
                </el-input>
                <list></list>
            </el-row>
        </el-col>
        <el-col :span="bMax?24:18" class="col" id="interfaceContent" style="height: calc(100vh - 110px);">
            <el-row class="row" v-if="interfaceEdit">
                <transition name="component-fade" mode="out-in">
                    <run v-if="$store.state.type=='run'" ref="run" :interface-edit="runInterfaceEdit" :index="$store.state.index" @save="$store.dispatch('newInterface');"></run>
                    <keep-alive>
                        <edit v-if="$store.state.type=='edit'" ref="edit"></edit>
                        <preview v-if="$store.state.type=='preview'" ref="preview"></preview>
                    </keep-alive>
                </transition>
            </el-row>
        </el-col>
    </el-row>
</template>

<style>
    #searchInterface {
        padding-left: 5px;
        padding-right: 5px;
    }
    #interfaceContent .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    #interfaceContent .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active for below version 2.1.8 */ {
        opacity: 0;
    }
</style>

<script>
    var store=require("../../../store")._modulesNamespaceMap["project/info/interface/"].context;
    var con=require("common/js/config");
    var sessionChange=require("common/mixins/session");
    var list=require("./component/interfaceList.vue");
    var edit=require("./component/edit.vue");
    var preview=require("./component/preview.vue");
    var run=require("./run/run.vue")
    module.exports = {
        data: function () {
            return {
                bMax:false,
                sortType:session.get("sort")?session.get("sort"):0,
            }
        },
        components:{
            "list":list,
            "edit":edit,
            "preview":preview,
            "run":run
        },
        store:store,
        watch:{
            sortType:function (val) {
                session.set("sort",val);
                $.startHud("#body");
                this.$store.dispatch("refresh").then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        computed:{
            runInterfaceEdit:function () {
                var obj=$.clone(this.interfaceEdit);
                obj.param=$.clone(this.$store.state.param);
                return obj;
            },
            interfaceEditRole:function () {
                return this.$store.getters.interfaceEditRole
            },
            searchText:{
                get:function () {
                    return store.state.searchText;
                },
                set:function (val) {
                    store.commit("setSearchText",val)
                }
            },
            searchType:{
                get:function () {
                    return store.state.searchType;
                },
                set:function (val) {
                    store.commit("setSearchType",val)
                }
            },
            interfaceEdit:function () {
                return store.state.interfaceEdit
            },
            interfaceList:function () {
                return store.state.interfaceList
            },
        },
        methods:{
            addGroup:function () {
                $.input("请输入分组名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入分组名称",0);
                        return false
                    }
                    var query={};
                    query.id=session.get("projectId");
                    query.name=val.value;
                    $.startHud("#body");
                    store.dispatch("addGroup",{
                        query:query
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("新建成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                });
            },
            methodColor:function (val) {
                return helper.methodColor(val);
            },
            searchInterface:function () {
                store.commit("searchInterface");
            },
            cancelSearch:function () {
                store.commit("setSearch",false);
                store.commit("setSearchText","");
                store.commit("setSearchType",0);
                store.commit("setInterfaceSearchList",[]);
            },
            importGroup:function () {
                $.inputMul(this,"请输入DOClever导出分组的JSON",function (val) {
                    if(!val)
                    {
                        $.tip("请输入JSON",0);
                        return false;
                    }
                    $.startHud();
                    net.post("/group/importjson",{
                        id:session.get("projectId"),
                        json:val
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("导入成功",1);
                            store.commit("initInterfaceList",data.data);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            initStatus:function (data) {
                store.commit("setStatus",data);
            },
            toggleMax:function (data) {
                this.bMax=!this.bMax
            },
            quickTest:function (command) {
                var _this=this;
                if(command==1)
                {
                    $.startHud();
                    net.get("/test/allgrouplist").then(function (data) {
                        $.stopHud();
                        if(data.code!=200)
                        {
                            $.notify(data.msg,0);
                        }
                        $.showBox(_this,require("./test/test.vue"),{
                            testType:1,
                            propTestGroupList:data.data,
                        });
                    })
                }
                else if(command==2)
                {
                    $.startHud();
                    net.get("/test/alllist").then(function (data) {
                        $.stopHud();
                        if(data.code!=200)
                        {
                            $.notify(data.msg,0);
                        }
                        $.showBox(_this,require("./test/test.vue"),{
                            testType:2,
                            propArrTest:data.data
                        });
                    })
                }
            }
        },
        created:function () {
            var _this=this;
            store.getters.event.$on("initStatus",this.initStatus)
            store.getters.event.$on("toggleMax",this.toggleMax)
        },
        beforeDestroy:function () {
            store.getters.event.$off("initStatus",this.initStatus)
            store.getters.event.$off("toggleMax",this.toggleMax)
        }
    }
</script>
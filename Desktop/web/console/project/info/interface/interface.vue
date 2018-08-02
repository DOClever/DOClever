<template>
    <el-row class="row" style="padding: 0 10px 0 10px;margin-top: 5px">
        <el-row class="row" style="height: 35px;line-height: 35px">
            <el-button class="btnMini" size="mini" type="primary" @click.native="addGroup" v-if="interfaceEditRole" icon="el-icon-plus">
                新增分组
            </el-button>
            <el-button class="btnMini" size="mini" type="primary" style="margin-left: 3px" @click.native="importGroup" icon="el-icon-download">
                导入分组
            </el-button>
            <el-dropdown trigger="hover" @command="quickTest">
                <div class="el-dropdown-link">
                    <el-button class="btnMini" size="mini" type="primary" icon="fa fa-bolt" plain>
                        快速测试
                    </el-button>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="1">新用例</el-dropdown-item>
                    <el-dropdown-item :command="2">已有用例</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="hover">
                <div class="el-dropdown-link">
                    <el-button class="btnMini" size="mini" icon="fa fa-sort-amount-desc">
                        排序
                    </el-button>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><div @click="sortType=0"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==0"></i>&nbsp;名称</div></el-dropdown-item>
                    <el-dropdown-item><div @click="sortType=1"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==1"></i>&nbsp;修改时间</div></el-dropdown-item>
                    <el-dropdown-item><el-tooltip class="item" effect="dark" content="自定义排序下可以拖动接口或分组来排序" placement="right"><div @click="sortType=2"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==2"></i>&nbsp;自定义</div></el-tooltip></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip class="item" effect="dark" content="启用自动保存后，每5秒自动保存当前接口编辑信息" placement="bottom">
                <el-checkbox v-model="$store.state.autoSave" :true-label="1" :false-label="0" style="font-size: 14px;margin-left: 10px">自动保存</el-checkbox>
            </el-tooltip>
            <el-button size="mini" type="text" icon="fa fa-arrows-alt" style="margin-left: 5px;font-size: 15px" title="放大/缩小" @click="$store.getters.event.$emit('toggleMax')"></el-button>
        </el-row>
        <el-row class="row" style="height: calc(100% - 35px);">
            <el-col class="col" :span="bMax?0:6" style="padding-right: 5px;">
                <el-row class="row" style="background-color: white;padding: 5px;border-radius: 5px;height: calc(100vh - 211px);overflow-y: auto;margin-top: 5px">
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
            <el-col :span="bMax?24:18" class="col" id="interfaceContent" style="padding-top: 5px;height: calc(100vh - 209px)">
                <el-tabs type="border-card" v-if="tabList.length>0" v-model="selTabId" class="interfaceTab" @tab-click="handleTabClick">
                    <el-tab-pane v-for="(item,index) in tabList" :name="item._id" :label="item.name" :key="item">
                        <el-row class="row" slot="label" style="font-size: 13px">{{item.name}}&nbsp;<i class="el-icon-close" @click.stop="closeTab(item,index)"></i></el-row>
                        <item :item="item"></item>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
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
    .interfaceTab .el-tabs--border-card>.el-tabs__content {
        padding: 0;
    }
</style>

<script>
    //var store=require("../../../store")._modulesNamespaceMap["project/info/interface/"].context;
    var con=require("common/js/config");
    var sessionChange=require("common/mixins/session");
    var list=require("./component/interfaceList.vue");
    var item=require("./item/item.vue");
    var arrState=["snapshotId","snapshotDis","snapshotCreator","snapshotDate"];
    module.exports = {
        data: function () {
            return {
                bMax:false,
                sortType:session.get("sort")?session.get("sort"):0,
                timerSave:null,
            }
        },
        components:{
            "list":list,
            "item":item
        },
        store:function () {
            return $.getProjectStore("info/interface/");
        },
        watch:{
            sortType:function (val) {
                session.set("sort",val);
                $.startHud("#body");
                this.$store.dispatch("refresh").then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            "$store.state.autoSave":function (val) {
                if(val==0)
                {
                    if(this.timerSave)
                    {
                        clearInterval(this.timerSave);
                        this.timerSave=null;
                        session.remove("autosave")
                    }
                }
                else
                {
                    if(!this.timerSave)
                    {
                        var _this=this;
                        this.timerSave=setInterval(function autoSave() {
                            if(_this.$store.state.autoSave==0)
                            {
                                clearInterval(_this.timerSave);
                                _this.timerSave=null;
                                session.remove("autosave")
                                return
                            }
                            _this.$store.getters.event.$emit("saveInterface")
                        },5000);
                        session.set("autosave","1")
                    }
                }
            },
        },
        computed:{
            selTabId:{
                get:function () {
                    return this.$store.state.selTabId;
                },
                set:function (val) {
                    if(this.tabList.length==0)
                    {
                        return;
                    }
                    let obj;
                    for(let o of this.tabList)
                    {
                        if(val==o._id)
                        {
                            obj=o;
                            break;
                        }
                    }
                    if(!obj.sessionInfo)
                    {
                        obj.sessionInfo={};
                    }
                    session.set("lockSnapshot","1")
                    for(let key of  arrState)
                    {
                        if(obj.sessionInfo[key])
                        {
                            session.set(key,obj.sessionInfo[key]);
                        }
                        else
                        {
                            session.remove(key);
                        }
                    }
                    session.remove("lockSnapshot")
                    this.$store.state.selTabId=val;
                }
            },
            tabList:function () {
                return this.$store.state.tabList;
            },
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
                    return this.$store.state.searchText;
                },
                set:function (val) {
                    this.$store.commit("setSearchText",val)
                }
            },
            searchType:{
                get:function () {
                    return this.$store.state.searchType;
                },
                set:function (val) {
                    this.$store.commit("setSearchType",val)
                }
            },
            interfaceEdit:function () {
                return this.$store.state.interfaceEdit
            },
            interface:function () {
                return this.$store.state.interface
            },
        },
        methods:{
            addGroup:function () {
                var _this=this;
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
                    _this.$store.dispatch("addGroup",{
                        query:query
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("新建成功",1)
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                });
            },
            methodColor:function (val) {
                return helper.methodColor(val);
            },
            searchInterface:function () {
                this.$store.commit("searchInterface");
            },
            cancelSearch:function () {
                this.$store.commit("setSearch",false);
                this.$store.commit("setSearchText","");
                this.$store.commit("setSearchType",0);
                this.$store.commit("setInterfaceSearchList",[]);
            },
            importGroup:function () {
                var _this=this;
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
                            $.tip("导入成功",1);
                            _this.$store.commit("initInterfaceList",data.data);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            initStatus:function (data) {
                this.$store.commit("setStatus",data);
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
                            $.tip(data.msg,0);
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
                            $.tip(data.msg,0);
                        }
                        $.showBox(_this,require("./test/test.vue"),{
                            testType:2,
                            propArrTest:data.data
                        });
                    })
                }
            },
            closeTab:function (item,index) {
                this.tabList.splice(index,1);
                delete item.sessionInfo;
                if(this.selTabId!=item._id)
                {
                    return;
                }
                else
                {
                    if(item.sessionInfo)
                    {
                        for(let o of arrState)
                        {
                            if(item.sessionInfo[o])
                            {
                                session.remove(o);
                            }
                        }
                    }
                }
                if(this.tabList.length>0)
                {
                    let obj,id=this.selTabId;
                    if(index==this.tabList.length)
                    {
                        obj=this.tabList[index-1];
                        this.selTabId=this.tabList[index-1]._id
                    }
                    else
                    {
                        obj=this.tabList[index-1];
                        this.selTabId=this.tabList[index]._id
                    }
                    if(id==item._id)
                    {
                        if(this.$store.state.interface)
                        {
                            this.$store.state.interface.select=0;
                        }
                        this.$store.state.interface=obj;
                        this.$store.state.interface.select=1;
                    }
                }
                else
                {
                    if(this.$store.state.interface)
                    {
                        this.$store.state.interface.select=0;
                        this.$store.state.interface=null;
                    }
                    this.selTabId=""
                }
            },
            handleTabClick:function (tab) {
                var _this=this;
                var ret=(function _map1(list) {
                    for(var i=0;i<list.length;i++)
                    {
                        var obj=list[i];
                        if(obj.data)
                        {
                            var ret=arguments.callee(obj.data);
                            if(ret)
                            {
                                obj.show=1;
                                return true;
                            }
                        }
                        else
                        {
                            if(obj._id==tab.name)
                            {
                                if( _this.$store.state.interface)
                                {
                                    _this.$store.state.interface.select=0;
                                }
                                _this.$store.state.interface=obj;
                                obj.select=1;
                                return true;
                            }
                        }
                    }
                    return false;
                })(this.$store.state.interfaceList);
                if(!ret)
                {
                    if( _this.$store.state.interface)
                    {
                        _this.$store.state.interface.select=0;
                    }
                    this.$store.state.interface=null;
                }
            },
            sessionChange:function (event) {
                if(this.$store.getters.projectId==session.get("projectId"))
                {
                    if(arrState.includes(event.key))
                    {
                        let obj;
                        for(let o of this.tabList)
                        {
                            if(this.selTabId==o._id)
                            {
                                obj=o;
                                break;
                            }
                        }
                        if(obj && obj.sessionInfo && !session.get("lockSnapshot"))
                        {
                            obj.sessionInfo[event.key]=event.value;
                        }
                    }
                }
            },
            sessionRemove:function (event) {
                if(this.$store.getters.projectId==session.get("projectId"))
                {
                    if(arrState.includes(event.key))
                    {
                        let obj;
                        for(let o of this.tabList)
                        {
                            if(this.selTabId==o._id)
                            {
                                obj=o;
                                break;
                            }
                        }
                        if(obj && obj.sessionInfo && !session.get("lockSnapshot"))
                        {
                            delete obj.sessionInfo[event.key]
                        }
                    }
                }
            }
        },
        created:function () {
            var _this=this;
            this.$store.commit("init");
            this.$store.getters.event.$on("initStatus",this.initStatus)
            this.$store.getters.event.$on("toggleMax",this.toggleMax)
            document.addEventListener("sessionChange",this.sessionChange)
            document.addEventListener("sessionRemove",this.sessionRemove)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("initStatus",this.initStatus)
            this.$store.getters.event.$off("toggleMax",this.toggleMax)
            document.removeEventListener("sessionChange",this.sessionChange)
            document.removeEventListener("sessionRemove",this.sessionRemove)
            if(this.timerSave)
            {
                clearTimeout(this.timerSave);
                this.timerSave=null;
            }
        }
    }
</script>
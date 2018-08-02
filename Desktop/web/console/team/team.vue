<template>
    <el-row class="row" style="height: 100%">
        <el-col class="col" style="width: 200px;text-align: center;border-right: 1px solid #ccc;box-shadow: 1px 2px 5px 0 #ccc;color: rgba(0,0,0,0.65);background-color: white" v-if="showTeam">
            <el-row class="row" style="height: 50px;line-height: 50px;border-bottom: 1px solid #ccc;text-align: left;padding-left: 20px;cursor: pointer" @click.native="teamProjectList">
                <i class="fa fa-credit-card"></i>&nbsp;
                个人
            </el-row>
            <el-row class="row" style="height: 50px;line-height: 50px;border-bottom: 1px solid #ccc;text-align: left;padding-left: 20px;cursor: pointer" @click.native="showCreate=!showCreate" @mouseenter.native="mouseCreate=1" @mouseleave.native="mouseCreate=0" :style="{boxShadow: showCreate?'0 0 3px 1px rgba(0,0,0,.18)':''}">
                <i class="fa fa-credit-card"></i>&nbsp;
                我创建的团队({{arrCreate.length}})
                <el-dropdown trigger="hover" style="float: right;margin-right: 10px;">
                    <div class="el-dropdown-link">
                        <i class="fa fa-sort-amount-asc" style="cursor: pointer;color: gray" v-if="mouseCreate" title="排序"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><div @click="sortCreateType=0"><i class="el-icon-check" style="color: #11b95c" v-if="sortCreateType==0"></i>&nbsp;名称</div></el-dropdown-item>
                        <el-dropdown-item><div @click="sortCreateType=1"><i class="el-icon-check" style="color: #11b95c" v-if="sortCreateType==1"></i>&nbsp;时间</div></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <i class="fa fa-plus" style="cursor: pointer;float: right;margin-top: 18px;margin-right: 10px;color: gray" v-if="mouseCreate" title="创建团队" @click.stop="showAdd=true"></i>
            </el-row>
            <el-collapse-transition>
                <div class="row" v-show="showCreate">
                    <el-row class="row hover" v-for="(item,index) in arrCreate" style="height: 50px;line-height: 50px;text-align: center;cursor: pointer;" :style="{borderBottom:'1px lightgray solid'}" @click.native="teamProjectList(item,index)">
                        <el-col class="col" style="width: 170px;text-align: left;padding-left: 20px">
                            <el-row class="row" style="height: 30px;line-height: 30px;background-color: transparent">
                                {{item.name}}
                            </el-row>
                            <el-row class="row" style="height: 20px;line-height: 20px;font-size: 12px;color: gray;background-color: transparent">
                                成员:{{item.userCount}}&nbsp;项目:{{item.projectCount+item.docCount+item.testCount}}
                            </el-row>
                        </el-col>
                        <el-col class="col" style="width: 29px">
                            <el-dropdown @command="handleCommand">
                                <i class="el-icon-more"></i>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="showTeamInfo(item)">团队详情</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>
                </div>
            </el-collapse-transition>
            <el-row class="row" style="height: 50px;line-height: 50px;border-bottom: 1px solid #ccc;text-align: left;padding-left: 20px;cursor: pointer" @click.native="showJoin=!showJoin" @mouseenter.native="mouseJoin=1" @mouseleave.native="mouseJoin=0" :style="{boxShadow: showJoin?'0 0 3px 1px rgba(0,0,0,.18)':''}">
                <i class="fa fa-credit-card"></i>&nbsp;
                我加入的团队({{arrJoin.length}})
                <el-dropdown trigger="hover" style="float: right;margin-right: 10px;">
                    <div class="el-dropdown-link">
                        <i class="fa fa-sort-amount-asc" style="cursor: pointer;color: gray" v-if="mouseJoin" title="排序"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><div @click="sortCreateType=0"><i class="el-icon-check" style="color: #11b95c" v-if="sortCreateType==0"></i>&nbsp;名称</div></el-dropdown-item>
                        <el-dropdown-item><div @click="sortCreateType=1"><i class="el-icon-check" style="color: #11b95c" v-if="sortCreateType==1"></i>&nbsp;时间</div></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <i class="fa fa-user-plus" style="cursor: pointer;float: right;margin-top: 18px;margin-right: 10px;color: gray" v-if="mouseJoin" title="加入团队" @click.stop="showApply=true"></i>
            </el-row>
            <el-collapse-transition>
                <div class="row" v-show="showJoin">
                    <el-row class="row hover" v-for="(item,index) in arrJoin" style="height: 50px;line-height: 50px;text-align: center;cursor: pointer" :style="{borderBottom:'1px lightgray solid'}" @click.native="teamProjectList(item,index)">
                        <el-col class="col" style="width: 170px;text-align: left;padding-left: 20px">
                            <el-row class="row" style="height: 30px;line-height: 30px;background-color: transparent">
                                {{item.name}}
                            </el-row>
                            <el-row class="row" style="height: 20px;line-height: 20px;font-size: 12px;color: gray;background-color: transparent">
                                成员:{{item.userCount}}&nbsp;项目:{{item.projectCount+item.docCount+item.testCount}}
                            </el-row>
                        </el-col>
                        <el-col class="col" style="width: 29px">
                            <el-dropdown @command="handleCommand">
                                <i class="el-icon-more"></i>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="showTeamInfo(item)">团队详情</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>
                </div>
            </el-collapse-transition>
        </el-col>
        <el-col class="col" style="padding: 10px" :style="{width:showTeam?'calc(100vw - 200px)':'100%'}">
            <div class="fa el-icon-back fa-lg" style="position: absolute;top:20px;right: 40px;z-index: 1000;color: #00adef;cursor: pointer;font-weight: 900" @click="back" v-if="showBack"></div>
            <el-tabs v-model="tabSelId" type="border-card" style="height: calc(100vh - 80px);" class="teamTabClass">
                <el-tab-pane v-for="(item,index) in tabList" :name="item._id" :key="item">
                    <el-row class="row" slot="label" style="font-size: 13px">{{item.name}}&nbsp;<i class="el-icon-close" @click.stop="closeTab(item,index)"></i></el-row>
                    <project :id="item._id" v-if="item.type==0"></project>
                    <webview :src="item.url" style="display:inline-flex; width: 100%;height: 100%;box-sizing: content-box" v-if="item.type==1"></webview>
                </el-tab-pane>
            </el-tabs>
        </el-col>
        <div style="width: 15px;height: 151px;background-repeat: no-repeat;position: absolute;top: calc(50vh - 75px);opacity: 0.3;cursor: pointer" :style="{backgroundImage:'url('+sizeImg+')',left:showTeam?'200px':'0px',backgroundPosition:showTeam?'0 0':'0 -151px'}" @click="showTeam=!showTeam" @mouseenter="$event.target.style.opacity='0.5'" @mouseleave="$event.target.style.opacity='0.3'"></div>
        <el-dialog title="新建团队" :visible.sync="showAdd" width="50%" append-to-body>
            <el-form label-position="top" ref="form" label-width="100px">
                <el-form-item label="名称">
                    <el-input size="small" style="width: 100%"  v-model="name" placeholder="请输入新团队的名称"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input size="small" type="textarea" :rows="2"  style="width: 100%"  v-model="dis" placeholder="请输入新团队的简介"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showAdd = false">取 消</el-button>
            <el-button type="primary" @click="addTeam" :loading="addPending">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="团队申请" :visible.sync="showApply" width="50%" ref="apply" append-to-body>
            <el-form ref="form" label-width="100px">
                <el-form-item label="团队ID">
                    <el-input size="small" style="width: 80%"  v-model="applyName" placeholder="请输入你要申请的团队ID"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input size="small" type="textarea" :rows="2"  style="width: 80%"  v-model="applyDis" placeholder="请输入你要申请的备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showApply = false">取 消</el-button>
            <el-button type="primary" @click="applyTeam" :loading="applyPending">确 定</el-button>
        </span>
        </el-dialog>
    </el-row>
</template>

<style>
    .hover:hover {
        background-color: #ebebeb;
    }
    .teamTabClass>.el-tabs__content {
        height: calc(100vh - 119px);
        padding: 0;
    }
    .teamTabClass>.el-tabs__content>.el-tab-pane {
        height: 100%;
    }
    .teamTabClass>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll {
        padding-right: 50px;
    }
</style>

<script>
    var store=require("../store")._modulesNamespaceMap["team/"].context;
    var sessionChange=require("common/mixins/session");
    //var info=require("./info/info.vue");
    var project=require("../project/project.vue");
    var arrState=["snapshotId","snapshotDis","snapshotCreator","snapshotDate","versionId","versionName","versionDis","projectType","projectId","projectName"];
    module.exports = {
        data: function () {
            return {
                sizeImg:require("../resource/pic/side.png"),
                mouseJoin:0,
                mouseCreate:0,
                showCreate:false,
                showJoin:false,
                showAdd:false,
                name:"",
                dis:"",
                addPending:false,
                showApply:false,
                applyPending:false,
                applyName:"",
                applyDis:"",
                showTeam:true,
            }
        },
        computed:{
            showBack:function()
            {
                let obj;
                for(let o of this.tabList)
                {
                    if(this.tabSelId==o._id)
                    {
                        obj=o;
                        break;
                    }
                }
                if(obj)
                {
                    if(obj.type==1)
                    {
                        return true;
                    }
                    else
                    {
                        if(this.session.projectId)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    return false;
                }
            },
            tabSelId:{
                get:function () {
                    return this.$store.state.tabSelId;
                },
                set:function (val) {
                    if(this.tabList.length==0)
                    {
                        return;
                    }
                    let oldValue=this.$store.state.tabSelId;
                    if(oldValue!=2)
                    {
                        let objOld;
                        for(let o of this.tabList)
                        {
                            if(oldValue==o._id)
                            {
                                objOld=o;
                                break;
                            }
                        }
                        if(objOld)
                        {
                            for(let key of arrState)
                            {
                                if(session.get(key))
                                {
                                    objOld.sessionInfo[key]=session.get(key);
                                }
                                else
                                {
                                    delete objOld.sessionInfo[key];
                                }
                            }
                        }
                    }
                    if(val!=2)
                    {
                        let obj;
                        for(let o of this.tabList)
                        {
                            if(val==o._id)
                            {
                                obj=o;
                                break;
                            }
                        }
                        if(val!=1)
                        {
                            session.set("teamId",val);
                            session.set("teamName",obj.name);
                        }
                        else
                        {
                            session.remove("teamId");
                            session.remove("teamName");
                        }
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
                    }
                    else
                    {
                        session.remove("teamId");
                        session.remove("teamName");
                    }
                    this.$store.state.tabSelId=val;
                }
            },
            tabList:function () {
                return this.$store.state.tabList;
            },
            arrCreate:function () {
                return this.$store.state.teamCreateList
            },
            arrJoin:function () {
                return this.$store.state.teamJoinList
            },
            sortCreateType:{
                get:function () {
                    return this.$store.state.teamCreateSort
                },
                set:function (val) {
                    this.$store.commit("changeTeamCreateSort",val);
                }
            },
            sortJoinType:{
                get:function () {
                    return this.$store.state.teamJoinSort
                },
                set:function (val) {
                    this.$store.commit("changeTeamJoinSort",val);
                }
            }
        },
        mixins:[sessionChange],
        store:store,
        components:{
            //"info":info,
            "project":project
        },
        methods: {
            addTeam:function () {
                if(!this.name)
                {
                    this.$message.error("请输入名称");
                    return;
                }
                var _this=this;
                this.addPending=true;
                store.dispatch("addTeam",{
                    name:this.name,
                    dis:this.dis
                }).then(function (data) {
                    _this.addPending=false;
                    _this.name="";
                    _this.dis=""
                    if(data.code==200)
                    {
                        $.tip("创建成功",1);
                        helper.addPoint("addTeam","新建团队");
                        _this.showAdd=false;
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            applyTeam:function () {
                if(!this.applyName)
                {
                    $.tip("请输入团队ID",0);
                    return;
                }
                this.applyPending=true;
                var _this=this;
                net.put("/team/userapply",{
                    id:this.applyName,
                    dis:this.applyDis
                }).then(function (data) {
                    _this.applyPending=false;
                    _this.applyName="";
                    _this.applyDis=""
                    if(data.code==200)
                    {
                        $.tip("请求已发送，等待团队管理员响应",1);
                        _this.showApply=false;
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            closeTab:function (item,index) {
                this.tabList.splice(index,1);
                if(this.tabSelId!=item._id)
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
                    if(index==this.tabList.length)
                    {
                        this.tabSelId=this.tabList[index-1]._id
                    }
                    else
                    {
                        this.tabSelId=this.tabList[index]._id
                    }
                }
                else
                {
                    this.tabSelId=""
                }
            },
            teamProjectList:function(item,index)
            {
                if(index===undefined)
                {
                    item={
                        _id:1,
                        name:"个人",
                        type:0,
                        sessionInfo:{}
                    }
                }
                let bFind=false;
                for(let o of this.tabList)
                {
                    if(o._id==item._id)
                    {
                        bFind=true;
                        break;
                    }
                }
                if(!bFind)
                {
                    this.tabList.push(item);
                }
                this.tabSelId=item._id;
            },
            showTeamInfo:function (item) {
                $.showSider(this.$root,require("./info/info.vue"),item.name,"50%",{
                    teamId:item._id
                });
            },
            back:function () {
                let obj;
                for(let o of this.tabList)
                {
                    if(this.tabSelId==o._id)
                    {
                        obj=o;
                        break;
                    }
                }
                if(obj.type==1)
                {
                    let web=document.querySelector("webview");
                    if(web.canGoBack())
                    {
                        web.goBack();
                    }
                }
                else
                {
                    let store=$.getProjectStore();
                    store.dispatch("changeToList",null,{
                        root:true
                    })
                }
            }
        },
    }
</script>
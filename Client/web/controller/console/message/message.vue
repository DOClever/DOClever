<template>
    <el-row class="row" style="margin-top: 10px" id="message">
        <el-button icon="el-icon-refresh" size="mini" type="text" style="position: absolute;top: 5px;right: 20px;z-index: 1000;font-size: 14px" title="刷新" @click="refresh">
        </el-button>
        <el-button icon="el-icon-delete" size="mini" type="text" style="position: absolute;top: 5px;right: 50px;z-index: 1000;font-size: 14px;color: red" title="清空" @click="clear" v-if="type==1 && arr.length>0">
        </el-button>
        <el-tabs v-model="type" style="height: 50px;" id="interfaceTab">
            <el-tab-pane :name="0">
                <span slot="label">{{unHandleLabel}}</span>
                <el-row class="row" style="padding: 10px 10px 50px 10px;overflow-y: auto;height: calc(100vh - 115px)">
                    <expand style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);">
                        <div slot="title">{{"团队邀请您("+$store.getters.teamPullUserLength+")"}}</div>
                        <table class="table-hover" style="width: 100%">
                            <template v-for="item in $store.state.arrTeamPullUser">
                                <tr class="row"  style="height: 40px;vertical-align: middle;text-align: center">
                                    <td style="width: 70%">
                                        团队<span style="color: #00adef">{{item.from?item.from.name:""}}</span>邀请你加入
                                    </td>
                                    <td style="width: 30%">
                                        <template v-if="item.handle==0">
                                            <el-button size="mini" type="primary" @click="handleTeamPullUser(item,1)">
                                                同意
                                            </el-button>&nbsp;&nbsp;
                                            <el-button size="mini" type="danger" @click="handleTeamPullUser(item,2)">
                                                拒绝
                                            </el-button>
                                        </template>
                                        <span v-else-if="item.handle==1">
                                            已同意
                                        </span>
                                        <span v-else-if="item.handle==2">
                                            已拒绝
                                        </span>
                                        <span v-else>
                                            已忽略
                                        </span>
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </expand>
                    <expand style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);margin-top: 15px;">
                        <div slot="title">{{"团队邀请您的项目("+$store.getters.teamPullProjectLength+")"}}</div>
                        <table class="table-hover" style="width: 100%">
                            <template v-for="item in $store.state.arrTeamPullProject">
                                <tr class="row"  style="height: 40px;vertical-align: middle;text-align: center">
                                    <td style="width: 70%">
                                        团队<span style="color: #00adef">{{item.from?item.from.name:""}}</span>邀请您的{{item.type==1?"接口":"文档"}}项目{{item.to.name}}加入
                                    </td>
                                    <td style="width: 30%">
                                        <template v-if="item.handle==0">
                                            <el-button type="primary" size="mini" @click="handleTeamPullProject(item,1)">
                                                同意
                                            </el-button>&nbsp;&nbsp;
                                            <el-button type="danger" size="mini" @click="handleTeamPullProject(item,2)">
                                                拒绝
                                            </el-button>
                                        </template>
                                        <span v-else-if="item.handle==1">
                                            已同意
                                        </span>
                                        <span v-else-if="item.handle==2">
                                            已拒绝
                                        </span>
                                        <span v-else>
                                            已忽略
                                        </span>
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </expand>
                    <expand style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);margin-top: 15px;">
                        <div slot="title">{{"用户申请您的团队("+$store.getters.userApplyTeamLength+")"}}</div>
                        <table class="table-hover" style="width: 100%">
                            <template v-for="item in $store.state.arrUserApplyTeam">
                                <tr class="row"  style="height: 40px;text-align: center;vertical-align: middle">
                                    <td style="width: 60%">
                                        用户<span style="color: #00adef">{{item.from?item.from.name:""}}</span>申请加入您的团队{{item.to.name}}<br>
                                        备注：{{item.dis?item.dis:"无"}}
                                    </td>
                                    <td style="width: 40%">
                                        <template v-if="item.handle==0">
                                            <el-button size="mini" type="primary" @click="handleUserApplyTeam(item,1)">
                                                同意
                                            </el-button>&nbsp;&nbsp;
                                            <el-button size="mini" type="danger" @click="handleUserApplyTeam(item,2)">
                                                拒绝
                                            </el-button>
                                        </template>
                                        <span v-else-if="item.handle==1">
                                            已同意
                                        </span>
                                        <span v-else-if="item.handle==2">
                                            已拒绝
                                        </span>
                                        <span v-else>
                                            已忽略
                                        </span>
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </expand>
                    <expand style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);margin-top: 15px;">
                        <div slot="title">{{"项目申请您的团队("+$store.getters.projectApplyTeamLength+")"}}</div>
                        <table class="table-hover" style="width: 100%">
                            <template v-for="item in $store.state.arrProjectApplyTeam">
                                <tr class="row"  style="height: 40px;text-align: center;vertical-align: middle">
                                    <td style="width: 60%">
                                        {{item.type==1?"接口":"文档"}}项目<span style="color: #00adef">{{item.from?item.from.name:""}}</span>申请加入您的团队{{item.to.name}}<br>
                                        备注：{{item.dis?item.dis:"无"}}
                                    </td>
                                    <td style="width: 40%">
                                        <template v-if="item.handle==0">
                                            <el-button size="mini" type="primary" @click="handleProjectApplyTeam(item,1)">
                                                同意
                                            </el-button>&nbsp;&nbsp;
                                            <el-button size="mini" type="danger" @click="handleProjectApplyTeam(item,2)">
                                                拒绝
                                            </el-button>
                                        </template>
                                        <span v-else-if="item.handle==1">
                                            已同意
                                        </span>
                                        <span v-else-if="item.handle==2">
                                            已拒绝
                                        </span>
                                        <span v-else>
                                            已忽略
                                        </span>
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </expand>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :name="1" label="已处理">
                <el-row class="row" v-scroll="loadMore" style="height: calc(100vh - 115px);overflow-y: auto;padding: 10px">
                    <el-row class="row" style="background-color: white;padding: 10px;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);" v-if="arr.length>0">
                        <template v-for="item in arr">
                            <el-row class="row message-hover" :key="item._id" style="border-bottom: 1px lightgray solid">
                                <el-row class="row" style="font-size: 17px;height: 30px;line-height: 30px">
                                    {{item.name}}
                                </el-row>
                                <el-row class="row" style="font-size: 15px">
                                    {{item.dis}}
                                </el-row>
                                <el-row class="row" style="color: gray;height: 30px;line-height: 30px">
                                    {{item.createdAt}}&nbsp;&nbsp;&nbsp;
                                    <el-button type="text" size="mini" style="color:#FF4949" icon="el-icon-delete" @click="remove(item,index)" titile="删除">
                                    </el-button>
                                </el-row>
                            </el-row>
                        </template>
                        <el-row class="row" :loading="loading" style="height: 30px;line-height: 30px;text-align: center;color:gray" v-if="!finish">
                        </el-row>
                    </el-row>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="设置用户部门权限" :visible.sync="showTeamGroup" width="50%" :close-on-click-modal="false" append-to-body>
            <el-form ref="form" label-width="100px">
                <el-form-item label="部门" style="text-align: center">
                    <el-select size="small" v-model="newTeamGroup">
                        <el-option :value="item._id" :label="item.name" v-for="item in teamGroup" :key="item._id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" style="text-align: center">
                    <el-select size="small" v-model="newUserRole">
                        <el-option :value="0" label="项目管理员"></el-option>
                        <el-option :value="1" label="项目成员"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="handleUserApplyTeamAgree">确 定</el-button>
        </span>
        </el-dialog>
    </el-row>
</template>

<style>
    #message .el-tabs__header {
        background-color: white;
    }
    #message .el-tabs__nav-scroll {
        padding-left: 20px;
        padding-right: 20px;
    }
    #message .el-tabs__header {
        margin-bottom: 5px;
    }
    .message-hover:hover {
        background-color: lightgray;
    }
</style>

<script>
    var sessionChange=require("common/mixins/session");
    var store=require("../store")._modulesNamespaceMap["message/"].context;
    var expand=require("component/expand.vue");
    var scroll=require("common/director/scroll")
    module.exports={
        data:function () {
            return {
                type:0,
                page:0,
                loading:false,
                finish:false,
                showTeamGroup:false,
                teamGroup:[],
                newUserRole:1,
                newTeamGroup:"",
                selItem:{}
            }
        },
        mixins:[sessionChange],
        store:store,
        components:{
            "expand":expand
        },
        directives:{
            scroll:scroll
        },
        computed:{
            unHandleLabel:function () {
                return "待处理("+this.$store.getters.totalLength+")";
            },
            arr:function () {
                return this.$store.state.arrMessage;
            }
        },
        methods:{
            loadMore:function (finish) {
                var _this=this;
                this.loading=true;
                this.$store.dispatch("getList").then(function (data) {
                    if(data.code==200)
                    {
                        _this.loading=false;
                        if(data.data.length>0)
                        {
                            _this.arr=_this.arr.concat(data.data);
                            finish()
                        }
                        else
                        {
                            finish(1);
                            _this.finish=true;
                        }
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否删除该消息",function () {
                    $.startHud()
                    net.delete("/message/item",{
                        id:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.arr.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            refresh:function () {
                $.startLoading(1)
                this.$store.dispatch("init").then(function (data) {
                    $.stopLoading();
                })
            },
            handleTeamPullUser:function (item,state) {
                var _this=this;
                $.startHud();
                store.dispatch("handleTeamPullUser",{
                    item:item,
                    state:state
                }).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            handleTeamPullProject:function (item,state) {
                var _this=this;
                $.startHud();
                store.dispatch("handleTeamPullProject",{
                    item:item,
                    state:state
                }).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            handleUserApplyTeam:function (item,state) {
                var _this=this;
                if(state==1)
                {
                    $.startHud();
                    net.get("/team/group",{
                        id:item.to._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            _this.teamGroup=data.data;
                            _this.selItem=item;
                            _this.newTeamGroup=data.data[0]._id
                            _this.showTeamGroup=true;
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                }
                else
                {
                    $.startHud();
                    store.dispatch("handleUserApplyTeam",{
                        item:item,
                        state:2
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code!=200)
                        {
                            $.notify(data.msg,0);
                        }
                    })
                }
            },
            handleUserApplyTeamAgree:function () {
                var _this=this;
                $.startHud();
                store.dispatch("handleUserApplyTeam",{
                    item:this.selItem,
                    state:1,
                    group:this.newTeamGroup,
                    role:this.newUserRole
                }).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                    else
                    {
                        _this.showTeamGroup=false;
                    }
                })
            },
            handleProjectApplyTeam:function (item,state) {
                var _this=this;
                $.startHud();
                store.dispatch("handleProjectApplyTeam",{
                    item:item,
                    state:state
                }).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            clear:function () {
                var _this=this;
                $.confirm("是否清空所有消息",function () {
                    $.startHud();
                    net.delete("/message/clear").then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("清空成功",1);
                            _this.arr.splice(0,_this.arr.length);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            }
        }
    }
</script>
<template>
    <el-row class="row" style="padding: 10px 10px 60px 10px;height: calc(100vh - 115px);overflow-y: auto;font-size: 14px" id="testSetting">
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                项目信息
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-form ref="form" label-width="100px" label-position="top">
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="名称">
                                <el-input size="small" style="width: 90%" v-model="test.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="简介">
                                <el-tooltip class="item" effect="dark" :content="test.dis" placement="bottom" :disabled="!test.dis">
                                    <el-input size="small" style="width: 90%;" v-model="test.dis">
                                        <i slot="suffix" class="el-input__icon el-icon-edit" @click="editRemark" style="cursor: pointer"></i>
                                    </el-input>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="创建时间">
                                <div style="width: 90%;">
                                    {{test.createdAt}}
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="项目ID">
                                <div style="width: 80%">
                                    {{test._id}}
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="margin-top: 10px">
                        <el-button size="mini" type="primary" @click.prevent="saveInfo" :loading="infoPending" >
                            保存
                        </el-button>
                        <el-button size="mini" type="danger" @click.prevent="removeProject" :loading="deletePending">
                            {{ownRole?'删除项目':'退出项目'}}
                        </el-button>
                        <el-button size="mini" type="primary" @click="transfer"  v-if="ownRole">
                            转让
                        </el-button>
                    </el-row>
                </el-form>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                成员管理
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-row class="row" style="height: 50px;text-align: center;line-height: 50px;">
                    <el-col class="col" :span="3" style="white-space: nowrap">
                        邀请用户
                    </el-col>
                    <el-col class="col" :span="12">
                        <el-input size="small" placeholder="输入邀请的用户名" style="width: 90%" v-model="name"></el-input>
                    </el-col>
                    <el-col class="col" :span="3" style="line-height: 50px;">
                        <el-button size="mini" type="primary" @click="invite" :loading="invitePending">
                            邀请
                        </el-button>
                    </el-col>
                </el-row>
                <el-row class="row">
                    <table class="table-hover" style="width: 100%;border-collapse: collapse;">
                        <template v-for="(item,index) in users">
                            <tr style="text-align: center;vertical-align: middle;height: 50px">
                                <td style="width: 20%">
                                    <img v-proxy="item.photo" style="border-radius: 20px"  width="40" height="40">
                                </td>
                                <td style="width: 60%;text-align: center">
                                    {{item.name}}
                                </td>
                                <td style="width: 20%;text-align: center">
                                    <el-button  style="color:red;font-size: 15px" size="mini" icon="el-icon-close" @click="remove(item,index)" type="text"></el-button>
                                </td>
                            </tr>
                        </template>
                    </table>
                </el-row>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px" v-if="!session.teamId">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                团队申请
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-form ref="form" label-width="100px" label-position="top">
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="团队ID">
                                <el-input size="small" style="width: 90%" v-model="teamId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="备注">
                                <el-tooltip class="item" effect="dark" :content="teamDis" placement="bottom" :disabled="!teamDis">
                                    <el-input size="small" style="width: 90%" v-model="teamDis">
                                        <i slot="suffix" class="el-input__icon el-icon-edit" @click="editTeamApply" style="cursor: pointer"></i>
                                    </el-input>
                                </el-tooltip>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-button size="mini" type="primary" style="margin-top: 10px" @click.prevent="applyTeam" :loading="applyPending">
                        保存
                    </el-button>
                </el-form>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px" v-else>
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                退出团队
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-form ref="form" label-width="100px">
                    <el-form-item label="团队名称">
                        {{session.teamName}}&nbsp;&nbsp;
                        <el-button size="mini" type="danger" @click.prevent="quitTeam" :loading="quitPending">
                            退出
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </expand>
    </el-row>
</template>

<style>
    #testSetting .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #testSetting .el-form-item {
        margin-bottom: 0;
    }
</style>

<script>
    var sessionChange=require("common/mixins/session");
    var expand=require("component/expand.vue")
    var proxyImg=require("common/director/proxyImg")
    module.exports = {
        data: function () {
            return {
                infoPending:false,
                deletePending:false,
                invitePending:false,
                name:"",
                teamId:"",
                teamDis:"",
                applyPending:false,
                quitPending:false
            }
        },
        mixins:[sessionChange],
        directives:{
            proxy:proxyImg
        },
        components:{
            "expand":expand
        },
        computed:{
            users:function () {
                return this.test.users;
            },
            ownRole:function () {
                return this.$store.getters.ownRole
            },
            test:function () {
                return this.$store.state.test;
            },
        },
        methods: {
            saveInfo:function () {
                var _this=this;
                this.infoPending=true;
                var query={
                    project:session.get("projectId"),
                    dis:_this.test.dis,
                    name:_this.test.name,
                }
                if(this.session.teamId)
                {
                    query.team=this.session.teamId;
                }
                net.post("/test/project",query).then(function (data) {
                    _this.infoPending=false;
                    if(data.code)
                    {
                        session.set("projectName",_this.test.name);
                        $.notify("修改成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            removeProject:function () {
                var _this=this;
                if(this.ownRole)
                {
                    $.confirm("确定删除该工程？该工程下的所有数据都会被删除!",function () {
                        _this.deletePending=true;
                        net.delete("/test/project",{
                            project:session.get("projectId")
                        }).then(function (data) {
                            _this.deletePending=false;
                            if(data.code==200)
                            {
                                $.notify("删除成功",1);
                                _this.$store.dispatch("project/changeToList",null,{
                                    root:true
                                })

                            }
                        })
                    })
                }
                else
                {
                    $.confirm("确定退出该工程？",function () {
                        _this.deletePending=true;
                        net.delete("/test/quit",{
                            project:session.get("projectId")
                        }).then(function (data) {
                            _this.deletePending=false;
                            if(data.code==200)
                            {
                                $.notify("退出成功",1);
                                _this.$store.dispatch("project/changeToList",null,{
                                    root:true
                                })
                            }
                            else
                            {
                                $.notify(data.msg,0);
                            }
                        })
                    })
                }
            },
            transfer:function () {
                var _this=this;
                $.showBox(_this,require("../../info/setting/component/transfer.vue"),{
                    source:this.$store.state.test.users,
                    type:"test"
                });
            },
            editRemark:function () {
                var _this=this;
                $.inputMul(this,"编辑remark",function (val) {
                    _this.test.dis=val;
                    return true;
                },1,this.test.dis)
            },
            invite:function () {
                var _this=this;
                this.invitePending=true;
                net.post("/test/user",{
                    project:session.get("projectId"),
                    user:_this.name
                }).then(function (data) {
                    _this.invitePending=false;
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        _this.users.push(data.data);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否踢出该成员！",function () {
                    var loading=_this.$loading({fullscreen:true});
                    net.delete("/test/user",{
                        project:session.get("projectId"),
                        user:item._id
                    }).then(function (data) {
                        loading.close();
                        if(data.code==200)
                        {
                            $.notify("踢出成功",1);
                            var index=-1;
                            _this.users.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            editTeamApply:function () {
                var _this=this;
                $.inputMul(this,"编辑申请信息",function (val) {
                    _this.teamDis=val;
                    return true;
                },1,this.teamDis)
            },
            applyTeam:function () {
                if(!this.teamId)
                {
                    $.tip("请输入团队ID",0);
                    return;
                }
                var _this=this;
                this.applyPending=true;
                net.put("/team/testapply",{
                    id:this.teamId,
                    project:session.get("projectId"),
                    dis:this.teamDis
                }).then(function (data) {
                    _this.applyPending=false;
                    _this.teamId="";
                    _this.teamDis="";
                    if(data.code==200)
                    {
                        $.notify("已发送申请，等待团队管理员响应",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            quitTeam:function () {
                var _this=this;
                $.confirm("是否退出该团队",function () {
                    _this.quitPending=true;
                    net.delete("/team/test",{
                        id:session.get("teamId"),
                        project:session.get("projectId")
                    }).then(function (data) {
                        _this.quitPending=false;
                        if(data.code==200)
                        {
                            $.notify("退出成功",1);
                            _this.$store.dispatch("project/changeToList",null,{
                                root:true
                            })
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
        }
    }
</script>











<template>
    <el-row class="row doc" style="margin-top: 10px;font-size: 14px;">
        <switchproject style="position: absolute;top: 5px;right: 10px;z-index: 1000;font-size: 14px">
        </switchproject>
        <el-tabs v-model="type" style="height: 50px;" class="docContent">
            <el-tab-pane name="info" label="概况">
                <el-row class="row" style="padding: 10px 10px 60px 10px;">
                    <el-row class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white">
                        <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6;padding-left: 20px">
                            项目信息
                            <el-button size="mini" type="primary" style="float: right;margin-right: 20px;margin-top: 5px;margin-left: 0px" @click="exportPdf">
                                <i class="el-icon-download" style="font-weight: 900"></i>&nbsp;导出
                            </el-button>
                            <el-button size="mini" type="primary" style="float: right;margin-top: 5px;margin-left: 0px;margin-right: 10px" @click="read">
                                <i class="el-icon-tickets" style="font-weight: 900"></i>&nbsp;阅读
                            </el-button>
                            <el-button size="mini" type="primary" style="float: right;margin-top: 5px;margin-right: 10px" @click="edit">
                                <i class="el-icon-edit" style="font-weight: 900"></i>&nbsp;编辑
                            </el-button>
                        </el-row>
                        <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
                        <el-row class="row" style="padding: 10px 20px 10px 20px">
                            <el-form ref="form" label-width="100px" label-position="top">
                                <el-row class="row">
                                    <el-col class="col" :span="10">
                                        <el-form-item label="已用空间">
                                            {{(doc.useSize/(1024*1024)).toFixed(2)+"MB"}}
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="col" :span="10">
                                        <el-form-item label="总空间">
                                            {{session.env=="doclever.cn"?((doc.totalSize/(1024*1024)).toFixed(2)+"MB"):"您为线下部署版本"}}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col class="col" :span="10">
                                        <el-form-item label="创建者">
                                            {{doc.owner.name}}
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="col" :span="10">
                                        <el-form-item label="创建日期">
                                            {{doc.createdAt}}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-form-item label="简介">
                                        {{doc.dis?doc.dis:"无"}}
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-row>
                    </el-row>
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="setting" label="设置">
                <el-row class="row" style="padding: 10px 10px 60px 10px;height: calc(100vh - 115px);overflow-y: auto;font-size: 14px">
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
                                            <el-input size="small" style="width: 90%" v-model="doc.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="col" :span="10">
                                        <el-form-item label="简介">
                                            <el-tooltip class="item" effect="dark" :content="doc.dis" placement="bottom" :disabled="!doc.dis">
                                                <el-input size="small" style="width: 90%;" v-model="doc.dis">
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
                                                {{doc.createdAt}}
                                            </div>
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="col" :span="10">
                                        <el-form-item label="项目ID">
                                            <div style="width: 80%">
                                                {{doc._id}}
                                            </div>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-form-item label="分享地址">
                                        {{publicUrl}}
                                    </el-form-item>
                                </el-row>
                                <el-row class="row">
                                    <el-col class="col" :span="10">
                                        <el-form-item label="公开到平台">
                                            <el-switch v-model="doc.public" active-color="#13ce66" inactive-color="lightgray" :active-value="1" :inactive-value="0"></el-switch>
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="col" :span="10" v-if="session.teamId">
                                        <el-form-item label="公开到团队">
                                            <el-switch v-model="doc.publicTeam" active-color="#13ce66" inactive-color="lightgray" :active-value="1" :inactive-value="0"></el-switch>
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
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<style>
    .doc .el-tabs__header {
        background-color: white;
    }
    .doc .el-tabs__header {
        margin-bottom: 0px;
    }
    .doc .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    .doc .el-form-item {
        margin-bottom: 0;
    }
    .docContent>.el-tabs__content {
        background-color: rgb(248,248,248);
    }
</style>

<script>
    //var store=require("../../store")._modulesNamespaceMap["project/doc/"].context;
    var sessionChange=require("common/mixins/session");
    var refresh=require("common/mixins/refresh");
    var switchProject=require("component/switchProject.vue");
    var expand=require("component/expand.vue")
    var proxyImg=require("common/director/proxyImg")
    module.exports = {
        data: function () {
            return {
                type:"info",
                bOnline:location.href.indexOf("doclever.cn")>-1?true:false,
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
        store:function () {
            return $.getProjectStore("doc/");
        },
        mixins:[sessionChange,refresh],
        directives:{
            proxy:proxyImg
        },
        components:{
            "switchproject":switchProject,
            "expand":expand
        },
        computed:{
            users:function () {
                return this.doc.users;
            },
            ownRole:function () {
                return this.$store.getters.ownRole
            },
            doc:function () {
                return this.$store.state.doc;
            },
            publicUrl:function () {
                return session.get("baseUrl")+"/html/controller/read/read.html#"+session.get("projectId");
            },
        },
        methods: {
            saveInfo:function () {
                var _this=this;
                this.infoPending=true;
                var query={
                    project:session.get("projectId"),
                    dis:_this.doc.dis,
                    name:_this.doc.name,
                    public:_this.doc.public,
                }
                if(this.session.teamId)
                {
                    query.team=this.session.teamId;
                    query.publicteam=this.doc.publicTeam;
                }
                net.post("/doc/project",query).then(function (data) {
                    _this.infoPending=false;
                    if(data.code)
                    {
                        session.set("projectName",_this.doc.name);
                        $.tip("修改成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            removeProject:function () {
                var _this=this;
                if(this.ownRole)
                {
                    $.confirm("确定删除该工程？该工程下的所有数据都会被删除!",function () {
                        _this.deletePending=true;
                        net.delete("/doc/project",{
                            project:session.get("projectId")
                        }).then(function (data) {
                            _this.deletePending=false;
                            if(data.code==200)
                            {
                                $.tip("删除成功",1);
                                _this.$store.dispatch("changeToList",null,{
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
                        net.delete("/doc/quit",{
                            project:session.get("projectId")
                        }).then(function (data) {
                            _this.deletePending=false;
                            if(data.code==200)
                            {
                                $.tip("退出成功",1);
                                _this.$store.dispatch("changeToList",null,{
                                    root:true
                                })
                            }
                            else
                            {
                                $.tip(data.msg,0);
                            }
                        })
                    })
                }
            },
            transfer:function () {
                var _this=this;
                $.showBox(_this,require("../info/setting/component/transfer.vue"),{
                    source:this.$store.state.doc.users,
                    type:"doc"
                });
            },
            editRemark:function () {
                var _this=this;
                $.inputMul(this,"编辑remark",function (val) {
                    _this.doc.dis=val;
                    return true;
                },1,this.doc.dis)
            },
            invite:function () {
                var _this=this;
                this.invitePending=true;
                net.post("/doc/user",{
                    project:session.get("projectId"),
                    user:_this.name
                }).then(function (data) {
                    _this.invitePending=false;
                    if(data.code==200)
                    {
                        $.tip("修改成功",1);
                        _this.users.push(data.data);
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否踢出该成员！",function () {
                    var loading=_this.$loading({fullscreen:true});
                    net.delete("/doc/user",{
                        project:session.get("projectId"),
                        user:item._id
                    }).then(function (data) {
                        loading.close();
                        if(data.code==200)
                        {
                            $.tip("踢出成功",1);
                            var index=-1;
                            _this.users.splice(index,1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
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
                net.put("/team/docapply",{
                    id:this.teamId,
                    project:session.get("projectId"),
                    dis:this.teamDis
                }).then(function (data) {
                    _this.applyPending=false;
                    _this.teamId="";
                    _this.teamDis="";
                    if(data.code==200)
                    {
                        $.tip("已发送申请，等待团队管理员响应",1);
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            quitTeam:function () {
                var _this=this;
                $.confirm("是否退出该团队",function () {
                    _this.quitPending=true;
                    net.delete("/team/doc",{
                        id:session.get("teamId"),
                        project:session.get("projectId")
                    }).then(function (data) {
                        _this.quitPending=false;
                        if(data.code==200)
                        {
                            $.tip("退出成功",1);
                            _this.$store.dispatch("changeToList",null,{
                                root:true
                            })
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                })
            },
            edit:function () {
                var _this=this;
                $.startHud();
                this.$store.dispatch("list").then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this,require("./component/edit.vue"));
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            read:function () {
                window.open($.basePath()+"read/read.html#"+session.get("projectId")+encodeURIComponent(sessionStorage.getItem("baseUrl")),"_blank");
            },
            exportPdf:function () {
                var link=document.createElement("a");
                link.href=session.get("baseUrl")+"/doc/exportpdf"+"?project="+session.get("projectId");
                link.download=session.get("projectName")+".pdf";
                link.click();
            }
        }
    }
</script>
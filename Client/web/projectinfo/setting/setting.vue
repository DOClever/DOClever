<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    修改项目信息
                </el-button><el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=1" v-if="manageRole">
                修改项目组员
            </el-button><el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=2">
                导出
            </el-button><el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=3">
                Mock
            </el-button><el-button type="primary" style="margin: 20px 0 20px 0;width: 80%;" @click="type=4" v-if="!session.teamId && manageRole">
                团队申请
            </el-button><el-button type="primary" style="margin: 20px 0 20px 0;width: 80%;" @click="type=4" v-if="session.teamId && manageRole">
                退出团队
            </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-show="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;display: inline-block">
                            项目信息
                        </h4>
                        <el-button type="primary" style="float: right;margin-right: 20px;margin-top: 15px" @click="transfer"  v-if="ownRole">
                            转让
                        </el-button>
                    </el-row>
                    <el-form ref="form" label-width="100px">
                        <el-form-item label="名称" style="text-align: center">
                            <el-input style="margin-top: 8px;width: 80%" v-model="project.name"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" style="text-align: center">
                            <el-input type="textarea" :rows="3" style="width: 80%;height: 80%;margin-top: 8px;" v-model="project.dis"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间" style="text-align: center">
                            <div style="width: 80%;display: inline-block;text-align: left">
                                {{project.createdAt}}
                            </div>
                        </el-form-item>
                        <el-form-item label="项目ID" style="text-align: center">
                            <div style="width: 80%;display: inline-block;text-align: left">
                                {{project._id}}
                            </div>
                        </el-form-item>
                        <el-row class="row" style="text-align: center">
                            <el-col class="col" :span="12" style="text-align: center">
                                <el-button type="primary" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click.prevent="saveInfo" :loading="infoPending" v-if="manageRole">
                                    保存
                                </el-button>
                            </el-col>
                            <el-col class="col" :span="12" style="text-align: center">
                                <el-button type="danger" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click.prevent="removeProject" :loading="deletePending">
                                    {{ownRole?'删除项目':'退出项目'}}
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-row>
                <el-row v-show="type==1" class="row">
                    <el-row class="row" style="height: 60px">
                        <h4 style="margin-left: 10px;color: gray">
                            修改项目成员
                        </h4>
                    </el-row>
                    <el-row class="row" style="height: 50px">
                        <el-col class="col" :span="3" style="line-height: 50px;font-size: 15px;text-align: center;white-space: nowrap">
                            邀请用户
                        </el-col>
                        <el-col class="col" :span="9" style="text-align: center">
                            <el-input placeholder="输入邀请的用户名" style="margin-top: 8px;width: 80%" v-model="name"></el-input>
                        </el-col>
                        <el-col class="col" :span="4" style="text-align: center">
                            <el-select style="margin-top: 8px;width: 80%" v-model="role">
                                <el-option :value="1" label="观察者"></el-option>
                                <el-option :value="0" label="管理员"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="col" :span="2" style="line-height: 50px;text-align: center">
                            <el-button  style="font-size: 15px" size="small" @click="editRoleOption" type="text" v-if="role==1">权限</el-button>
                        </el-col>
                        <el-col class="col" :span="3" style="line-height: 50px;text-align: center">
                            <el-button type="primary" style="font-size: 15px" @click="invite" :loading="invitePending">
                                邀请
                            </el-button>
                        </el-col>
                        <el-col class="col" :span="3" style="line-height: 50px;text-align: center">
                            <el-button type="primary" style="font-size: 15px" @click="importMember">
                                导入
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 1px;background-color:rgb(247,246,242);margin: 10px 0 0 10px"></el-row>
                    <useredit></useredit>
                </el-row>
                <el-row v-show="type==2" class="row">
                    <el-row class="row" style="height: 60px">
                        <h4 style="margin-left: 10px;color: gray">
                            导出
                        </h4>
                    </el-row>
                    <el-row class="row" style="text-align: center">
                        <el-radio class="radio" :label="0" v-model="exportType">JSON</el-radio>&nbsp;&nbsp;
                        <el-radio class="radio" :label="1" v-model="exportType">HTML</el-radio>
                    </el-row>
                    <el-row class="row" style="text-align: center;margin-top: 20px">
                        <el-button type="primary" style="width: 200px;margin-bottom: 20px" @click="exportJSON">导出</el-button>
                    </el-row>
                </el-row>
                <el-row v-show="type==3" class="row">
                    <el-row class="row" style="height: 60px">
                        <h4 style="margin-left: 10px;color: gray">
                            Mock
                        </h4>
                    </el-row>
                    <el-row class="row" style="word-break: break-all;padding: 10px;font-size: 15px;">
                        Mock Server地址：<span style="color: #50bfff">{{mockUrl}}</span><br>
                        Mock Js文件：<a href="/html/web/resource/net.js" target="_blank">net.js</a>（和内网测试是同一个文件，需要安装node环境，安装包点击下载：<a href="/html/web/resource/node.msi" target="_blank">window</a>&nbsp;&nbsp;<a href="/html/web/resource/node.pkg" target="_blank">mac</a>）<br>
                        使用方法：在本地用node运行net.js ,加上mock server地址和你需要请求的真实地址的根地址，当您的接口文档的状态为开发完成的时候，net.js不会去请求mock server地址而去请求真实地址（举例：node net.js {{mockUrl}} http://localhost:8081) ,然后将您开发工程下的根地址替换为localhost:36742即可开启您的Mock之旅！
                    </el-row>
                </el-row>
                <el-row v-show="type==4" class="row">
                    <template v-if="!session.teamId && manageRole">
                        <el-row class="row" style="height: 60px">
                            <h4 style="margin-left: 10px;color: gray">
                                团队申请
                            </h4>
                        </el-row>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="团队ID" style="text-align: center">
                                <el-input style="margin-top: 8px;width: 80%" v-model="teamId"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" style="text-align: center">
                                <el-input type="textarea" :rows="3" style="width: 80%;height: 80%;margin-top: 8px;" v-model="teamDis"></el-input>
                            </el-form-item>
                            <el-row class="row" style="text-align: center">
                                <el-col class="col" :span="24" style="text-align: center">
                                    <el-button type="primary" style="width: 50%;margin-top: 20px;margin-bottom: 20px" @click.prevent="applyTeam" :loading="applyPending">
                                        保存
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                    <template v-else-if="session.teamId && manageRole">
                        <el-row class="row" style="height: 60px">
                            <h4 style="margin-left: 10px;color: gray">
                                退出团队
                            </h4>
                        </el-row>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="团队名称" style="text-align: center">
                                {{session.teamName}}
                            </el-form-item>
                            <el-row class="row" style="text-align: center">
                                <el-col class="col" :span="24" style="text-align: center">
                                    <el-button type="danger" style="width: 50%;margin-top: 20px;margin-bottom: 20px" @click.prevent="quitTeam" :loading="quitPending">
                                        退出
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    var userEdit=require("./userEdit.vue")
    var config=require("../../util/config")
    var store=require("../store")._modulesNamespaceMap["setting/"].context;
    var sessionChange=require("../../mixins/session");
    module.exports={
        data:function () {
            return {
                name:"",
                role:0,
                invitePending:false,
                infoPending:false,
                deletePending:false,
                exportType:0,
                teamId:"",
                teamDis:"",
                applyPending:false,
                quitPending:false,
                type:0,
                roleOption:{
                    "ie":0,
                    "te":0,
                    "gb":0,
                    "gs":0,
                    "gi":0,
                    "gd":0,
                    "ve":0,
                    "vr":0
                }
            }
        },
        mixins:[sessionChange],
        store:store,
        watch:{
            role:function (val) {
                if(val==1)
                {
                    this.roleOption={
                        "ie":0,
                        "te":0,
                        "gb":0,
                        "gs":0,
                        "gi":0,
                        "gd":0,
                        "ve":0,
                        "vr":0
                    }
                }
            }
        },
        computed:{
            manageRole:function () {
                return this.$store.getters.manageRole;
            },
            ownRole:function () {
                return this.$store.getters.ownRole;
            },
            project:function () {
                return store.getters.project;
            },
            mockUrl:function () {
                if(session.get("versionId"))
                {
                    return config.baseUrl+"/mock/"+session.get("projectId")+session.get("versionId")
                }
                else
                {
                    return config.baseUrl+"/mock/"+session.get("projectId")
                }
            }
        },
        components:{
            "useredit":userEdit,
        },
        methods:{
            saveInfo:function () {
                var _this=this;
                this.infoPending=true;
                net.post("/project/create",{
                    id:session.get("projectId"),
                    dis:_this.project.dis,
                    name:_this.project.name
                }).then(function (data) {
                    _this.infoPending=false;
                    if(data.code)
                    {
                        session.set("projectName",_this.project.name);
                        _this.$root.session.projectName=_this.project.name;
                        $.notify("修改成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            invite:function () {
                var _this=this;
                this.invitePending=true;
                net.post("/project/member",{
                    id:session.get("projectId"),
                    user:_this.name,
                    role:_this.role,
                    option:JSON.stringify(_this.roleOption)
                }).then(function (data) {
                    _this.invitePending=false;
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        _this.project.users.push(data.data);
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
                        net.delete("/project/item",{
                            id:session.get("projectId")
                        }).then(function (data) {
                            _this.deletePending=false;
                            if(data.code==200)
                            {
                                $.notify("删除成功",1);
                                setTimeout(function () {
                                    location.href="../project/project.html"
                                },1500);

                            }
                        })
                    })
                }
                else
                {
                    $.confirm("确定退出该工程？",function () {
                        _this.deletePending=true;
                        net.delete("/project/quit",{
                            id:session.get("projectId")
                        }).then(function (data) {
                            _this.deletePending=false;
                            if(data.code==200)
                            {
                                $.notify("退出成功",1);
                                setTimeout(function () {
                                    location.href="../../project/project.html"
                                },1500);
                            }
                            else
                            {
                                $.notify(data.msg,0);
                            }
                        })
                    })
                }
            },
            exportJSON:function () {
                var type=navigator.userAgent;
                if(type.indexOf("Firefox")>-1)
                {
                    window.open(location.protocol+"//"+location.host+"/project/"+(this.exportType==0?"exportjson":"exporthtml")+"?id="+session.get("projectId"));
                }
                else
                {
                    var link=document.createElement("a");
                    link.href="/project/"+(this.exportType==0?"exportjson":"exporthtml")+"?id="+session.get("projectId");
                    link.download=session.get("projectName")+(this.exportType==0?".json":".zip");
                    link.click();
                }
            },
            importMember:function () {
                var _this=this;
                $.startHud();
                net.get("/project/importmember",{
                    id:session.get("projectId")
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        if(data.data.length==0)
                        {
                            $.notify("没有需要导入的用户",0);
                            return;
                        }
                        var arr=data.data.map(function (obj) {
                            return {
                                select:0,
                                role:0,
                                user:obj
                            }
                        })
                        var child=$.showBox(_this,"importMember",{
                            source:arr
                        },"projectinfo/setting");
                        child.$on("save",function (arr) {
                            _this.project.users=_this.project.users.concat(arr);
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            applyTeam:function () {
                if(!this.teamId)
                {
                    $.tip("请输入团队ID",0);
                    return;
                }
                var _this=this;
                this.applyPending=true;
                net.put("/team/projectapply",{
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
                    net.delete("/team/project",{
                        id:session.get("teamId"),
                        project:session.get("projectId")
                    }).then(function (data) {
                        _this.quitPending=false;
                        if(data.code==200)
                        {
                            $.notify("退出成功",1);
                            setTimeout(function () {
                                location.href="/html/web/team/team.html"
                            },1500)
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            editRoleOption:function () {
                var _this=this;
                var child=$.showBox(this,"roleOption");
                child.$on("save",function (val) {
                    _this.roleOption=val;
                })
            },
            transfer:function () {
                var _this=this;
                $.startHud();
                net.get("/project/users",{
                    id:session.get("projectId")
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this,"transfer",{
                            source:data.data
                        },"projectinfo/setting");
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            }
        },
        created:function () {
            var _this=this;
        }
    }
</script>

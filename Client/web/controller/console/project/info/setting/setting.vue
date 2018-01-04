<template>
    <el-row class="row" style="padding: 10px 10px 60px 10px;height: calc(100vh - 115px);overflow-y: auto;font-size: 14px" id="globalInfo">
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white" id="projectBasicInfo">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                项目信息
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-form ref="form" label-width="100px" label-position="top">
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="名称">
                                <el-input size="small" style="width: 90%" v-model="project.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="简介">
                                <el-tooltip class="item" effect="dark" :content="project.dis" placement="bottom" :disabled="!project.dis">
                                    <el-input size="small" style="width: 90%;" v-model="project.dis">
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
                                    {{project.createdAt}}
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="项目ID">
                                <div style="width: 80%">
                                    {{project._id}}
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
                            <el-form-item label="公开">
                                <el-switch v-model="project.public" active-color="#13ce66" inactive-color="lightgray" :active-value="1" :inactive-value="0"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="margin-top: 10px">
                        <el-button size="mini" type="primary" @click.prevent="saveInfo" :loading="infoPending" v-if="manageRole">
                            保存
                        </el-button>
                        <el-button size="mini" type="danger" @click.prevent="removeProject" :loading="deletePending" v-if="!guestRole">
                            {{ownRole?'删除项目':'退出项目'}}
                        </el-button>
                        <el-button size="mini" type="primary" @click="transfer"  v-if="ownRole">
                            转让
                        </el-button>
                    </el-row>
                </el-form>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px" id="statusEdit">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                修改项目成员
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-row class="row" style="height: 50px;text-align: center;line-height: 50px;" v-if="manageRole">
                    <el-col class="col" :span="3" style="white-space: nowrap">
                        邀请用户
                    </el-col>
                    <el-col class="col" :span="5">
                        <el-input size="small" placeholder="输入邀请的用户名" style="width: 90%" v-model="name"></el-input>
                    </el-col>
                    <el-col class="col" :span="3">
                        <el-select size="small" style="width: 90%" v-model="role">
                            <el-option :value="1" label="观察者"></el-option>
                            <el-option :value="0" label="管理员"></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="col" :span="2" style="line-height: 50px">
                        <el-button  size="mini" @click="editRoleOption" type="text" v-if="role==1">权限</el-button>
                    </el-col>
                    <el-col class="col" :span="3" style="line-height: 50px;">
                        <el-button size="mini" type="primary" @click="invite" :loading="invitePending">
                            邀请
                        </el-button>
                    </el-col>
                    <el-col class="col" :span="3" style="line-height: 50px;">
                        <el-button size="mini" type="primary" @click="importMember">
                            导入
                        </el-button>
                    </el-col>
                </el-row>
                <useredit></useredit>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                导出
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-row class="row">
                    <el-radio class="radio" :label="0" v-model="exportType">JSON</el-radio>
                    <el-radio class="radio" :label="1" v-model="exportType" style="margin-left: 20px">HTML</el-radio>
                    <el-radio class="radio" :label="2" v-model="exportType" style="margin-left: 20px">WORD</el-radio>
                    <el-button size="mini" type="primary" @click="exportJSON" style="margin-left: 20px">导出</el-button>
                </el-row>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                Mock
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                Mock Server地址：<span style="color: #50bfff">{{mockUrl}}</span><br>
                Mock Js文件：<a href="/html/web/resource/other/net.js" target="_blank">net.js</a>（和内网测试是同一个文件，需要安装node环境，安装包点击下载：<a href="/html/web/resource/other/node.msi" target="_blank">window</a>&nbsp;&nbsp;<a href="/html/web/resource/other/node.pkg" target="_blank">mac</a>）<br>
                使用方法：在本地用node运行net.js ,加上mock server地址和你需要请求的真实地址的根地址，当您的接口文档的状态为开发完成的时候，net.js不会去请求mock server地址而去请求真实地址（举例：node net.js {{mockUrl}} http://localhost:8081) ,然后将您开发工程下的根地址替换为localhost:36742即可开启您的Mock之旅！
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px" v-if="manageRole">
            <template v-if="!session.teamId && manageRole">
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
            </template>
            <template v-else-if="session.teamId && manageRole">
                <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                    退出团队
                </el-row>
                <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
                <el-form ref="form" label-width="100px">
                    <el-form-item label="团队名称">
                        {{session.teamName}}&nbsp;&nbsp;
                        <el-button size="mini" type="danger" @click.prevent="quitTeam" :loading="quitPending">
                            退出
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px"  v-if="project.source && manageRole">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                更新工程
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-row class="row" style="word-break: break-all;">
                    该工程是通过Swagger导入的：<br><br>
                    <el-radio class="radio" :label="0" v-model="importType">URL</el-radio>&nbsp;&nbsp;
                    <el-radio class="radio" :label="1" v-model="importType">JSON</el-radio><br><br>
                    <el-input size="small" v-model="project.source.url" style="width: 80%" placeholder="请输入更新的url地址" v-if="importType==0"></el-input>
                    <el-input size="small" v-model="importText" type="textarea" :rows="5" placeholder="请输入更新的JSON" v-else style="width: 80%"></el-input>
                </el-row>
                <el-button size="mini" type="primary" style="margin-top: 10px" @click="updateProject" :loading="updateLoading">更新</el-button>
            </el-row>
        </expand>
    </el-row>
</template>

<style>
    #projectBasicInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #projectBasicInfo .el-form-item {
        margin-bottom: 0;
    }
</style>

<script>
    var userEdit=require("./component/userEdit.vue")
    var config=require("common/js/config")
    var store=require("../../../store")._modulesNamespaceMap["project/info/setting/"].context;
    var sessionChange=require("common/mixins/session");
    var expand=require("component/expand.vue")
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
                    "gt":0,
                    "gd":0,
                    "ve":0,
                    "vr":0
                },
                importType:0,
                importText:"",
                updateLoading:false,
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
                        "gt":0,
                        "gd":0,
                        "ve":0,
                        "vr":0
                    }
                }
            }
        },
        computed:{
            publicUrl:function () {
                var url=location.href;
                var index=url.lastIndexOf("/");
                index=url.lastIndexOf("/",index-1);
                return url.substring(0,index+1)+"public/public.html#"+session.get("projectId");
            },
            guestRole:function () {
                return this.$store.getters.guestRole;
            },
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
            "expand":expand
        },
        methods:{
            saveInfo:function () {
                var _this=this;
                this.infoPending=true;
                net.post("/project/create",{
                    id:session.get("projectId"),
                    dis:_this.project.dis,
                    name:_this.project.name,
                    public:_this.project.public
                }).then(function (data) {
                    _this.infoPending=false;
                    if(data.code)
                    {
                        session.set("projectName",_this.project.name);
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
                        net.delete("/project/quit",{
                            id:session.get("projectId")
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
            exportJSON:function () {
                var type=navigator.userAgent;
                if(type.indexOf("Firefox")>-1)
                {
                    window.open(location.protocol+"//"+location.host+"/project/"+(this.exportType==0?"exportjson":(this.exportType==1?"exporthtml":"exportdocx"))+"?id="+session.get("projectId"));
                }
                else
                {
                    var link=document.createElement("a");
                    link.href="/project/"+(this.exportType==0?"exportjson":(this.exportType==1?"exporthtml":"exportdocx"))+"?id="+session.get("projectId");
                    link.download=session.get("projectName")+(this.exportType==0?".json":(this.exportType==1?".zip":".docx"));
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
                        var child=$.showBox(_this,require("./component/importMember.vue"),{
                            source:arr
                        });
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
            editRoleOption:function () {
                var _this=this;
                var child=$.showBox(this,require("component/roleOption.vue"));
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
                        $.showBox(_this,require("./component/transfer.vue"),{
                            source:data.data,
                            type:"interface"
                        });
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            updateProject:function () {
                if(this.importType==0)
                {
                    if(!this.project.source.url)
                    {
                        $.tip("请输入url地址",0);
                        return;
                    }
                }
                else
                {
                    if(!this.importText)
                    {
                        $.tip("请输入JSON",0);
                        return;
                    }
                    else
                    {
                        try
                        {
                            JSON.parse(this.importText)
                        }
                        catch (err)
                        {
                            $.tip("JSON格式不正确",0);
                            return;
                        }
                    }
                }
                var _this=this;
                $.confirm("确定更新该工程？",function () {
                    _this.updateLoading=true;
                    net.put("/project/updateswagger",_this.importType==0?{
                        id:session.get("projectId"),
                        url:_this.project.source.url
                    }:{
                        id:session.get("projectId"),
                        json:_this.importText
                    }).then(function (data) {
                        _this.updateLoading=false;
                        if(data.code==200)
                        {
                            $.notify("更新成功",1)
                            _this.$store.dispatch("init")
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            editRemark:function () {
                var _this=this;
                $.inputMul(this,"编辑remark",function (val) {
                    _this.project.dis=val;
                    return true;
                },1,this.project.dis)
            },
            editTeamApply:function () {
                var _this=this;
                $.inputMul(this,"编辑申请信息",function (val) {
                    _this.teamDis=val;
                    return true;
                },1,this.teamDis)
            },
            init:function () {
                if(this.project.source && this.project.source.type==0)
                {
                    if(this.project.source.url)
                    {
                        this.importType=0;
                    }
                    else
                    {
                        this.importType=1;
                    }
                }
            }
        },
        created:function () {
            var _this=this;
            this.$store.getters.event.$on("init",this.init)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("init",this.init)
        }
    }
</script>
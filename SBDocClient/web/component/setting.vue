<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0" v-if="session.role==0">
                    修改项目信息
                </el-button><el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=1" v-if="session.role==0">
                修改项目组员
            </el-button><el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=2">
                导出
            </el-button><el-button type="primary" style="margin: 20px 0 20px 0;width: 80%;" @click="type=3">
                Mock
            </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-if="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray">
                            项目信息
                        </h4>
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
                        <el-row class="row" style="text-align: center">
                            <el-col class="col" :span="12" style="text-align: center">
                                <el-button type="primary" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click.prevent="saveInfo" :loading="infoPending">
                                    保存
                                </el-button>
                            </el-col>
                            <el-col class="col" :span="12" style="text-align: center">
                                <el-button type="danger" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click.prevent="removeProject" :loading="deletePending">
                                    {{session.own==1?'删除项目':'退出项目'}}
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-row>
                <el-row v-else-if="type==1" class="row">
                    <el-row class="row" style="height: 60px">
                        <h4 style="margin-left: 10px;color: gray">
                            修改项目成员
                        </h4>
                    </el-row>
                    <el-row class="row" style="height: 50px">
                        <el-col class="col" :span="4" style="line-height: 50px;font-size: 15px;text-align: center;white-space: nowrap">
                            邀请用户
                        </el-col>
                        <el-col class="col" :span="10" style="text-align: center">
                            <el-input placeholder="输入邀请的用户名" style="margin-top: 8px;width: 80%" v-model="name"></el-input>
                        </el-col>
                        <el-col class="col" :span="4" style="text-align: center">
                            <el-select style="margin-top: 8px;width: 80%" v-model="role">
                                <el-option :value="1" label="观察者"></el-option>
                                <el-option :value="0" label="管理员"></el-option>
                            </el-select>
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
                    <useredit :arr="users"></useredit>
                </el-row>
                <el-row v-else-if="type==2" class="row">
                    <el-row class="row" style="height: 60px">
                        <h4 style="margin-left: 10px;color: gray">
                            导出
                        </h4>
                    </el-row>
                    <el-row class="row" style="text-align: center">
                        <el-button type="primary" style="width: 200px;margin-bottom: 20px" @click="exportJSON">导出为JSON文件</el-button>
                    </el-row>
                </el-row>
                <el-row v-else-if="type==3" class="row">
                    <el-row class="row" style="height: 60px">
                        <h4 style="margin-left: 10px;color: gray">
                            Mock
                        </h4>
                    </el-row>
                    <el-row class="row" style="word-break: break-all;padding: 10px;font-size: 15px;">
                        Mock Server地址：<span style="color: #20A0FF">{{mockUrl}}</span><br>
                        Mock Js文件：<a href="/html/web/resource/net.js" target="_blank">net.js</a>（和内网测试是同一个文件，需要安装node环境，安装包点击下载：<a href="/html/web/resource/node.msi" target="_blank">window</a>&nbsp;&nbsp;<a href="/html/web/resource/node.pkg" target="_blank">mac</a>）<br>
                        使用方法：在本地用node运行net.js ,加上mock server地址和你需要请求的真实地址的根地址，当您的接口文档的状态为开发完成的时候，net.js不会去请求mock server地址而去请求真实地址（举例：node net.js {{mockUrl}} http://localhost:8081) ,然后将您开发工程下的根地址替换为localhost:36742即可开启您的Mock之旅！
                    </el-row>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    var userEdit=require("./userEdit.vue")
    var bus=require("../bus/projectInfoBus");
    var config=require("../util/config")
    module.exports={
        data:function () {
            return {
                type:session.get("role")==0?0:2,
                session:$.clone(session.raw()),
                project:{},
                name:"",
                role:0,
                invitePending:false,
                infoPending:false,
                deletePending:false,
                mockUrl:config.baseUrl+"/mock/"+session.get("projectId"),
            }
        },
        computed:{
            users:function () {
                var arr=this.project.users;
                this.project.users=arr.filter(function (obj) {
                    if(obj.user._id==session.get("id"))
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                })
                return this.project.users;
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
                    role:_this.role
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
                if(this.session.own==1)
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
                                    location.href="../project/project.html"
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
                var link=document.createElement("a");
                link.href="/project/exportjson?id="+session.get("projectId");
                link.download=session.get("projectName")+".json";
                link.click();
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
            }
        },
        created:function () {
            var _this=this;
            bus.$on("initInfo",function (data) {
                _this.project=data;
            })
        }
    }
</script>

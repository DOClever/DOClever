<template>
    <el-row id="navBar" class="row" :style="transparent?{height:'50px','backgroundColor':'rgba(0,0,0,0.3)',left:0,top:0,position:'absolute'}:{height:'50px','backgroundColor':'white'}" style="box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15)">
        <slot name="other"></slot>
        <el-col class="col" :span="3" style="text-align: left;line-height: 50px;color:#50bfff ;font-size: 25px;padding-left: 20px">
            <a style="text-decoration: none;cursor: pointer;color: inherit" href="/">DOClever</a>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px;">
            <slot name="slot3">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px;">
            <slot name="slot4">
            </slot>
        </el-col>
        <el-col class="col" :span="1" style="text-align: center;line-height: 50px;">

        </el-col>
        <el-col class="col" :span="8" style="text-align: center;line-height: 50px;font-size: 25px;color: #50bfff;white-space: nowrap;text-overflow:ellipsis">
            <slot name="title">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px;">
            <slot name="slot1">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px;">
            <slot name="slot2">
            </slot>
        </el-col>
        <el-col class="col" :span="4" v-if="session.id" style="white-space: nowrap;text-align: center;line-height: 50px">
            <img v-proxy="session.photo" style="width: 40px;height: 40px; border-radius:50%;margin-top: 5px">&nbsp;
            <el-dropdown @command="handleCommand" style="top: -15px;">
                <span class="el-dropdown-link" style="color: #50bfff;cursor: pointer">
                    <el-badge is-dot class="msgBadge" v-if="newMsg">
                        {{session.name}}
                    </el-badge>
                    <span v-else>
                        {{session.name}}
                    </span>
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="team" v-if="session.team">团队首页</el-dropdown-item>
                    <el-dropdown-item command="list">返回列表</el-dropdown-item>
                    <el-dropdown-item command="apply" v-if="bShowApply">团队申请</el-dropdown-item>
                    <el-dropdown-item command="setting">个人设置</el-dropdown-item>
                    <el-dropdown-item command="message">
                        <el-badge is-dot class="msgBadge" v-if="newMsg">
                            消息中心
                        </el-badge>
                        <span v-else>
                            消息中心
                        </span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        Proxy:<br>
                        <el-switch v-model="proxy" on-color="#13ce66" off-color="#ff4949" @click.native.stop="">
                        </el-switch>
                    </el-dropdown-item>
                    <el-dropdown-item command="update">检查更新</el-dropdown-item>
                    <el-dropdown-item command="quit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px" v-if="!session.id">
            <el-button type="info" onclick="location='/html/web/login/login.html'">登录</el-button>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px" v-if="!session.id">
            <el-button type="success"  onclick="location='/html/web/register/register.html'">注册</el-button>
        </el-col>
        <el-dialog title="团队申请" v-model="showTeam" size="small" ref="team">
            <el-form ref="form" label-width="100px">
                <el-form-item label="团队ID">
                    <el-input  style="width: 80%"  v-model="applyName" placeholder="请输入你要申请的团队ID"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :rows="2"  style="width: 80%"  v-model="applyDis" placeholder="请输入你要申请的备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showTeam = false">取 消</el-button>
            <el-button type="primary" @click="applyTeam" :loading="applyPending">确 定</el-button>
        </span>
        </el-dialog>
    </el-row>
</template>
<script>
    var proxyImg=require("../director/proxyImg");
    var sessionChange=require("../mixins/session");
    var ver=require("../../../ver.json")
    module.exports={
        props:["transparent"],
        mixins:[sessionChange],
        data:function () {
            return {
                showTeam:false,
                applyPending:false,
                applyName:"",
                applyDis:"",
                newMsg:false,
                proxy:session.get("proxy")?true:false,
                bShowApply:document.title.indexOf("DOClever")>-1?false:true
            }
        },
        directives:{
            proxy:proxyImg
        },
        watch:{
            proxy:function (val) {
                if(val)
                {
                    session.set("proxy",1);
                    $.tip("Proxy代理已开启",1)
                }
                else
                {
                    session.remove("proxy");
                    $.tip("Proxy代理已关闭",1)
                }
            }
        },
        methods:{
            handleCommand:function (command) {
                if(command=="team")
                {
                    location.href="/html/web/team/team.html"
                }
                else if(command=="list")
                {
                    location.href="/html/web/project/project.html"
                }
                else if(command=="apply")
                {
                    this.showTeam=true;
                    document.getElementById("navBar").style.zIndex="";
                    this.$refs.team.$on("close",function () {
                        document.getElementById("navBar").style.zIndex=100;
                    })
                }
                else if(command=="setting")
                {
                    location.href="/html/web/person/person.html"
                }
                else if(command=="message")
                {
                    var _this=this;
                    $.startHud();
                    net.get("/message/list",{
                        page:0
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            _this.newMsg=false;
                            document.getElementById("navBar").style.zIndex="";
                            var child=$.showBox(_this,"message",{
                                propArr:data.data
                            });
                            child.$on("close",function () {
                                document.getElementById("navBar").style.zIndex=100;
                            })
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                }
                else if(command=="update")
                {
                    var xml=new XMLHttpRequest();
                    $.startHud();
                    xml.onreadystatechange=function () {
                        if(xml.readyState==4 && xml.status==200)
                        {
                            $.stopHud();
                            var obj=JSON.parse(xml.responseText);
                            var verArr=obj[0].name.split(".");
                            var verLocalArr=ver.version.split(".");
                            var bNew=false;
                            for(var i=0;i<3;i++)
                            {
                                if(verArr[i]>verLocalArr[i])
                                {
                                    bNew=true;
                                    break;
                                }
                                else if(verArr[i]<verLocalArr[i])
                                {
                                    break;
                                }
                            }
                            if(bNew)
                            {
                                $.confirm("已发现新版本"+verArr.join(".")+" 是否现在下载？",function () {
                                    window.open(obj[0].zipball_url,"_blank");
                                })
                            }
                            else
                            {
                                $.tip("已经是最新版本了",1);
                            }
                        }
                    }
                    xml.open("GET","https://api.github.com/repos/sx1989827/DOClever/tags?timestamp="+(new Date()).getTime(),true);
                    xml.send();
                }
                else if(command=="quit")
                {
                    var _this=this;
                    net.post("/user/logout",{}).then(function (data) {
                        if(data.code==200)
                        {
                            _this.$notify({
                                title: '退出成功',
                                type: 'success'
                            });
                            session.clear();
                            setTimeout(function () {
                                location.href="/";
                            },1000)

                        }
                    })
                }
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
                        $.notify("请求已发送，等待团队管理员响应",1);
                        _this.showTeam=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        created:function () {
            var ele;
            this.$nextTick(function () {
                ele=document.getElementById("navBar");
                ele.style.zIndex=100;
            })
            var _this=this;
            if(this.transparent)
            {
                $.addEventListener(window,"scroll",function () {
                    if(document.body.scrollTop>50)
                    {
                        ele.style.position="fixed";
                        ele.style.top=0;
                        ele.style.backgroundColor="rgb(39,52,68)"
                    }
                    else
                    {
                        ele.style.top=0;
                        ele.style.backgroundColor="rgba(0,0,0,0.3)"
                        ele.style.position="absolute";
                    }
                })
            }
            if(session.get("id"))
            {
                net.get("/message/new").then(function (data) {
                    if(data.code==200)
                    {
                        _this.newMsg=data.data;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            }
        }
    }
</script>

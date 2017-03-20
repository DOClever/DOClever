<template>
    <el-row id="navBar" class="row" :style="transparent?{height:'60px','backgroundColor':'rgba(0,0,0,0.3)',left:0,top:0,position:'absolute'}:{height:'60px','backgroundColor':'white'}">
        <slot name="other"></slot>
        <el-col class="col" :span="3" style="text-align: left;line-height: 60px;color:#20A0FF ;font-size: 30px;padding-left: 20px">
            <a style="text-decoration: none;cursor: pointer;color: inherit" href="/">SBDoc</a>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px;">
            <slot name="slot3">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px;">
            <slot name="slot4">
            </slot>
        </el-col>
        <el-col class="col" :span="1" style="text-align: center;line-height: 60px;">

        </el-col>
        <el-col class="col" :span="8" style="text-align: center;line-height: 60px;font-size: 25px;color: #20A0FF">
            <slot name="title">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px;">
            <slot name="slot1">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px;">
            <slot name="slot2">
            </slot>
        </el-col>
        <el-col class="col" :span="4" v-if="isLogin" style="white-space: nowrap;text-align: center;line-height: 60px">
            <img v-proxy="img" style="width: 40px;height: 40px; border-radius:50%;margin-top: 10px">&nbsp;
            <el-dropdown @command="handleCommand" style="top: -15px;">
                <span class="el-dropdown-link" style="color: #20A0FF;cursor: pointer">
                    {{name}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="list">项目列表</el-dropdown-item>
                    <el-dropdown-item command="setting">个人设置</el-dropdown-item>
                    <el-dropdown-item command="help">帮助</el-dropdown-item>
                    <el-dropdown-item command="about">关于</el-dropdown-item>
                    <el-dropdown-item command="update">检查更新</el-dropdown-item>
                    <el-dropdown-item command="quit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px" v-if="!isLogin">
            <el-button type="primary" onclick="location='/html/web/login/login.html'">登陆</el-button>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px" v-if="!isLogin">
            <el-button type="primary"  onclick="location='/html/web/register/register.html'">注册</el-button>
        </el-col>
    </el-row>
</template>
<script>
    var con=require("../../../config.json");
    var proxyImg=require("../director/proxyImg")
    module.exports={
        props:["transparent"],
        data:function () {
            return {
                isLogin:session.get('id')?true:false,
                img:session.get('photo'),
                name:session.get("name")
            }
        },
        directives:{
            proxy:proxyImg
        },
        methods:{
            handleCommand:function (command) {
                if(command=="list")
                {
                    location.href="/html/web/project/project.html"
                }
                else if(command=="setting")
                {
                    location.href="/html/web/person/person.html"
                }
                else if(command=="help")
                {
                    location.href="/html/web/help/help.html"
                }
                else if(command=="about")
                {
                    location.href="/html/web/about/about.html"
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
                            var verLocalArr=con.version.split(".");
                            var bNew=false;
                            for(var i=0;i<3;i++)
                            {
                                if(verArr[i]>verLocalArr[i])
                                {
                                    bNew=true;
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
                    xml.open("GET","https://api.github.com/repos/sx1989827/SBDoc/tags?timestamp="+(new Date()).getTime(),true);
                    xml.send();
                }
                else if(command=="quit")
                {
                    var _this=this;
                    net.post("/user/logout",{},{
                        "content-type":"application/x-www-form-urlencoded"
                    }).then(function (data) {
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
            }
        },
        created:function () {
            var ele;
            this.$nextTick(function () {
                ele=document.getElementById("navBar");
                ele.style.zIndex=100
            })
            var _this=this;
            if(this.transparent)
            {
                $.addEventListener(window,"scroll",function () {
                    if(document.body.scrollTop>60)
                    {
                        ele.style.position="fixed";
                        ele.style.top=0;
                        ele.style.backgroundColor="white"
                    }
                    else
                    {
                        ele.style.top=0;
                        ele.style.backgroundColor="rgba(0,0,0,0.3)"
                        ele.style.position="absolute";
                    }
                })
            }
            this.$parent.$on("updatePhoto",function (val) {
                _this.img=val;
            })
        }
    }
</script>

<template>
    <el-row :gutter="20">
        <el-col :span="4" class="logovisiable" :xs="0"><el-button type="text"  class="logo"><a href="/"><h2>DOClever</h2></a></el-button></el-col>
        <el-col :span="15" :xs="20">
            <el-menu class="el-mainNav" mode="horizontal"  text-color="#ffffff">
                <el-submenu index="1" class="code">
                    <template slot="title">项目开源</template>
                    <el-menu-item index="1-1"><a href="https://github.com/sx1989827/DOClever" target="_blank" rel="nofollow"><i class="github"></i>GitHub</a></el-menu-item>
                    <el-menu-item index="1-2"><a href="https://git.oschina.net/sx1989827/SBDoc" target="_blank" rel="nofollow"><i class="mayun"></i>码云</a></el-menu-item>
                </el-submenu>
                <el-submenu index="2" class="qq">
                    <template slot="title">QQ交流群</template>
                    <el-menu-item index="2-1">
                        <span style="color: #666">欢迎加入QQ讨论群：611940610</span>
                        <span class="qqico"></span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="3"><a href="../help/help.html" target="_blank">帮助文档</a></el-menu-item>
                <el-menu-item index="4"><a href="../about/about.html" target="_blank">关于我们</a></el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="5" class="login" :xs="4">
            <template v-if="!session.id">
                <el-button type="text" onclick="location='../login/login.html'">登录</el-button>
                <el-button type="text" class="free logovisiable loginvisable" onclick="location='../register/register.html'" >免费体验</el-button>
            </template>
            <template v-else>
                <el-row class="row">
                    <img v-proxy="session.photo" style="width: 40px;height: 40px; border-radius:50%;margin-top: 5px">&nbsp;
                    <el-dropdown @command="handleCommand" style="top: -15px;"><span class="el-dropdown-link" style="color: #50bfff;cursor: pointer">
                    <span style="color: white">
                        {{session.name}}
                    </span>
                    <i class="el-icon-caret-bottom el-icon--right" style="color: white"></i>
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="console">进入控制台</el-dropdown-item>
                            <el-dropdown-item command="quit">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
            </template>
        </el-col>
    </el-row>
</template>

<script>
    var sessionChange=require("common/mixins/session");
    var proxyImg=require("common/director/proxyImg");
    module.exports={
        data:function () {
            return {

            }
        },
        mixins:[sessionChange],
        directives:{
            proxy:proxyImg
        },
        methods:{
            handleCommand:function (command) {
                if(command=="quit")
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
                else if(command=="console")
                {
                    location.href="../console/console.html";
                }
            },
        },
    }
</script>
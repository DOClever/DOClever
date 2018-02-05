<template>
    <div class="header">
        <div class="wrap">
            <div style="padding:0 15px">
                <div class="logo fl"><a href="/"><img src="../../web/resource/pic/logo.png"></a></div>
                <ul class="fl nav">
                    <li><a href="../download/download.html" >线下部署</a></li>
                    <li><a href="../help/help.html" target="_blank">帮助文档</a></li>
                    <li ><a href="../about/about.html" >关于我们</a></li>
                    <li ><a href="../join/join.html" >加入我们</a></li>
                    <li><a href="../donate/donate.html" style="color: #00adef">桌面端众筹</a></li>
                </ul>
                <template v-if="!session.id">
                    <div class="login fr">
                        <ul>
                            <li><a href="../login/login.html">登录</a></li>
                            <li class="register"><a href="../register/register.html">立即体验</a></li>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <div class="login fr">
                        <ul>
                            <li><img v-proxy="session.photo" style="width: 40px;height: 40px; border-radius:50%;margin-top: 25px">&nbsp;</li>
                            <li>
                                <el-dropdown @command="handleCommand" ><span class="el-dropdown-link" style="color: #50bfff;cursor: pointer">
                            <span>{{session.name}}</span>
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="console">进入控制台</el-dropdown-item>
                                        <el-dropdown-item command="quit">退出</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </li>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </div>
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
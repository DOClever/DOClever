var svg=require("component/svg.vue");
var proxyImg=require("common/director/proxyImg");
var sessionChange=require("common/mixins/session");
var ver=require("../../../../ver.json");
var store=require("./store");
var project=require("./project/project.vue");
var team=require("./team/team.vue");
var person=require("./person/person.vue");
var message=require("./message/message.vue");
session.remove("snapshotId");
session.remove("snapshotDis");
session.remove("snapshotCreator");
session.remove("snapshotDate");
session.remove("teamId");
session.remove("teamName");
session.remove("versionId");
session.remove("versionName");
session.remove("versionDis");
session.remove("projectType");
session.remove("projectId");
session.remove("projectName");
var vue=new Vue({
    el:"#app",
    data:{
        type:0,
        showTeam:false,
        applyPending:false,
        applyName:"",
        applyDis:"",
        proxy:session.get("proxy")?true:false,
    },
    mixins:[sessionChange],
    directives:{
        proxy:proxyImg
    },
    components:{
        "mysvg":svg,
        "project":project,
        "team":team,
        "person":person,
        "message":message
    },
    store:store,
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
    computed:{
        backTitle:function () {
            if(this.type==0)
            {
                if(this.session.projectId)
                {
                    return "返回项目列表"
                }
                else
                {
                    return "退出团队"
                }
            }
            else if(this.type==1 && this.session.teamId)
            {
                return "退出团队"
            }
        },
        showDot:function () {
            return this.$store.getters["message/totalLength"]>0
        },
        title:function () {
            if(this.type==0)
            {
                if(this.session.projectName)
                {
                    var str="";
                    if(this.session.teamName)
                    {
                        str=this.session.teamName+"-"+this.session.projectName
                    }
                    else
                    {
                        str=this.session.projectName
                    }
                    if(this.session.versionName)
                    {
                        str+="("+this.session.versionName+")";
                    }
                    return str;
                }
                else
                {
                    if(this.session.teamName)
                    {
                        return this.session.teamName+"的项目列表"
                    }
                    else
                    {
                        return "项目列表"
                    }
                }
            }
            else if(this.type==1)
            {
                if(this.session.teamName)
                {
                    return this.session.teamName
                }
                else
                {
                    return "团队列表"
                }
            }
            else if(this.type==2)
            {
                return "个人"
            }
            else if(this.type==3)
            {
                return "消息"
            }
        }
    },
    methods:{
        handleCommand:function (command) {
            if(command=="update")
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
                if(this.adminPage)
                {
                    net.post("/admin/logout",{}).then(function (data) {
                        if(data.code==200)
                        {
                            _this.$notify({
                                title: '退出成功',
                                type: 'success'
                            });
                            sessionStorage.removeItem("admin");
                            setTimeout(function () {
                                location.href="/";
                            },1000)

                        }
                    })
                }
                else
                {
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
            }
            else if(command=="help")
            {
                window.open("../help/help.html","_blank");
            }
        },
        back:function (event,type) {
            if(this.type==0 && !this.session.projectId && this.session.teamId)
            {
                var _this=this;
                var display=this.$refs.project.$el.style.display;
                this.$refs.project.$el.style.display="none";
                store.state.event.$on("initTeamList",function() {
                    _this.$refs.project.$el.style.display=display;
                    store.state.event.$off("initTeamList");
                })
                store.dispatch("team/changeToList");
            }
            else if(this.type==0 && this.session.projectId)
            {
                store.dispatch("project/changeToList");
            }
            else if(this.type==1 && this.session.teamId)
            {
                if(this.session.projectId)
                {
                    store.state.team.list.bRefreshProjectList=0;
                }
                store.dispatch("team/changeToList");
            }
        }
    },
    created:function () {
        window.hljs.initHighlightingOnLoad();
        var _this=this;
        store.dispatch("init").then(function () {
            $.stopLoading();
            if(store.getters["project/list/projectNotTeamLength"]==0 && store.getters["team/list/teamListLength"]>0)
            {
                _this.type=1;
            }
        }).catch(function (err) {
            $.notify(err,0);
        })
    }
});
window.vueObj=vue;
window.worker=new Worker('worker.js');
$.ready(function () {
    $.startLoading();
});

if (module.hot) {
    module.hot.accept();
}
var proxyImg=require("common/director/proxyImg");
var sessionChange=require("common/mixins/session");
var store=require("./store");
var project=require("./project/project.vue");
var team=require("./team/team.vue");
var person=require("./person/person.vue");
var message=require("./message/message.vue");
var sider=require("component/sider.vue");
var config=require("common/js/config")
var vue=new Vue({
    el:"#app",
    data:{
        type:"team",
    },
    mixins:[sessionChange],
    directives:{
        proxy:proxyImg
    },
    components:{
        "project":project,
        "team":team,
        "person":person,
        "message":message,
        "sider":sider
    },
    store:store,
    computed:{
        showDot:function () {
            return this.$store.getters["message/totalLength"]>0
        },
        mockList:function () {
            return this.$store.state.mockList;
        },
        memberInfo:function () {
            let info=this.$store.state.memberInfo;
            let str=`绑定会员:${info.name} 会员等级:${info.level.name} 积分:${info.point}`
            return str;
        }
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
                        let url=sessionStorage.getItem("loginUrl")
                        session.clear();
                        _this.$store.dispatch("clearMock");
                        setTimeout(function () {
                            location.href=url;
                        },1000)

                    }
                })
            }
            else if(command=="help")
            {
                this.$api.util.goUrl("http://doclever.cn/controller/help/help.html")
            }
            else if(command=="info")
            {
                $.showSider(this.$root,require("./person/person.vue"),"个人资料","40%");
            }
        },
        goHome:function () {
            let ele=document.getElementById("adLogo");
            if(ele.getAttribute("url"))
            {
                this.$api.util.goUrl(ele.getAttribute("url"))
            }
            else
            {
                this.$api.util.goUrl("http://doclever.cn")
            }
        },
        message:function () {
            $.showSider(this.$root,require("./message/message.vue"),"消息","50%",{

            });
        },
        startMock:function (item) {
            this.$store.dispatch("startMock",item);
        },
        stopMock:function (item) {
            this.$store.dispatch("stopMock",item.id);
        },
        removeMock:async function (item) {
            let ret=await $.confirm("是否关闭此Mock实例，该实例将从列表中移除!")
            if(ret)
            {
                this.$store.dispatch("removeMock",item.id);
            }
        },
        init:async function () {
            await store.dispatch("init");
        },
        plugin:async function () {
            $.showSider(this.$root,require("./plugin/plugin.vue"),"插件","30%");
        }
    },
    created:async function () {
        window.hljs.initHighlightingOnLoad();
        await this.$api.plugin.load(sessionStorage.getItem("env"));
        await store.dispatch("init");
        $.stopLoading();
        var _this=this;
        this.$store.state.event.$on("addPoint",function (obj) {
            _this.$store.state.memberInfo.point=obj.point;
            if(obj.level)
            {
                _this.$store.state.memberInfo.level=obj.level;
            }
            let ele=document.getElementById("showPoint");
            ele.innerText=`${obj.title?obj.title:""} +${obj.add}积分`
            ele.style.display="block";
            $.addClass(ele,"animated fadeOutUp");
            $.once(ele,"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function () {
                ele.style.display="none";
            })
        })
        if(sessionStorage.getItem("first"))
        {
            helper.addPoint("login","登陆");
            sessionStorage.removeItem("first");
        }
        this.$store.dispatch("statics");
    },
    mounted:function () {
        var _this=this;
        if(sessionStorage.getItem("member") && sessionStorage.getItem("member")!=session.get("id"))
        {
            setTimeout(async function () {
                let obj=await helper.getMemberStatus();
                if(obj===false)
                {
                    $.tip("你被管理员取消与会员的绑定",0);
                    _this.handleCommand("quit");
                }
                else if(obj)
                {
                    _this.$store.state.memberInfo.point=obj.point;
                    _this.$store.state.memberInfo.level=obj.level;
                    setTimeout(arguments.callee,60000);
                }
            },10000)
        }
        let ele=document.getElementById("adLogo");
        let img=new Image();
        img.src="http://doclever.cn/resource/ad/ad.png";
        img.onload=async function () {
            ele.src=img.src;
            let res=await fetch("http://doclever.cn/resource/ad/url.txt");
            let url=await res.text();
            ele.setAttribute("url",url);
        }
    }
});
window.rootVue=window.vueObj=vue;
window.worker=new Worker('worker.js');
$.ready(function () {
    $.startLoading();
});

if (module.hot) {
    module.hot.accept();
}
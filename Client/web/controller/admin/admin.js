var mainNav=require("./component/mainNav.vue")
var user=require("./component/user.vue")
var project=require("./component/project.vue")
var team=require("./component/team.vue")
var inter=require("./component/interface.vue")
var setting=require("./component/setting.vue")
var statistic=require("./component/statistic.vue")
var store=require("./store")
if(!sessionStorage.getItem("admin"))
{
    location.href="/"
}
var vue=new Vue({
    el: "#app",
    data: {
        tab:"user"
    },
    components:{
        "mainnav":mainNav,
        "project":project,
        "team":team,
        "user":user,
        "interface":inter,
        "setting":setting,
        "statistic":statistic
    },
    store:store,
    methods:{

    },
    created:function () {
        var _this=this;
        Promise.all([
            net.get("/admin/userstatistics"),
            net.get("/admin/projectstatistics"),
            net.get("/admin/teamstatistics"),
            net.get("/admin/interfacestatistics"),
            net.get("/admin/setting")
        ]).then(function (data) {
            var obj1=data[0];
            var obj2=data[1];
            var obj3=data[2];
            var obj4=data[3];
            var obj5=data[4];
            if(obj1.code==200)
            {
                store.commit("setUserInfo",obj1.data)
            }
            else
            {
                throw obj1.msg;
            }
            if(obj2.code==200)
            {
                store.commit("setProjectInfo",obj2.data)
            }
            else
            {
                throw obj2.msg;
            }
            if(obj3.code==200)
            {
                store.commit("setTeamInfo",obj3.data)
            }
            else
            {
                throw obj3.msg;
            }
            if(obj4.code==200)
            {
                store.commit("setInterfaceInfo",obj4.data)
            }
            else
            {
                throw obj4.msg;
            }
            if(obj5.code==200)
            {
                store.commit("setSettingInfo",obj5.data)
            }
            else
            {
                throw obj5.msg;
            }
            $.stopLoading();
        }).catch(function (err) {
            $.stopLoading();
            if(typeof(err)=="string")
            {
                $.notify(err,0);
            }
            else
            {
                $.notify("获取失败",0);
            }
        })
    }
})
$.ready(function () {
    $.startLoading();
})

if (module.hot) {
    module.hot.accept();
}







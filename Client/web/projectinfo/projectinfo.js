/**
 * Created by sunxin on 2016/12/22.
 */
var mainNav=require("../component/mainNav.vue")
var interface=require("../component/interface.vue")
var setting=require("../component/setting.vue")
var global=require("../component/global.vue")
var test=require("../component/test.vue")
var version=require("../component/version.vue")
var config=require("../util/config");
var bus=require("../bus/projectInfoBus")
var itemAuto=require("../component/autocompleteItem.vue");
if(!session.get("id"))
{
    location.href="../login/login.html"
}
else if(!session.get("projectId"))
{
    location.href="../project/project.html"
}
session.remove("snapshotId");
session.remove("snapshotDis");
session.remove("snapshotCreator");
session.remove("snapshotDate");
Vue.component("itemauto",itemAuto);
var vue=new Vue({
    el: "#app",
    data: {
        session:$.clone(session.raw()),
        type:0,
        arrApply:[],
        showApply:false
    },
    components:{
        "mainnav":mainNav,
        "interface":interface,
        "setting":setting,
        "global":global,
        "test":test,
        "version":version
    },
    methods:{
        handleApply:function (item,state) {
            var _this=this;
            $.startHud();
            net.put("/project/handleapply",{
                id:session.get("projectId"),
                apply:item._id,
                state:state
            }).then(function (data) {
                $.stopHud();
                if(data.code==200)
                {
                    if(state==1)
                    {
                        item.handle=1;
                        setTimeout(function () {
                            location.href="../project/project.html"
                        },1000);
                    }
                    else
                    {
                        item.handle=2;
                    }
                }
                else
                {
                    item.handle=3;
                    $.notify(data.msg,0);
                }
            })
        }
    },
    created:function () {
        var _this=this;
        Promise.all([
            net.get("/project/interface",{
                id:session.get("projectId")
            }),
            net.get("/project/info",{
                id:session.get("projectId")
            }),
            net.get("/status/list",{
                id:session.get("projectId")
            }),
            net.get("/test/list",{
                project:session.get("projectId")
            }),
            net.get("/project/applylist",{
                id:session.get("projectId")
            }),
            net.get("/version/list",{
                project:session.get("projectId"),
                page:0
            })
        ]).then(function (values) {
            $.stopLoading();
            var obj1=values[0];
            var obj2=values[1];
            var obj3=values[2];
            var obj4=values[3];
            var obj5=values[4];
            var obj6=values[5];
            if(obj1.code==200)
            {
                bus.$emit("initInterface",obj1.data);
            }
            else
            {
                throw obj1.msg;
            }
            if(obj2.code==200)
            {
                bus.$emit("initInfo",obj2.data);
            }
            else
            {
                throw obj2.msg;
            }
            if(obj3.code==200)
            {
                bus.$emit("initStatus",obj3.data);
            }
            else
            {
                throw obj3.msg;
            }
            if(obj4.code==200)
            {
                bus.$emit("initTest",obj4.data);
            }
            else
            {
                throw obj4.msg;
            }
            if(session.get("role")==0)
            {
                if(obj5.code==200)
                {
                    obj5.data.forEach(function (obj) {
                        obj.handle=0;
                    })
                    _this.arrApply=obj5.data;
                    if(_this.arrApply.length>0)
                    {
                        _this.showApply=true;
                    }
                }
                else
                {
                    throw obj5.msg;
                }
            }
            if(obj6.code==200)
            {
                bus.$emit("initVersion",obj6.data);
            }
            else
            {
                throw obj6.msg;
            }
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
window.vueObj=vue;
$.ready(function () {
    $.startLoading();
})
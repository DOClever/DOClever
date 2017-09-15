webpackJsonp([8],{

/***/ 296:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(session, Vue, $, net) {/**
 * Created by sunxin on 2016/12/22.
 */
var mainNav=__webpack_require__(7)
var interface=__webpack_require__(34)
var setting=__webpack_require__(35)
var global=__webpack_require__(33)
var test=__webpack_require__(36)
var version=__webpack_require__(37)
var config=__webpack_require__(11);
var itemAuto=__webpack_require__(24);
var store=__webpack_require__(12);
var sessionChange=__webpack_require__(6);
if(!session.get("projectId"))
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
        type:0,
        arrApply:[],
        showApply:false,
        selProject:session.get("projectName")
    },
    store:store,
    mixins:[sessionChange],
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
        },
        querySearch:function (queryString,cb) {
            var _this=this;
            var query={
                name:""
            }
            if(_this.session.teamId)
            {
                query.team=_this.session.teamId
            }
            net.get("/project/filterlist",query).then(function (data) {
                if(data.code==200)
                {
                    var results=data.data.map(function (obj) {
                        return {
                            value:obj.name,
                            remark:obj.dis!="undefined"?obj.dis:"",
                            id:obj._id,
                            own:obj.own,
                            role:obj.role
                        }
                    })
                    cb(results);
                }
                else
                {
                    $.notify(data.msg,0);
                    cb([]);
                }
            })
        },
        showAutoComplete:function (event) {
            setTimeout(function(){
                event.target.nextSibling.focus();
            },100)
        },
        changeProject:function (obj) {
            session.set("projectId",obj.id);
            session.set("projectName",obj.value);
            store.state.lastBaseUrl=""
            location.reload();
        },
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
                store.dispatch("interface/getAllInterface",obj1.data)
            }
            else
            {
                throw obj1.msg;
            }
            if(obj2.code==200)
            {
                store.commit("setProject",obj2.data);
            }
            else
            {
                throw obj2.msg;
            }
            if(obj3.code==200)
            {
                store.commit("setStatus",obj3.data);
            }
            else
            {
                throw obj3.msg;
            }
            if(obj4.code==200)
            {
                store.state.event.$emit("initTest",obj4.data);
            }
            else
            {
                throw obj4.msg;
            }
            if(store.state.role==0)
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
                store.state.event.$emit("initVersion",obj6.data);
            }
            else
            {
                throw obj6.msg;
            }
            store.state.event.$emit("init");
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
    },
    mounted:function () {
        document.getElementById("projectChange").getElementsByTagName("input")[0].readOnly=true;
    }
})
window.vueObj=vue;
$.ready(function () {
    $.startLoading();
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(2), __webpack_require__(0), __webpack_require__(4)))

/***/ })

},[296]);
//# sourceMappingURL=projectinfo.js.map
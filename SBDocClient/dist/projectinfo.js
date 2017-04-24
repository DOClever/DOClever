webpackJsonp([3],{

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(session, Vue, $, net) {/**
 * Created by sunxin on 2016/12/22.
 */
var mainNav=__webpack_require__(7)
var interface=__webpack_require__(22)
var setting=__webpack_require__(24)
var global=__webpack_require__(21)
var config=__webpack_require__(9);
var bus=__webpack_require__(13)
var itemAuto=__webpack_require__(20);
if(!session.get("id"))
{
    location.href="../login/login.html"
}
else if(!session.get("projectId"))
{
    location.href="../project/project.html"
}
Vue.component("itemauto",itemAuto);
var vue=new Vue({
    el: "#app",
    data: {
        session:$.clone(session.raw()),
        type:0
    },
    components:{
        "mainnav":mainNav,
        "interface":interface,
        "setting":setting,
        "global":global
    },
    created:function () {
        Promise.all([
            net.get("/project/interface",{
                id:session.get("projectId")
            }),
            net.get("/project/info",{
                id:session.get("projectId")
            }),
            net.get("/status/list",{
                id:session.get("projectId")
            })
        ]).then(function (values) {
            $.stopLoading();
            var obj1=values[0];
            var obj2=values[1];
            var obj3=values[2];
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1), __webpack_require__(0), __webpack_require__(5)))

/***/ })

},[160]);
//# sourceMappingURL=projectinfo.js.map
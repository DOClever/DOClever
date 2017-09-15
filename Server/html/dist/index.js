webpackJsonp([0],{

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue) {/**
 * Created by sunxin on 2017/5/20.
 */
var mainNav=__webpack_require__(10)
var interface=__webpack_require__(9)
var setting=__webpack_require__(11)
var global=__webpack_require__(8)
var config=__webpack_require__(12);
var bus=__webpack_require__(3)
var vue=new Vue({
    el: "#app",
    data: {
        type:0
    },
    components:{
        "mainnav":mainNav,
        "interface":interface,
        "setting":setting,
        "global":global,
    },
    mounted:function () {
        bus.$emit("initInterface",window.interface);
        bus.$emit("initInfo",window.project);
        bus.$emit("initStatus",window.state);
    }
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ })

},[91]);
//# sourceMappingURL=index.js.map
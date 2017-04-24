webpackJsonp([7],{

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue, session) {/**
 * Created by sunxin on 2017/3/3.
 */
var mainNav=__webpack_require__(7);
var vue=new Vue({
    el: "#app",
    data: {
        isLogin:session.get('id')?true:false,
    },
    components:{
        "mainnav":mainNav
    },
    methods:{

    },
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ })

},[155]);
//# sourceMappingURL=help.js.map
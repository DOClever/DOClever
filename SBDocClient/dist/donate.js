webpackJsonp([8],{

/***/ 154:
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

},[154]);
//# sourceMappingURL=donate.js.map
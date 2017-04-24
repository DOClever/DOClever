webpackJsonp([6],{

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue, session) {/**
 * Created by sunxin on 2017/2/16.
 */
var mainNav=__webpack_require__(7)
var vue=new Vue({
    "el":"#app",
    data:{
        dis:[
          {
              title:"SBDoc是我目前用到过最好的一个接口管理平台",
              name:"ios开发者李续续"
          },
          {
              title:"有了SBDoc，和前端的沟通都顺畅了很多",
              name:"java程序员张洋"
          },
            {
                title:"使用SBDoc可以让我和后端的数据无缝衔接，再也停不下来",
                name:"前端工程师李彩凤"
            }
        ],
        isLogin:session.get('id')?true:false,
    },
    components:{
        "mainnav":mainNav
    },
    methods:{
        start:function () {
            if(this.isLogin)
            {
                location.href='project/project.html';
            }
            else
            {
                location.href='login/login.html';
            }
        }
    }
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ })

},[156]);
//# sourceMappingURL=index.js.map
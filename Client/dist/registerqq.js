webpackJsonp([6],{

/***/ 301:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue, net) {var vue=new Vue({
    el: "#app",
    data: {
        username:sessionStorage.getItem("qqname"),
        photo:sessionStorage.getItem("qqimg"),
        pwd:"",
        pwd1:"",
        question:"",
        answer:"",
        registerPending:false
    },
    methods:{
        register:function () {
            var _this=this;
            if(!this.username || !this.pwd || !this.pwd1 || !this.question || !this.answer)
            {
                this.$message.error("用户名密码,找回密码问题，找回密码答案不能为空");
                return;
            }
            else if(this.pwd!=this.pwd1)
            {
                this.$message.error("两次输入的密码不一致");
                return;
            }
            _this.registerPending=true;
            net.post("/user/createqq",{
                name:_this.username,
                password:_this.pwd,
                question:_this.question,
                answer:_this.answer,
                qqid:sessionStorage.getItem("qqid"),
                qqimg:sessionStorage.getItem("qqimg")
            }).then(function (data) {
                _this.registerPending=false;
                if(data.code==200)
                {
                    _this.$notify({
                        title: '注册成功',
                        type: 'success'
                    });
                    window.opener.postMessage(JSON.stringify({
                        name:_this.username,
                        password:_this.pwd,
                    }),location.protocol+"//"+location.host);
                    setTimeout(function () {
                        window.close();
                    },1000);
                }
                else
                {
                    _this.$notify({
                        title: data.msg,
                        type: 'error'
                    });
                }
            })
        }
    },
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(4)))

/***/ })

},[301]);
//# sourceMappingURL=registerqq.js.map
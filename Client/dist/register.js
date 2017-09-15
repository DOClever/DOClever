webpackJsonp([7],{

/***/ 300:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue, net) {/**
 * Created by sunxin on 2016/12/28.
 */
var vue=new Vue({
    el: "#app",
    data: {
        username:"",
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
            net.post("/user/save",{
                name:_this.username,
                password:_this.pwd,
                question:_this.question,
                answer:_this.answer
            },{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                _this.registerPending=false;
                if(data.code==200)
                {
                    _this.$notify({
                        title: '注册成功',
                        type: 'success'
                    });
                    setTimeout(function () {
                        location.href="../login/login.html"
                    },1500);
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

},[300]);
//# sourceMappingURL=register.js.map
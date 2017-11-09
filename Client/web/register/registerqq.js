var vue=new Vue({
    el: "#app",
    data: {
        username:sessionStorage.getItem("qqname"),
        photo:sessionStorage.getItem("qqimg"),
        pwd:"",
        pwd1:"",
        question:"",
        answer:"",
        email:"",
        registerPending:false
    },
    methods:{
        register:function () {
            var _this=this;
            if(!this.username || !this.pwd || !this.pwd1 || !this.question || !this.answer || !this.email)
            {
                this.$message.error("用户名密码,找回密码问题，找回密码答案不能为空");
                return;
            }
            else if(this.pwd!=this.pwd1)
            {
                this.$message.error("两次输入的密码不一致");
                return;
            }
            else if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)))
            {
                $.tip("邮箱格式不正确",0);
                return;
            }
            _this.registerPending=true;
            net.post("/user/createqq",{
                name:_this.username,
                password:_this.pwd,
                question:_this.question,
                answer:_this.answer,
                email:_this.email,
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
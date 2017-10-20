var vue=new Vue({
    el: "#app",
    data: {
        username:"",
        pwd:"",
        loginPending:false
    },
    methods:{
        login:function () {
            var _this=this;
            if(!this.username || !this.pwd)
            {
                this.$message.error('用户名密码不能为空');
                return;
            }
            this.loginPending=true;
            net.post("/admin/login",{
                name:_this.username,
                password:_this.pwd,
            }).then(function (data) {
                _this.loginPending=false;
                if(data.code==200)
                {
                    _this.$notify({
                        title: '登录成功',
                        type: 'success'
                    });
                    sessionStorage.setItem("admin",_this.username)
                    setTimeout(function () {
                        location.href="./admin.html"
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
    created:function () {

    }
})
$.ready(function () {
    document.body.onkeydown=function (e) {
        var event=window.event || e;
        if(event.keyCode==13)
        {
            var event1 = document.createEvent('HTMLEvents');
            event1.initEvent("click", true, true);
            event1.eventType = 'message';
            document.getElementById("login").dispatchEvent(event1);
        }
    }
})
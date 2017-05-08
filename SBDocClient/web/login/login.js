/**
 * Created by sunxin on 2016/12/28.
 */
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
            net.post("/user/login",{
                name:_this.username,
                password:_this.pwd
            },{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                _this.loginPending=false;
                if(data.code==200)
                {
                    _this.$notify({
                        title: '登录成功',
                        type: 'success'
                    });
                    session.clear()
                    session.update(data.data);
                    setTimeout(function () {
                        location.href="../project/project.html"
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
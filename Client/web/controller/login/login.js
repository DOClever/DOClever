
var vue=new Vue({
    el: "#app",
    data: {
        username:"",
        pwd:"",
        loginPending:false,
        remember:0,
        openId:""
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
                password:_this.pwd,
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
                    session.update(data.data,_this.remember);
                    setTimeout(function () {
                        location.href="../console/console.html"
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
        },
        qqLogin:function() {
            var _this=this;
            var win=QC.Login.showPopup({});
            var loop=setInterval(function () {
                if(win.closed)
                {
                    clearInterval(loop);
                    if(QC.Login.check())
                    {
                        var obj;
                        QC.api("get_user_info", {}).success(function(s){
                            obj=s.data;
                            QC.Login.getMe(function (openId,accessToken) {
                                _this.openId=openId;
                                net.post("/user/login",{
                                    qqid:openId,
                                    qqimg:obj.figureurl_qq_1
                                }).then(function (data) {
                                    if(data.code==200)
                                    {
                                        _this.$notify({
                                            title: '登录成功',
                                            type: 'success'
                                        });
                                        session.clear()
                                        session.update(data.data,_this.remember);
                                        setTimeout(function () {
                                            location.href="../console/console.html"
                                        },1500);
                                    }
                                    else if(data.code==2)
                                    {
                                        sessionStorage.setItem("qqid",openId);
                                        sessionStorage.setItem("qqname",obj.nickname);
                                        sessionStorage.setItem("qqimg",obj.figureurl_qq_1);
                                        window.open(location.protocol+"//"+location.host+"/html/web/controller/register/registerqq.html")
                                    }
                                    else
                                    {
                                        _this.$notify({
                                            title: data.msg,
                                            type: 'error'
                                        });
                                    }
                                })
                            })
                        })
                    }
                }
            },500);
        }
    },
    created:function () {
        var _this=this;
        window.addEventListener('message',function(e){
            if(e.origin==location.protocol+"//"+location.host)
            {
                var obj;
                try
                {
                    obj=JSON.parse(e.data);
                }
                catch (err)
                {
                    return;
                }
                if(!obj.name || !obj.password)
                {
                    return;
                }
                net.post("/user/login",{
                    name:obj.name,
                    password:obj.password,
                }).then(function (data) {
                    if(data.code==200)
                    {
                        _this.$notify({
                            title: '登录成功',
                            type: 'success'
                        });
                        session.clear()
                        session.update(data.data,_this.remember);
                        setTimeout(function () {
                            location.href="../console/console.html"
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
        },false);
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
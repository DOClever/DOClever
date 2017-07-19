/**
 * Created by sunxin on 2017/3/2.
 */
/**
 * Created by sunxin on 2016/12/28.
 */
var vue=new Vue({
    el: "#app",
    data: {
        question:"",
        pwd:"",
        pwd1:"",
        answer:"",
        resetPending:false,
        questionPending:false,
        step:0,
        username:""
    },
    methods:{
        getQuestion:function () {
            var _this=this;
            if(!this.username)
            {
                $.tip("用户名不能为空",0);
                return;
            }
            this.questionPending=true;
            net.get("/user/question",{
                name:_this.username,
            },{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                _this.questionPending=false;
                if(data.code==200)
                {
                    $.notify(data.msg,1);
                    _this.step=1;
                    _this.question=data.data;
                }
                else
                {
                    $.notify(data.msg,0);
                }
            })
        },
        reset:function () {
            var _this=this;
            if(!this.pwd || !this.pwd1 || !this.answer )
            {
                $.tip("密码,确认密码,找回密码答案不能为空",0);
                return;
            }
            else if(this.pwd!=this.pwd1)
            {
                $.tip("两次输入的密码不一致",0);
                return;
            }
            this.questionPending=true;
            net.put("/user/reset",{
                name:_this.username,
                answer:_this.answer,
                password:_this.pwd
            },{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                _this.questionPending=false;
                if(data.code==200)
                {
                    $.notify(data.msg,1);
                    setTimeout(function () {
                        location.href="../login/login.html"
                    },1500);
                }
                else
                {
                    $.notify(data.msg,0);
                }
            })
        }
    },
})
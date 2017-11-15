/**
 * Created by sunxin on 2016/12/17.
 */
var mainNav=require("../component/mainNav.vue")
var imgFile=require("../director/imgFile")
var proxyImg=require("../director/proxyImg")
var config=require("../util/config");
var sessionChange=require("../mixins/session");
var vue=new Vue({
    el: "#app",
    data: {
        infoShow:1,
        oldPass:"",
        newPass:"",
        newPass1:"",
        savePending:false,
        passPending:false,
        sendPending:false,
        sendInfo:{}
    },
    mixins:[sessionChange],
    components:{
        "mainnav":mainNav,
    },
    methods:{
        saveInfo:function () {
            var _this=this;
            var obj={};
            if($.query("#file").value)
            {
                obj.photo=$.query("#file").files[0];
            }
            if(this.session.age)
            {
                obj.age=this.session.age
            }
            if(this.session.sex)
            {
                obj.sex=this.session.sex
            }
            if(this.session.company)
            {
                obj.company=this.session.company
            }
            if(this.session.qq)
            {
                obj.qq=this.session.qq
            }
            if(this.session.email)
            {
                obj.email=this.session.email
            }
            if(this.session.phone)
            {
                obj.phone=this.session.phone
            }
            obj.userid=this.session.id;
            this.savePending=true;
            net.upload("post","/user/save",obj).then(function (data) {
                _this.savePending=false;
                if(data.code==200)
                {
                    _this.$notify({
                        title: '更新成功',
                        type: 'success'
                    });
                    session.update(data.data);
                    _this.session=$.clone(session.raw());
                    _this.$emit("updatePhoto",data.data.photo);
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
        editPass:function () {
            if(!this.oldPass || !this.newPass || !this.newPass1)
            {
                this.$message.error("请填写完整信息");
                return;
            }
            else if(this.newPass!=this.newPass1)
            {
                this.$message.error("两次填写的密码不一致");
                return;
            }
            var _this=this;
            this.passPending=true;
            net.put("/user/editpass",{
               userid:_this.session.id,
                oldpass:_this.oldPass,
                newpass:_this.newPass
            },{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                _this.passPending=false;
                if(data.code==200)
                {
                    _this.$notify({
                        title: '修改成功',
                        type: 'success'
                    });
                    _this.oldPass="";
                    _this.newPass="";
                    _this.newPass1="";
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
        saveSendInfo:function () {
            if(!this.sendInfo.user)
            {
                $.tip("请输入邮箱账户",0);
                return;
            }
            else if(!this.sendInfo.password)
            {
                $.tip("请输入邮箱密码",0);
                return;
            }
            else if(!this.sendInfo.smtp)
            {
                $.tip("请输入smtp地址",0);
                return;
            }
            else if(!this.sendInfo.port)
            {
                $.tip("请输入smtp端口",0);
                return;
            }
            var _this=this;
            this.sendPending=true;
            net.put("/user/sendinfo",this.sendInfo).then(function (data) {
                _this.sendPending=false;
                if(data.code==200)
                {
                    $.notify("保存成功",1);
                }
                else
                {
                    $.notify(data.msg,0)
                }
            })
        }
    },
    directives:{
        "imgfile":imgFile,
        "proxy":proxyImg
    },
    created:function () {
        var _this=this;
        net.get("/user/sendinfo").then(function (data) {
            $.stopLoading();
            if(data.code==200)
            {
                _this.sendInfo=data.data;
            }
            else
            {
                $.notify(data.msg,0)
            }
        })
    }
})

$.ready(function () {
   $.startLoading();
})






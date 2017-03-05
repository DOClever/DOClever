/**
 * Created by sunxin on 2016/12/20.
 */
var mainNav=require("../component/mainNav.vue")
var urlList=require("../component/urlList.vue")
var userEdit=require("../component/userEdit.vue")
if(!session.get("id"))
{
    location.href="../login/login.html"
}
else if(!session.get("projectId"))
{
    location.href="../project/project.html"
}
var vue=new Vue({
    el: "#app",
    data: {
        type:0,
        session:$.clone(session.raw()),
        project:{},
        name:"",
        role:0,
        invitePending:false,
        infoPending:false,
        deletePending:false,
    },
    components:{
        "mainnav":mainNav,
        "urllist":urlList,
        "useredit":userEdit,
    },
    methods:{
        saveInfo:function () {
            var _this=this;
            this.infoPending=true;
            net.post("/project/create",{
                id:session.get("projectId"),
                dis:_this.project.dis,
                name:_this.project.name
            }).then(function (data) {
                _this.infoPending=false;
                if(data.code)
                {
                    $.notify("修改成功",1);
                }
                else
                {
                    $.notify(data.msg,0);
                }
            })
        },
        saveUrls:function (arr) {
            this.project.baseUrls=arr;
        },
        invite:function () {
            var _this=this;
            this.invitePending=true;
            net.post("/project/member",{
                id:session.get("projectId"),
                user:_this.name,
                role:_this.role
            }).then(function (data) {
                _this.invitePending=false;
                if(data.code==200)
                {
                    $.notify("修改成功",1);
                    _this.project.users.push(data.data);
                }
                else
                {
                    $.notify(data.msg,0);
                }
            })
        },
        removeProject:function () {
            var _this=this;
            if(this.session.own==1)
            {
                $.confirm("确定删除该工程？该工程下的所有数据都会被删除!",function () {
                    _this.deletePending=true;
                    net.delete("/project/item",{
                        id:session.get("projectId")
                    }).then(function (data) {
                        _this.deletePending=false;
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            setTimeout(function () {
                                location.href="../project/project.html"
                            },1500);

                        }
                    })
                })
            }
            else
            {
                $.confirm("确定退出该工程？",function () {
                    _this.deletePending=true;
                    net.delete("/project/quit",{
                        id:session.get("projectId")
                    }).then(function (data) {
                        _this.deletePending=false;
                        if(data.code==200)
                        {
                            $.notify("退出成功",1);
                            setTimeout(function () {
                                location.href="../project/project.html"
                            },1500);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            }
        }
    },
    created:function () {
        var _this=this;
        net.get("/project/info",{
            id:session.get("projectId")
        }).then(function (data) {
            $.stopLoading();
            if(data.code==200)
            {
                _this.project=data.data;

            }
        })
    }
})

$.ready(function () {
    $.startLoading();
})










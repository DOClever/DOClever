/**
 * Created by sunxin on 2016/12/19.
 */
var mainNav=require("../component/mainNav.vue");
var teamInfo=require("./component/teamInfo.vue");
var teamProjectList=require("./component/teamProjectList.vue");
var teamUser=require("./component/teamUser.vue");
var store=require("./store");
var sessionChange=require("../mixins/session");
if(!session.get("teamId"))
{
    location.href="../project/project.html"
}
session.remove("projectId");
session.remove("projectName");
session.remove("versionId");
session.remove("versionName");
session.remove("versionDis");
var vue=new Vue({
    el: "#app",
    data: {
        type:1,
        showAdd:false,
        addPending:false,
        newType:0,
        name:"",
        dis:"",
        id:"",
        arrApply:[],
        showApply:false,
        applyPending:false,
        showUserApply:false,
        newUserGroup:"",
        newUserRole:1,
        selUserApplyObj:{}
    },
    mixins:[sessionChange],
    store:store,
    components:{
        "mainnav":mainNav,
        "teaminfo":teamInfo,
        "teamprojectlist":teamProjectList,
        "teamuser":teamUser
    },
    computed:{
        user:function () {
            return store.state.user;
        },
        ownRole:function () {
            return store.getters.ownRole;
        },
        manageRole:function () {
            return store.getters.manageRole;
        }
    },
    methods:{
        addProject:function () {
            var _this=this;
            if(this.newType==0)
            {
                if(!this.name)
                {
                    this.$message.error("请输入名称");
                    return;
                }
                this.addPending=true;
                net.post("/project/create",{
                    name:_this.name,
                    dis:_this.dis,
                    team:session.get("teamId")
                }).then(function (data) {
                    _this.addPending=false;
                    _this.name="";
                    _this.dis=""
                    if(data.code==200)
                    {
                        store.state.project.unshift(data.data);
                        $.notify("创建成功",1);
                        _this.showAdd=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
            else
            {
                if(!this.id)
                {
                    this.$message.error("请输入项目ID");
                    return;
                }
                this.addPending=true;
                net.put("/team/pullproject",{
                    id:session.get("teamId"),
                    project:this.id
                }).then(function (data) {
                    _this.addPending=false;
                    _this.name="";
                    _this.dis=""
                    _this.id=""
                    if(data.code==200)
                    {
                        $.notify("请求已发出，等待项目管理员响应",1);
                        _this.showAdd=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        importProject:function () {
            $.showBox(this,require("../component/importProject.vue"));
        },
        addGroup:function () {
            var _this=this;
            $.input("请输入部门名称",function (val) {
                if(!val.value)
                {
                    $.tip("请输入部门名称",0);
                    return;
                }
                $.startHud();
                net.post("/team/group",{
                    id:session.get("teamId"),
                    name:val.value
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("新建成功",1);
                        store.state.user.push(data.data);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            })
        },
        handleApply:function (item,state) {
            var _this=this;
            if(item.type==2)
            {
                this.newUserGroup=store.state.user[0]._id;
                this.newUserRole=1;
                this.selUserApplyObj={
                    item:item,
                    state:state
                }
                if(state==1)
                {
                    this.showUserApply=true;
                }
                else
                {
                    this.handleUserApply();
                }
            }
            else if(item.type==3)
            {
                $.startHud();
                net.put("/team/apply",{
                    id:session.get("teamId"),
                    apply:item._id,
                    state:state
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        if(typeof(data.data)=="object")
                        {
                            item.handle=1;
                            store.state.project.unshift(data.data);
                        }
                        else
                        {
                            item.handle=2;
                        }
                    }
                    else
                    {
                        item.handle=3;
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        handleUserApply:function () {
            var _this=this;
            this.applyPending=true;
            net.put("/team/apply",{
                id:session.get("teamId"),
                apply:this.selUserApplyObj.item._id,
                group:this.newUserGroup,
                role:this.newUserRole,
                state:this.selUserApplyObj.state
            }).then(function (data) {
                _this.applyPending=false;
                if(data.code==200)
                {
                    if(typeof(data.data)=="object")
                    {
                        _this.selUserApplyObj.item.handle=1;
                        store.state.user.forEach(function (obj) {
                            if(obj._id==_this.newUserGroup)
                            {
                                obj.users.push(data.data);
                                obj.users.sort(function (obj1,obj2) {
                                    return obj1.user.name>obj2.user.name
                                })
                            }
                        })
                    }
                    else
                    {
                        _this.selUserApplyObj.item.handle=2;
                    }
                }
                else
                {
                    _this.selUserApplyObj.item.handle=3;
                    $.notify(data.msg,0);
                }
                _this.showUserApply=false;
            })
        }
    },
    created:function () {
        var _this=this;
        Promise.all([
            net.get("/team/info",{
                id:_this.session.teamId
            }),
            net.get("/team/apply",{
                id:_this.session.teamId
            })
        ]).then(function (arr) {
            $.stopLoading();
            var data1=arr[0];
            var data2=arr[1];
            if(data1.code==200)
            {
                store.commit("setTeam",data1.data);
                _this.newUserGroup=data1.data.user[0]._id;
            }
            else
            {
                throw data1.msg;
            }
            if(data2.code==200)
            {
                data2.data.forEach(function (obj) {
                    obj.handle=0;
                })
                _this.arrApply=data2.data;
                if(_this.arrApply.length>0)
                {
                    _this.showApply=true;
                }
            }
            else
            {
                throw data2.msg;
            }
        }).catch(function (err) {
            $.notify(err,0);
        })
    },
})
$.ready(function () {
    $.startLoading();
})
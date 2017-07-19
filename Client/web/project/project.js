/**
 * Created by sunxin on 2016/12/19.
 */
var mainNav=require("../component/mainNav.vue")
var projectList=require("../component/projectList.vue")
var teamList=require("../component/teamList.vue")
if(!session.get("id"))
{
    location.href="../login/login.html"
}
session.remove("teamId");
session.remove("teamName");
session.remove("teamRole");
session.remove("teamOwn");
session.remove("versionId");
session.remove("versionName");
session.remove("versionDis");
var vue=new Vue({
    el: "#app",
    data: {
        photo:session.get("photo"),
        name:session.get("name"),
        projectList:[],
        teamList:[],
        showAdd:false,
        showTeam:false,
        name:"",
        dis:"",
        addPending:false,
        arrApply:[],
        showApply:false
    },
    components:{
        "mainnav":mainNav,
        "projectlist":projectList,
        "teamlist":teamList
    },
    methods:{
        addProject:function () {
            if(!this.name)
            {
                this.$message.error("请输入名称");
                return;
            }
            var _this=this;
            this.addPending=true;
            net.post("/project/create",{
                name:_this.name,
                dis:_this.dis
            },{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                _this.addPending=false;
                _this.name="";
                _this.dis=""
                if(data.code==200)
                {
                    _this.projectList.unshift(data.data);
                    _this.$notify({
                        title: '创建成功',
                        type: 'success'
                    });
                    _this.showAdd=false;
                }
            })
        },
        addTeam:function () {
            if(!this.name)
            {
                this.$message.error("请输入名称");
                return;
            }
            var _this=this;
            this.addPending=true;
            net.post("/team/save",{
                name:_this.name,
                dis:_this.dis
            }).then(function (data) {
                _this.addPending=false;
                _this.name="";
                _this.dis=""
                if(data.code==200)
                {
                    _this.teamList.unshift(data.data);
                    _this.$notify({
                        title: '创建成功',
                        type: 'success'
                    });
                    _this.showTeam=false;
                }
            })
        },
        importProject:function () {
            $.showBox(this,"importProject");
        },
        handleApply:function (item,state) {
            var _this=this;
            $.startHud();
            net.put("/user/handleapply",{
                apply:item._id,
                state:state
            }).then(function (data) {
                $.stopHud();
                if(data.code==200)
                {
                    if(typeof(data.data)=="object")
                    {
                        item.handle=1;
                        _this.teamList.unshift(data.data);
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
    created:function () {
        var _this=this;
        Promise.all([
            net.get("/project/list",{}),
            net.get("/user/applylist",{})
        ]).then(function (arr) {
            $.stopLoading();
            var data1=arr[0];
            var data2=arr[1];
            if(data1.code==200)
            {
                for(var i=0;i<data1.data.project.length;i++)
                {
                    _this.projectList.push(data1.data.project[i]);
                }
                for(var i=0;i<data1.data.team.length;i++)
                {
                    _this.teamList.push(data1.data.team[i]);
                }
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
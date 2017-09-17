/**
 * Created by sunxin on 2016/12/19.
 */
var mainNav=require("../component/mainNav.vue")
var projectList=require("./component/projectList.vue")
var teamList=require("./component/teamList.vue")
var store=require("./store");
session.remove("teamId");
session.remove("teamName");
session.remove("versionId");
session.remove("versionName");
session.remove("versionDis");
var vue=new Vue({
    el: "#app",
    data: {
        showAdd:false,
        showTeam:false,
        name:"",
        dis:"",
        addPending:false,
        showApply:false,
        tab:"project"
    },
    store:store,
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
            store.dispatch("addProject",{
                name:this.name,
                dis:this.dis
            }).then(function (data) {
                _this.addPending=false;
                _this.name="";
                _this.dis=""
                if(data.code==200)
                {
                    $.notify("创建成功",1);
                    _this.showAdd=false;
                }
                else
                {
                    $.notify(data.msg,0);
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
            store.dispatch("addTeam",{
                name:this.name,
                dis:this.dis
            }).then(function (data) {
                _this.addPending=false;
                _this.name="";
                _this.dis=""
                if(data.code==200)
                {
                    $.notify("创建成功",1);
                    _this.showTeam=false;
                }
                else
                {
                    $.notify(data.msg,0);
                }
            })
        },
        importProject:function () {
            $.showBox(this,"importProject");
        },
        handleApply:function (item,state) {
            var _this=this;
            $.startHud();
            store.dispatch("handleApply",{
                item:item,
                state:state
            }).then(function (data) {
                $.stopHud();
                if(data.code!=200)
                {
                    $.notify(data.msg,0);
                }
            })
        }
    },
    created:function () {
        var _this=this;
        store.dispatch("getList").then(function () {
            $.stopLoading();
            if(store.state.arrApply.length>0)
            {
                _this.showApply=true;
            }
        }).catch(function (err) {
            $.notify(err,0);
        })
    },
})
$.ready(function () {
    $.startLoading();
})
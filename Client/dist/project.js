webpackJsonp([1],{

/***/ 292:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(session, Vue, $) {/**
 * Created by sunxin on 2016/12/19.
 */
var mainNav=__webpack_require__(7)
var projectList=__webpack_require__(31)
var teamList=__webpack_require__(32)
var store=__webpack_require__(82);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(2), __webpack_require__(0)))

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vuex, net) {module.exports=new Vuex.Store({
    state:{
        projectCreateList:[],
        projectJoinList:[],
        teamCreateList:[],
        teamJoinList:[],
        projectCreateSort:0,
        projectJoinSort:0,
        teamCreateSort:0,
        teamJoinSort:0,
        arrApply:[],
    },
    getters:{

    },
    mutations:{
        addProjectCreate:function (state,data) {
            if(state.projectCreateSort==0)
            {
                state.projectCreateList.unshift(data);
            }
            else
            {
                for(var i=0;;i++)
                {
                    if(i==state.projectCreateList.length || state.projectCreateList[i].name.toLowerCase()>=data.name.toLowerCase())
                    {
                        state.projectCreateList.splice(i,0,data);
                        break;
                    }
                }
            }
        },
        addTeamCreate:function (state,data) {
            if(state.teamCreateSort==0)
            {
                state.teamCreateList.unshift(data);
            }
            else
            {
                for(var i=0;;i++)
                {
                    if(i==state.teamCreateList.length || state.teamCreateList[i].name.toLowerCase()>=data.name.toLowerCase())
                    {
                        state.teamCreateList.splice(i,0,data);
                        break;
                    }
                }
            }
        },
        addTeamJoin:function (state,data) {
            if(state.teamJoinSort==0)
            {
                state.teamJoinList.unshift(data);
            }
            else
            {
                for(var i=0;;i++)
                {
                    if(i==state.teamJoinList.length || state.teamJoinList[i].name.toLowerCase()>=data.name.toLowerCase())
                    {
                        state.teamJoinList.splice(i,0,data);
                        break;
                    }
                }
            }
        },
        changeProjectSortCreate:function (state,data) {
            if(state.projectCreateSort==0)
            {
                state.projectCreateList.sort(function (obj1,obj2) {
                    if(obj1.createdAt>obj2.createdAt)
                    {
                        return -1;
                    }
                    else if(obj1.createdAt<obj2.createdAt)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                })
            }
            else
            {
                state.projectCreateList.sort(function (obj1,obj2) {
                    if(obj1.name.toLowerCase()<obj2.name.toLowerCase())
                    {
                        return -1;
                    }
                    else if(obj1.name.toLowerCase()>obj2.name.toLowerCase())
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                })
            }
        },
        changeProjectSortJoin:function (state,data) {
            if(state.projectJoinSort==0)
            {
                state.projectJoinList.sort(function (obj1,obj2) {
                    if(obj1.createdAt>obj2.createdAt)
                    {
                        return -1;
                    }
                    else if(obj1.createdAt<obj2.createdAt)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                })
            }
            else
            {
                state.projectJoinList.sort(function (obj1,obj2) {
                    if(obj1.name.toLowerCase()<obj2.name.toLowerCase())
                    {
                        return -1;
                    }
                    else if(obj1.name.toLowerCase()>obj2.name.toLowerCase())
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                })
            }
        },
        changeTeamSortCreate:function (state,data) {
            if(state.teamCreateSort==0)
            {
                state.teamCreateList.sort(function (obj1,obj2) {
                    if(obj1.createdAt>obj2.createdAt)
                    {
                        return -1;
                    }
                    else if(obj1.createdAt<obj2.createdAt)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                })
            }
            else
            {
                state.teamCreateList.sort(function (obj1,obj2) {
                    if(obj1.name.toLowerCase()<obj2.name.toLowerCase())
                    {
                        return -1;
                    }
                    else if(obj1.name.toLowerCase()>obj2.name.toLowerCase())
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                })
            }
        },
    },
    actions:{
        addProject:function (context,data) {
            return net.post("/project/create",{
                name:data.name,
                dis:data.dis
            }).then(function (data) {
                if(data.code==200)
                {
                    context.commit("addProjectCreate",data.data);
                }
                return data;
            })
        },
        addTeam:function (context,data) {
            return net.post("/team/save",{
                name:data.name,
                dis:data.dis
            }).then(function (data) {
                if(data.code==200)
                {
                    context.commit("addTeamCreate",data.data);
                }
                return data;
            })
        },
        handleApply:function (context,data) {
            return net.put("/user/handleapply",{
                apply:data.item._id,
                state:data.state
            }).then(function (data) {
                if(data.code==200)
                {
                    if(typeof(data.data)=="object")
                    {
                        data.item.handle=1;
                        context.commit("addTeamJoin",data.data);
                    }
                    else
                    {
                        data.item.handle=2;
                    }
                }
                else
                {
                    data.item.handle=3;
                }
            })
        },
        getList:function (context) {
            return Promise.all([
                net.get("/project/list",{}),
                net.get("/user/applylist",{})
            ]).then(function (arr) {
                var data1=arr[0];
                var data2=arr[1];
                if(data1.code==200)
                {
                    for(var i=0;i<data1.data.project.create.length;i++)
                    {
                        context.state.projectCreateList.push(data1.data.project.create[i]);
                    }
                    for(var i=0;i<data1.data.project.join.length;i++)
                    {
                        context.state.projectJoinList.push(data1.data.project.join[i]);
                    }
                    for(var i=0;i<data1.data.team.create.length;i++)
                    {
                        context.state.teamCreateList.push(data1.data.team.create[i]);
                    }
                    for(var i=0;i<data1.data.team.join.length;i++)
                    {
                        context.state.teamJoinList.push(data1.data.team.join[i]);
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
                    context.state.arrApply=data2.data;
                }
                else
                {
                    throw data2.msg;
                }
            })
        }
    }
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18), __webpack_require__(4)))

/***/ })

},[292]);
//# sourceMappingURL=project.js.map
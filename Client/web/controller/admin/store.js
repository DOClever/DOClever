module.exports=new Vuex.Store({
    state:{
        user:{
            total:0,
            todayLogin:0,
            todayRegister:0,
            list:[]
        },
        project:{
            interface:{
                total:0,
                todayCreate:0,
                list:[]
            },
            doc:{
                total:0,
                todayCreate:0,
                list:[]
            },
            test:{
                total:0,
                todayCreate:0,
                list:[]
            },
        },
        team:{
            total:0,
            todayCreate:0,
            list:[]
        },
        item:{
            interface:{
                total:0,
                todayCreate:0,
            },
            doc:{
                total:0,
                todayCreate:0,
            },
            test:{
                total:0,
                todayCreate:0,
            },
        },
        setting:{
            info: {

            },
            connect: {

            },
            db: {

            },
            files: []
        }
    },
    mutations:{
        setUserInfo:function (state,data) {
            state.user.total=data.total;
            state.user.todayLogin=data.login;
            state.user.todayRegister=data.register;
        },
        setProjectInfo:function (state,data) {
            state.project.interface.total=data.interfaceTotal;
            state.project.interface.todayCreate=data.interfaceToday;
            state.project.doc.total=data.docTotal;
            state.project.doc.todayCreate=data.docToday;
            state.project.test.total=data.testTotal;
            state.project.test.todayCreate=data.testToday;
        },
        setTeamInfo:function (state,data) {
            state.team.total=data.total;
            state.team.todayCreate=data.today;
        },
        setInterfaceInfo:function (state,data) {
            state.item.interface.total=data.interface.total;
            state.item.interface.todayCreate=data.interface.today;
            state.item.doc.total=data.doc.total;
            state.item.doc.todayCreate=data.doc.today;
            state.item.test.total=data.test.total;
            state.item.test.todayCreate=data.test.today;
        },
        setSettingInfo:function (state,data) {
            state.setting=data;
        }
    },
    actions:{
        userList:function (context,query) {
            return net.get("/admin/userlist",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.user.list=data.data;
                }
                return data;
            })
        },
        saveUser:function (context,query) {
            return net.upload("post","/admin/user",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.user.list.forEach(function (obj) {
                        if(obj._id==data.data._id)
                        {
                            obj.name=data.data.name;
                            obj.photo=data.data.photo;
                            obj.state=data.data.state;
                        }
                    })
                }
                return data
            })
        },
        removeUser:function (context,query) {
            return net.delete("/admin/user",{
                id:query.id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.user.list.splice(query.index,1);
                }
                return data;
            })
        },
        saveProject:function (context,query) {
            return net.put("/admin/project",query).then(function (data) {
                if(data.code==200)
                {
                    let list;
                    if(query.category==0)
                    {
                        list=context.state.project.interface.list;
                    }
                    else if(query.category==1)
                    {
                        list=context.state.project.doc.list;
                    }
                    else
                    {
                        list=context.state.project.test.list;
                    }
                    list.forEach(function (obj) {
                        if(obj._id==data.data._id)
                        {
                            obj.name=data.data.name;
                            obj.public=data.data.public;
                        }
                    })
                }
                return data
            })
        },
        removeProject:function (context,query) {
            return net.delete("/admin/project",{
                id:query.id,
                category:query.category
            }).then(function (data) {
                if(data.code==200)
                {
                    let list;
                    if(query.category==0)
                    {
                        list=context.state.project.interface.list;
                    }
                    else if(query.category==1)
                    {
                        list=context.state.project.doc.list;
                    }
                    else
                    {
                        list=context.state.project.test.list;
                    }
                    list.splice(query.index,1);
                }
                return data;
            })
        },
        projectList:function (context,query) {
            return net.get("/admin/projectlist",query).then(function (data) {
                if(data.code==200)
                {
                    if(query.category==0)
                    {
                        context.state.project.interface.list=data.data;
                    }
                    else if(query.category==1)
                    {
                        context.state.project.doc.list=data.data;
                    }
                    else
                    {
                        context.state.project.test.list=data.data;
                    }
                }
                return data;
            })
        },
        teamList:function (context,query) {
            return net.get("/admin/teamlist",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.team.list=data.data;
                }
                return data;
            })
        },
        removeTeam:function (context,query) {
            return net.delete("/admin/team",{
                id:query.id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.team.list.splice(query.index,1);
                }
                return data;
            })
        },
        editPassword:function (context,query) {
            return net.put("/admin/password",query).then(function (data) {
                return data;
            })
        },
        teamRemoveProject:function (context,query) {
            return net.put("/admin/teampushproject",{
                id:query.team,
                project:query.project
            }).then(function (data) {
                return data;
            })
        },
        setProjectOwner:function (context,query) {
            return net.put("/admin/userprojectown",{
                id:query.project,
                user:query.user,
                category:query.category
            }).then(function (data) {
                return data;
            })
        },
        searchUser:function (context,name) {
            return net.get("/admin/searchuser",{
                user:name
            }).then(function (data) {
                return data
            })
        },
        addProject:function (context,obj) {
            return net.post("/admin/project",obj).then(function (data) {
                return data;
            })
        },
        removeProjectUser:function (context,obj) {
            return net.delete("/admin/projectuser",{
                id:obj.id,
                user:obj.user,
                category:obj.category
            }).then(function (data) {
                return data;
            })
        },
        editProjectUser:function (context,obj) {
            return net.post("/admin/projectuserrole",obj).then(function (data) {
                return data;
            })
        },
        projectUserList:function (context,obj) {
            return net.get("/admin/projectuserlist",{
                id:obj.id,
                category:obj.category
            }).then(function (data) {
                return data;
            })
        },
        setTeamOwner:function (context,obj) {
            return net.put("/admin/userteamown",obj).then(function (data) {
                return data
            })

        },
        addTeam:function (context,obj) {
            return net.post("/admin/team",obj).then(function (data) {
                return data;
            })
        },
        pullTeamUser:function (context,obj) {
            return net.post("/admin/addteamuser",obj).then(function (data) {
                return data;
            })
        },
        addTeamGroup:function (context,obj) {
            return net.post("/admin/teamgroup",obj).then(function (data) {
                return data;
            })
        },
        removeTeamGroup:function (context,obj) {
            return net.delete("/admin/teamgroup",obj).then(function (data) {
                return data;
            })
        },
        editTeamUserRole:function (context,obj) {
            return net.put("/admin/teamuser",obj).then(function (data) {
                return data;
            })
        },
        removeTeamUser:function (context,obj) {
            return net.delete("/admin/teamuser",obj).then(function (data) {
                return data;
            })
        },
        moveTeamUser:function (context,obj) {
            return net.put("/admin/moveteamuser",obj).then(function (data) {
                return data;
            })
        },
        getTeamUserList:function (context,obj) {
            return net.get("/admin/teamuserlist",obj).then(function (data) {
                return data;
            })
        },
        editTeamInfo:function(context,obj){
            return net.put("/admin/team",obj).then(function (data) {
                return data;
            })
        },
        getTeamProjectList:function (context,obj) {
            return net.get("/admin/teamprojectlist",obj).then(function (data) {
                return data;
            })
        },
        pullTeamProject:function (context,obj) {
            return net.put("/admin/teampullproject",obj).then(function (data) {
                return data;
            })
        },
        pushTeamProject:function (context,obj) {
            return net.put("/admin/teampushproject",obj).then(function (data) {
                return data;
            })
        }
    }

})
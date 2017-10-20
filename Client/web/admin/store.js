module.exports=new Vuex.Store({
    state:{
        user:{
            total:0,
            todayLogin:0,
            todayRegister:0,
            list:[]
        },
        project:{
            total:0,
            todayCreate:0,
            list:[]
        },
        team:{
            total:0,
            todayCreate:0,
            list:[]
        },
        interface:{
            total:0,
            todayCreate:0,
        },
    },
    mutations:{
        setUserInfo:function (state,data) {
            state.user.total=data.total;
            state.user.todayLogin=data.login;
            state.user.todayRegister=data.register;
        },
        setProjectInfo:function (state,data) {
            state.project.total=data.total;
            state.project.todayCreate=data.today;
        },
        setTeamInfo:function (state,data) {
            state.team.total=data.total;
            state.team.todayCreate=data.today;
        },
        setInterfaceInfo:function (state,data) {
            state.interface.total=data.total;
            state.interface.todayCreate=data.today;
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
                    context.state.project.list.forEach(function (obj) {
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
                id:query.id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.project.list.splice(query.index,1);
                }
                return data;
            })
        },
        projectList:function (context,query) {
            return net.get("/admin/projectlist",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.project.list=data.data;
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
        }
    }

})
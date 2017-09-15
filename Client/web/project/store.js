module.exports=new Vuex.Store({
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
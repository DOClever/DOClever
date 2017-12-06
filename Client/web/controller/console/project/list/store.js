module.exports={
    namespaced:true,
    state:{
        projectCreateList:[],
        projectJoinList:[],
        projectPublicList:[],
        projectTeamList:[],
        projectCreateSort:0,
        projectJoinSort:0,
        projectPublicSort:0,
        projectTeamSort:0
    },
    getters:{
        projectCreateSort:function (state) {
            return state.projectCreateSort;
        },
        projectJoinSort:function (state) {
            return state.projectJoinSort;
        },
        projectPublicSort:function (state) {
            return state.projectPublicSort;
        },
        rootInit:function (state,getters,rootState) {
            return rootState.init;
        },
        teamManageRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["team/info/manageRole"];
        }
    },
    mutations:{
        addProject:function (state,data) {
            var sort,list;
            if(session.get("teamId"))
            {
                sort=state.projectTeamSort;
                list=state.projectTeamList;
            }
            else
            {
                sort=state.projectCreateSort;
                list=state.projectCreateList;
            }
            if(sort==0)
            {
                list.unshift(data);
            }
            else
            {
                for(var i=0;;i++)
                {
                    if(i==list.length || list[i].name.toLowerCase()>=data.name.toLowerCase())
                    {
                        list.splice(i,0,data);
                        break;
                    }
                }
            }
        },
        changeProjectSort:function (state,type) {
            var sortType,list;
            if(type=="create")
            {
                sortType=state.projectCreateSort;
                list=state.projectCreateList;
            }
            else if(type=="join")
            {
                sortType=state.projectJoinSort;
                list=state.projectJoinList;
            }
            else if(type=="public")
            {
                sortType=state.projectPublicSort;
                list=state.projectPublicList;
            }
            else if(type=="team")
            {
                sortType=state.projectTeamSort;
                list=state.projectTeamList;
            }
            if(sortType==0)
            {
                list.sort(function (obj1,obj2) {
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
                list.sort(function (obj1,obj2) {
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
            var query={
                name:data.name,
                dis:data.dis
            };
            if(session.get("teamId"))
            {
                query.team=session.get("teamId");
            }
            return net.post("/project/create",query).then(function (data) {
                if(data.code==200)
                {
                    context.commit("addProject",data.data);
                }
                return data;
            })
        },
        init:function (context,data) {
            context.state.projectCreateList=[];
            context.state.projectJoinList=[];
            context.state.projectPublicList=[];
            context.state.projectTeamList=[];
            context.state.projectCreateSort=0;
            context.state.projectJoinSort=0;
            context.state.projectPublicSort=0;
            context.state.projectTeaSort=0;
            if(data)
            {
                context.state.projectTeamList=data;
                return {
                    code:200
                }
            }
            else if(session.get("teamId"))
            {
                return net.get("/team/projectlist",{
                    id:session.get("teamId")
                }).then(function (data) {
                    if(data.code==200)
                    {
                        for(var i=0;i<data.data.length;i++)
                        {
                            context.state.projectTeamList.push(data.data[i]);
                        }
                        context.rootState.event.$emit("updateTeamProjectList",context.state.projectTeamList);
                    }
                    else
                    {
                        throw data.msg;
                    }
                    return data;
                })
            }
            else
            {
                return net.get("/project/list",{}).then(function (data) {
                    if(data.code==200)
                    {
                        for(var i=0;i<data.data.create.length;i++)
                        {
                            context.state.projectCreateList.push(data.data.create[i]);
                        }
                        for(var i=0;i<data.data.join.length;i++)
                        {
                            context.state.projectJoinList.push(data.data.join[i]);
                        }
                        for(var i=0;i<data.data.public.length;i++)
                        {
                            context.state.projectPublicList.push(data.data.public[i]);
                        }
                    }
                    else
                    {
                        throw data.msg;
                    }
                    return data;
                })
            }
        },
        info:function (context,obj) {
            context.dispatch("project/changeToInfo",obj,{
                root:true
            });
        }
    },
    modules:{

    }
}
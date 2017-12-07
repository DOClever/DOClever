module.exports={
    namespaced:true,
    state:{
        teamCreateList:[],
        teamJoinList:[],
        teamCreateSort:0,
        teamJoinSort:0,
        bRefreshProjectList:1
    },
    getters:{
        event:function (state,getters,rootState) {
            return rootState.event;
        },
        teamListLength:function (state) {
            return state.teamCreateList.length+state.teamJoinList.length;
        },
        projectCreateSort:function (state) {
            return state.teamCreateSort;
        },
        projectJoinSort:function (state) {
            return state.teamJoinSort;
        },
        rootInit:function (state,getters,rootState) {
            return rootState.init;
        }
    },
    mutations:{
        addTeam:function (state,data) {
            var sort=state.teamCreateSort,list=state.teamCreateList;
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
        changeTeamSort:function (state,type) {
            var sortType,list;
            if(type=="create")
            {
                sortType=state.teamCreateSort;
                list=state.teamCreateList;
            }
            else if(type=="join")
            {
                sortType=state.teamJoinSort;
                list=state.teamJoinList;
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
        addTeam:function (context,data) {
            var query={
                name:data.name,
                dis:data.dis
            };
            return net.post("/team/save",query).then(function (data) {
                if(data.code==200)
                {
                    context.commit("addTeam",data.data);
                }
                return data;
            })
        },
        init:function (context) {
            context.state.teamCreateList=[];
            context.state.teamJoinList=[];
            context.state.teamCreateSort=0;
            context.state.teamJoinSort=0;
            var arr=[
                net.get("/team/list",{}),
            ];
            if(context.getters.rootInit && context.rootState.project.type=="list" && context.state.bRefreshProjectList)
            {
                arr.push(context.dispatch("project/list/init",null,{
                    root:true
                }))
            }
            context.state.bRefreshProjectList=1;
            return Promise.all(arr).then(function (arr) {
                var data1=arr[0];
                if(data1.code==200)
                {
                    for(var i=0;i<data1.data.create.length;i++)
                    {
                        context.state.teamCreateList.push(data1.data.create[i]);
                    }
                    for(var i=0;i<data1.data.join.length;i++)
                    {
                        context.state.teamJoinList.push(data1.data.join[i]);
                    }
                }
                else
                {
                    throw data1.msg;
                }
                context.getters.event.$emit("initTeamList");
                return arr;
            })
        },
        info:function (context,obj) {
            context.dispatch("team/changeToInfo",obj,{
                root:true
            });
        }
    },
    modules:{

    }
}
var info=require("./info/store.js")
module.exports={
    namespaced:true,
    modules:{
        info:info
    },
    state:{
        teamCreateList:[],
        teamJoinList:[],
        teamCreateSort:0,
        teamJoinSort:0,
        tabList:[],
        tabSelId:""
    },
    getters:{
        event:function (state,getters,rootState) {
            return rootState.event;
        },
        teamListLength:function (state) {
            return state.teamCreateList.length+state.teamJoinList.length;
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
        changeTeamCreateSort:function (state,val) {
            var sortType,list;
            sortType=state.teamCreateSort;
            list=state.teamCreateList;
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
            state.teamCreateSort=val;
        },
        changeTeamJoinSort:function (state,val) {
            var sortType,list;
            sortType=state.teamJoinSort;
            list=state.teamJoinList;
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
            state.teamJoinSort=val;
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
                    data.data.type=0;
                    data.data.sessionInfo={};
                    context.commit("addTeam",data.data);
                }
                return data;
            })
        },
        init:async function (context) {
            context.state.teamCreateList=[];
            context.state.teamJoinList=[];
            context.state.teamCreateSort=0;
            context.state.teamJoinSort=0;
            context.state.tabList=[];
            context.state.tabSelId="";
            let data=await net.get("/team/list",{});
            if(data.code==200)
            {
                for(var i=0;i<data.data.create.length;i++)
                {
                    data.data.create[i].type=0;
                    data.data.create[i].sessionInfo={};
                    context.state.teamCreateList.push(data.data.create[i]);
                }
                for(var i=0;i<data.data.join.length;i++)
                {
                    data.data.join[i].type=0;
                    data.data.join[i].sessionInfo={};
                    context.state.teamJoinList.push(data.data.join[i]);
                }
            }
            else
            {
                throw data.msg;
            }
            let arr=context.state.teamCreateList.concat(context.state.teamJoinList).map(function (obj) {
                return obj._id;
            });
            context.state.tabList=context.state.tabList.filter(function (obj) {
                if(obj.type==1)
                {
                    return true;
                }
                else if(arr.indexOf(obj._id)>-1)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            })
            if(context.state.tabList.length==0)
            {
                context.state.tabSelId="";
            }
            else
            {
                if(arr.indexOf(context.state.tabSelId)==-1)
                {
                    context.state.tabSelId=context.state.tabList[0]._id;
                }
            }
            if(!context.getters.rootInit)
            {
                let obj={
                    _id:2,
                    url:"http://doclever.cn/controller/welcome/welcome.html",
                    name:"欢迎页",
                    type:1
                }
                context.state.tabList.push(obj);
                context.state.tabSelId=obj._id;
            }
            context.getters.event.$emit("refreshProjectTabItem");
        }
    },
    modules:{

    }
}
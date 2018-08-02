module.exports={
    namespaced:true,
    state:{
        arrTeamPullUser:[],
        arrTeamPullProject:[],
        arrUserApplyTeam:[],
        arrProjectApplyTeam:[],
        arrMessage:[],
        page:0
    },
    getters:{
        teamPullUserLength:function (state) {
            var count=0;
            state.arrTeamPullUser.forEach(function (obj) {
                if(obj.handle==0)
                {
                    count++
                }
            })
            return count;
        },
        teamPullProjectLength:function (state) {
            var count=0;
            state.arrTeamPullProject.forEach(function (obj) {
                if(obj.handle==0)
                {
                    count++
                }
            })
            return count;
        },
        userApplyTeamLength:function (state) {
            var count=0;
            state.arrUserApplyTeam.forEach(function (obj) {
                if(obj.handle==0)
                {
                    count++
                }
            })
            return count;
        },
        projectApplyTeamLength:function (state) {
            var count=0;
            state.arrProjectApplyTeam.forEach(function (obj) {
                if(obj.handle==0)
                {
                    count++
                }
            })
            return count;
        },
        totalLength:function (state,getters) {
            return getters.teamPullUserLength+getters.teamPullProjectLength+getters.userApplyTeamLength+getters.projectApplyTeamLength;
        }
    },
    mutations:{

    },
    actions:{
        init:function (context) {
            context.state.arrTeamPullUser=[];
            context.state.arrTeamPullProject=[];
            context.state.arrUserApplyTeam=[];
            context.state.arrProjectApplyTeam=[];
            context.state.arrMessage=[];
            context.state.page=0;
            return Promise.all([
                net.get("/message/applylist"),
                net.get("/message/list",{
                    page:context.state.page
                })
            ]).then(function (arr) {
                var data1=arr[0];
                var data2=arr[1];
                if(data1.code==200)
                {
                    data1.data.teamPullUser.forEach(function (obj) {
                        obj.handle=0;
                    })
                    data1.data.teamPullProject.forEach(function (obj) {
                        obj.handle=0;
                    })
                    data1.data.userApplyTeam.forEach(function (obj) {
                        obj.handle=0;
                    })
                    data1.data.projectApplyTeam.forEach(function (obj) {
                        obj.handle=0;
                    })
                    context.state.arrTeamPullUser=data1.data.teamPullUser;
                    context.state.arrTeamPullProject=data1.data.teamPullProject;
                    context.state.arrUserApplyTeam=data1.data.userApplyTeam;
                    context.state.arrProjectApplyTeam=data1.data.projectApplyTeam;
                }
                else
                {
                    throw data1.msg
                }
                if(data2.code==200)
                {
                    context.state.arrMessage=context.state.arrMessage.concat(data2.data);
                }
                else
                {
                    throw data2.msg
                }
            })
        },
        getList:function (context) {
            return net.get("/message/list",{
                page:++context.state.page
            })
        },
        handleTeamPullUser:function (context,dt) {
            return net.put("/user/handleapply",{
                apply:dt.item._id,
                state:dt.state
            }).then(function (data) {
                if(data.code==200)
                {
                    if(typeof(data.data)=="object")
                    {
                        dt.item.handle=1;
                        if(!session.get("teamId"))
                        {
                            return context.dispatch("team/init",null,{
                                root:true
                            }).then(function (values) {
                                return {
                                    code:200
                                }
                            })
                        }
                    }
                    else
                    {
                        dt.item.handle=2;
                    }
                }
                else
                {
                    dt.item.handle=3;
                }
                return data
            })
        },
        handleTeamPullProject:function (context,dt) {
            var pro;
            if(dt.item.type==1)
            {
                pro=net.put("/project/handleapply",{
                    id:dt.item.to._id,
                    apply:dt.item._id,
                    state:dt.state
                })
            }
            else if(dt.item.type==4)
            {
                pro=net.put("/doc/handleapply",{
                    project:dt.item.to._id,
                    apply:dt.item._id,
                    state:dt.state
                })
            }
            else if(dt.item.type==6)
            {
                pro=net.put("/test/handleapply",{
                    project:dt.item.to._id,
                    apply:dt.item._id,
                    state:dt.state
                })
            }
            return pro.then(function (data) {
                if(data.code==200)
                {
                    if(dt.state==1)
                    {
                        dt.item.handle=1;
                        if(!session.get("projectId"))
                        {
                            return context.dispatch("project/list/init",null,{
                                root:true
                            })
                        }
                        else if(session.get("projectId")==dt.item.to._id)
                        {
                            context.dispatch("project/changeToList",null,{
                                root:true
                            })
                        }
                    }
                    else
                    {
                        dt.item.handle=2;
                    }
                }
                else
                {
                    dt.item.handle=3;
                }
                return data
            })
        },
        handleUserApplyTeam:function (context,dt) {
            var query={
                id:dt.item.to._id,
                apply:dt.item._id,
                state:dt.state
            };
            if(dt.group)
            {
                query.group=dt.group;
            }
            if(dt.role!==undefined)
            {
                query.role=dt.role;
            }
            return net.put("/team/apply",query).then(function (data) {
                if(data.code==200)
                {
                    if(typeof(data.data)=="object")
                    {
                        dt.item.handle=1;
                        if(session.get("teamId")==dt.item.to._id)
                        {
                            return context.dispatch("team/info/init",null,{
                                root:true
                            })
                        }
                    }
                    else
                    {
                        dt.item.handle=2;
                    }
                }
                else
                {
                    dt.item.handle=3;
                }
                return data;
            })
        },
        handleProjectApplyTeam:function (context,dt) {
            return net.put("/team/apply",{
                id:dt.item.to._id,
                apply:dt.item._id,
                state:dt.state
            }).then(function (data) {
                if(data.code==200)
                {
                    if(typeof(data.data)=="object")
                    {
                        dt.item.handle=1;
                        if(!session.get("projectId"))
                        {
                            return context.dispatch("project/list/init",null,{
                                root:true
                            })
                        }
                        else if(session.get("projectId")==dt.item.from._id)
                        {
                            context.dispatch("project/changeToList",null,{
                                root:true
                            })
                        }
                    }
                    else
                    {
                        dt.item.handle=2;
                    }
                }
                else
                {
                    dt.item.handle=3;
                }
                return data;
            })
        }
    },
    modules:{

    }
}
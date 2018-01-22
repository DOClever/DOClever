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
        projectTeamSort:0,
        docCreateList:[],
        docJoinList:[],
        docPublicList:[],
        docTeamList:[],
        docCreateSort:0,
        docJoinSort:0,
        docPublicSort:0,
        docTeamSort:0,
        testCreateList:[],
        testJoinList:[],
        testTeamList:[],
        testCreateSort:0,
        testJoinSort:0,
        testTeamSort:0,
    },
    getters:{
        projectNotTeamLength:function (state) {
            return state.projectCreateList.length+state.projectJoinList.length;
        },
        projectCreateSort:function (state) {
            return state.projectCreateSort;
        },
        projectJoinSort:function (state) {
            return state.projectJoinSort;
        },
        projectPublicSort:function (state) {
            return state.projectPublicSort;
        },
        docNotTeamLength:function (state) {
            return state.docCreateList.length+state.docJoinList.length;
        },
        docCreateSort:function (state) {
            return state.docCreateSort;
        },
        docJoinSort:function (state) {
            return state.docJoinSort;
        },
        docPublicSort:function (state) {
            return state.docPublicSort;
        },
        testCreateSort:function (state) {
            return state.testCreateSort;
        },
        testJoinSort:function (state) {
            return state.testJoinSort;
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
            if(data.type=="interface")
            {
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
            }
            else if(data.type=="doc")
            {
                if(session.get("teamId"))
                {
                    sort=state.docTeamSort;
                    list=state.docTeamList;
                }
                else
                {
                    sort=state.docCreateSort;
                    list=state.docCreateList;
                }
            }
            else if(data.type=="test")
            {
                if(session.get("teamId"))
                {
                    sort=state.testTeamSort;
                    list=state.testTeamList;
                }
                else
                {
                    sort=state.testCreateSort;
                    list=state.testCreateList;
                }
            }
            if(sort==0)
            {
                list.unshift(data.data);
            }
            else
            {
                for(var i=0;;i++)
                {
                    if(i==list.length || list[i].name.toLowerCase()>=data.data.name.toLowerCase())
                    {
                        list.splice(i,0,data.data);
                        break;
                    }
                }
            }
        },
        changeSort:function (state,data) {
            var sortType,list;
            if(data.category=="interface")
            {
                if(data.type=="create")
                {
                    sortType=state.projectCreateSort;
                    list=state.projectCreateList;
                }
                else if(data.type=="join")
                {
                    sortType=state.projectJoinSort;
                    list=state.projectJoinList;
                }
                else if(data.type=="public")
                {
                    sortType=state.projectPublicSort;
                    list=state.projectPublicList;
                }
                else if(data.type=="team")
                {
                    sortType=state.projectTeamSort;
                    list=state.projectTeamList;
                }
            }
            else if(data.category=="doc")
            {
                if(data.type=="create")
                {
                    sortType=state.docCreateSort;
                    list=state.docCreateList;
                }
                else if(data.type=="join")
                {
                    sortType=state.docJoinSort;
                    list=state.docJoinList;
                }
                else if(data.type=="public")
                {
                    sortType=state.docPublicSort;
                    list=state.docPublicList;
                }
                else if(data.type=="team")
                {
                    sortType=state.docTeamSort;
                    list=state.docTeamList;
                }
            }
            else if(data.category=="test")
            {
                if(data.type=="create")
                {
                    sortType=state.testCreateSort;
                    list=state.testCreateList;
                }
                else if(data.type=="join")
                {
                    sortType=state.testJoinSort;
                    list=state.testJoinList;
                }
                else if(data.type=="team")
                {
                    sortType=state.testTeamSort;
                    list=state.testTeamList;
                }
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
            var type=data.type;
            if(session.get("teamId"))
            {
                query.team=session.get("teamId");
            }
            var pro;
            if(data.type=="interface")
            {
                pro=net.post("/project/create",query)
            }
            else if(data.type=="doc")
            {
                pro=net.post("/doc/project",query)
            }
            else if(data.type=="test")
            {
                pro=net.post("/test/project",query)
            }
            return pro.then(function (data) {
                if(data.code==200)
                {
                    context.commit("addProject",{
                        data:data.data,
                        type:type
                    });
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
            context.state.projectTeamSort=0;
            context.state.docCreateList=[];
            context.state.docJoinList=[];
            context.state.docPublicList=[];
            context.state.docTeamList=[];
            context.state.docCreateSort=0;
            context.state.docJoinSort=0;
            context.state.docPublicSort=0;
            context.state.docTeamSort=0;
            context.state.testCreateList=[];
            context.state.testJoinList=[];
            context.state.testTeamList=[];
            context.state.testCreateSort=0;
            context.state.testJoinSort=0;
            context.state.testTeamSort=0;
            if(data)
            {
                context.state.projectTeamList=data.interface;
                context.state.docTeamList=data.doc;
                context.state.testTeamList=data.test;
                return {
                    code:200
                }
            }
            else if(session.get("teamId"))
            {
                return Promise.all([
                    net.get("/team/projectlist",{
                        id:session.get("teamId")
                    }),
                    net.get("/team/doclist",{
                        id:session.get("teamId")
                    }),
                    net.get("/team/testlist",{
                        id:session.get("teamId")
                    }),
                ]).then(function (values) {
                    var data1=values[0];
                    var data2=values[1];
                    var data3=values[2];
                    if(data1.code==200)
                    {
                        for(var i=0;i<data1.data.length;i++)
                        {
                            context.state.projectTeamList.push(data1.data[i]);
                        }
                        context.rootState.event.$emit("updateTeamProjectList",context.state.projectTeamList);
                    }
                    else
                    {
                        throw data1.msg;
                    }
                    if(data2.code==200)
                    {
                        for(var i=0;i<data2.data.length;i++)
                        {
                            context.state.docTeamList.push(data2.data[i]);
                        }
                        context.rootState.event.$emit("updateTeamDocList",context.state.docTeamList);
                    }
                    else
                    {
                        throw data2.msg;
                    }
                    if(data3.code==200)
                    {
                        for(var i=0;i<data3.data.length;i++)
                        {
                            context.state.testTeamList.push(data3.data[i]);
                        }
                        context.rootState.event.$emit("updateTeamTestList",context.state.testTeamList);
                    }
                    else
                    {
                        throw data3.msg;
                    }
                    return data1;
                })
            }
            else
            {
                return Promise.all([
                    net.get("/project/list",{}),
                    net.get("/doc/projectlist",{}),
                    net.get("/test/projectlist",{})
                ]).then(function (values) {
                    var data1=values[0];
                    var data2=values[1];
                    var data3=values[2];
                    if(data1.code==200)
                    {
                        for(var i=0;i<data1.data.create.length;i++)
                        {
                            context.state.projectCreateList.push(data1.data.create[i]);
                        }
                        for(var i=0;i<data1.data.join.length;i++)
                        {
                            context.state.projectJoinList.push(data1.data.join[i]);
                        }
                        for(var i=0;i<data1.data.public.length;i++)
                        {
                            context.state.projectPublicList.push(data1.data.public[i]);
                        }
                    }
                    else
                    {
                        throw data1.msg;
                    }
                    if(data2.code==200)
                    {
                        for(var i=0;i<data2.data.create.length;i++)
                        {
                            context.state.docCreateList.push(data2.data.create[i]);
                        }
                        for(var i=0;i<data2.data.join.length;i++)
                        {
                            context.state.docJoinList.push(data2.data.join[i]);
                        }
                        for(var i=0;i<data2.data.public.length;i++)
                        {
                            context.state.docPublicList.push(data2.data.public[i]);
                        }
                    }
                    else
                    {
                        throw data2.msg;
                    }
                    if(data3.code==200)
                    {
                        for(var i=0;i<data3.data.create.length;i++)
                        {
                            context.state.testCreateList.push(data3.data.create[i]);
                        }
                        for(var i=0;i<data3.data.join.length;i++)
                        {
                            context.state.testJoinList.push(data3.data.join[i]);
                        }
                    }
                    else
                    {
                        throw data3.msg;
                    }
                    return data1;
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
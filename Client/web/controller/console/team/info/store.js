module.exports={
    namespaced:true,
    state:{
        team:{},
        notice:[],
        project:[],
        doc:[],
        user:[],
        role:0,
    },
    getters:{
        event:function (state,getters,rootState) {
            return rootState.event;
        },
        userCount:function (state,getters) {
            return state.team.userCount;
        },
        interfaceCount:function (state,getters) {
            var count=0;
            state.project.forEach(function (obj) {
                count+=obj.interfaceCount;
            })
            return count;
        },
        projectCount:function (state,getters) {
            return state.project.length;
        },
        docCount:function (state,getters) {
            var count=0;
            state.doc.forEach(function (obj) {
                count+=obj.docCount;
            })
            return count;
        },
        docProjectCount:function (state,getters) {
            return state.doc.length;
        },
        ownRole:function (state) {
            if(state.role==2)
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        manageRole:function (state) {
            if(state.role==2 || state.role==0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    },
    mutations:{
        setTeam:function (state,data) {
            state.team=data;
            state.notice=data.notice;
            state.project=data.project;
            state.user=data.user;
            state.role=data.role;
            state.doc=data.doc
        },
        init:function (state) {
            state.team={};
            state.notice=[];
            state.project=[];
            state.user=[];
            state.doc=[];
            state.role=0;
        }
    },
    actions:{
        init:function (context) {
            context.commit("init");
            return net.get("/team/info",{
                id:session.get("teamId")
            }).then(function (data) {
                if(data.code==200)
                {
                    context.commit("setTeam",data.data);
                    return context.dispatch("project/list/init",{
                        interface:data.data.project,
                        doc:data.data.doc,
                        test:data.data.test
                    },{
                        root:true
                    });
                }
                else
                {
                    throw data.msg;
                }
                return data;
            })
        }
    },
    modules:{

    }
}
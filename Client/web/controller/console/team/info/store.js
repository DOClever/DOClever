module.exports={
    namespaced:true,
    state:{
        team:{},
        notice:[],
        project:[],
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
            return state.team.interfaceCount;
        },
        projectCount:function (state,getters) {
            return state.team.projectCount;
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
        },
        init:function (state) {
            state.team={};
            state.notice=[];
            state.project=[];
            state.user=[];
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
                    return context.dispatch("project/list/init",data.data.project,{
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
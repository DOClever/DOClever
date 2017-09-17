module.exports=new Vuex.Store({
    state:{
        team:{},
        notice:[],
        project:[],
        user:[],
        role:0
    },
    getters:{
        userCount:function (state,getters) {
            return state.user.length;
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
    }
});
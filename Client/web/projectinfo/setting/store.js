module.exports={
    namespaced:true,
    getters:{
        event: function (state, getters, rootState) {
            return rootState.event;
        },
        project:function (state,getters,rootState) {
            return rootState.project;
        },
        interfaceEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters.interfaceEditRole;
        },
        testEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters.testEditRole;
        },
        globalBaseUrlRole:function (state,getters,rootState,rootGetters) {
            return rootGetters.globalBaseUrlRole;
        },
        globalStatusRole:function (state,getters,rootState,rootGetters) {
            return rootGetters.globalStatusRole;
        },
        globalInjectRole:function (state,getters,rootState,rootGetters) {
            return rootGetters.globalInjectRole;
        },
        globalDocRole:function (state,getters,rootState,rootGetters) {
            return rootGetters.globalDocRole;
        },
        versionEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters.versionEditRole;
        },
        versionRollRole:function (state,getters,rootState,rootGetters) {
            return rootGetters.versionRollRole;
        },
        manageRole:function (state,getters,rootState,rootGetters) {
            return rootState.role==0;
        },
        ownRole:function (state,getters,rootState,rootGetters) {
            return rootState.own==1;
        }
    },
}
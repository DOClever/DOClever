module.exports={
    namespaced:true,
    getters:{
        event: function (state, getters, rootState) {
            return rootState.event;
        },
        project:function (state,getters,rootState) {
            return rootState.info.project;
        },
        interfaceEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/interfaceEditRole"];
        },
        testEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/testEditRole"];
        },
        globalBaseUrlRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalBaseUrlRole"];
        },
        globalStatusRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalStatusRole"];
        },
        globalInjectRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalInjectRole"];
        },
        globalDocRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalDocRole"];
        },
        versionEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/versionEditRole"];
        },
        versionRollRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/versionRollRole"];
        },
        manageRole:function (state,getters,rootState,rootGetters) {
            return rootState.info.role==0;
        },
        ownRole:function (state,getters,rootState,rootGetters) {
            return rootState.info.own==1;
        },
        guestRole:function (state,getters,rootState,rootGetters) {
            return rootState.info.guest==1;
        },
    },
}
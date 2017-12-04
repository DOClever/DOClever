module.exports={
    namespaced:true,
    getters:{
        event: function (state, getters, rootState) {
            return rootState.event;
        },
        project:function (state,getters,rootState) {
            return rootState.project.info.project;
        },
        interfaceEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/interfaceEditRole"];
        },
        testEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/testEditRole"];
        },
        globalBaseUrlRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalBaseUrlRole"];
        },
        globalStatusRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalStatusRole"];
        },
        globalInjectRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalInjectRole"];
        },
        globalDocRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalDocRole"];
        },
        versionEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/versionEditRole"];
        },
        versionRollRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/versionRollRole"];
        },
        manageRole:function (state,getters,rootState,rootGetters) {
            return rootState.project.info.role==0;
        },
        ownRole:function (state,getters,rootState,rootGetters) {
            return rootState.project.info.own==1;
        },
        guestRole:function (state,getters,rootState,rootGetters) {
            return rootState.project.info.guest==1;
        },
    },
}
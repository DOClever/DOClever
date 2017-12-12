module.exports= {
    namespaced: true,
    getters: {
        objCopyJSON:function (state,getters,rootState) {
            return rootState.objCopyJSON;
        },
        baseUrls: function (state, getters, rootState) {
            return rootState.project.info.project.baseUrls;
        },
        before: function (state, getters, rootState) {
            return rootState.project.info.project.before;
        },
        after: function (state, getters, rootState) {
            return rootState.project.info.project.after;
        },
        event: function (state, getters, rootState) {
            return rootState.event;
        },
        status:function (state, getters, rootState) {
            return rootState.project.info.status;
        },
        template:function (state, getters, rootState) {
            return rootState.project.info.template;
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
        globalTemplateRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalTemplateRole"];
        },
        globalDocRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalDocRole"];
        },
        versionEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/versionEditRole"];
        },
        versionRollRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/versionRollRole"];
        }
    },
    actions: {
        setBaseUrls: function (context, data) {
            context.commit("project/info/setBaseUrls", data, {
                root: true
            });
        },
        setInject: function (context, data) {
            context.commit("project/info/setBefore", data.before, {
                root: true
            })
            context.commit("project/info/setAfter", data.after, {
                root: true
            })
        }
    }
}
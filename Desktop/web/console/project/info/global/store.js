module.exports= {
    namespaced: true,
    getters: {
        objCopyJSON:function (state,getters,rootState) {
            return window.store.state.objCopyJSON;
        },
        baseUrls: function (state, getters, rootState) {
            return rootState.info.project.baseUrls;
        },
        before: function (state, getters, rootState) {
            return rootState.info.project.before;
        },
        after: function (state, getters, rootState) {
            return rootState.info.project.after;
        },
        event: function (state, getters, rootState) {
            return rootState.event
        },
        status:function (state, getters, rootState) {
            return rootState.info.status;
        },
        template:function (state, getters, rootState) {
            return rootState.info.template;
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
        globalTemplateRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalTemplateRole"];
        },
        globalDocRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalDocRole"];
        },
        versionEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/versionEditRole"];
        },
        versionRollRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/versionRollRole"];
        }
    },
    actions: {
        setBaseUrls: function (context, data) {
            context.commit("info/setBaseUrls", data, {
                root: true
            });
        },
        setInject: function (context, data) {
            context.commit("info/setBefore", data.before, {
                root: true
            })
            context.commit("info/setAfter", data.after, {
                root: true
            })
        }
    }
}
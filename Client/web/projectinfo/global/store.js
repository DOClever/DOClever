module.exports= {
    namespaced: true,
    getters: {
        baseUrls: function (state, getters, rootState) {
            return rootState.project.baseUrls;
        },
        before: function (state, getters, rootState) {
            return rootState.project.before;
        },
        after: function (state, getters, rootState) {
            return rootState.project.after;
        },
        event: function (state, getters, rootState) {
            return rootState.event;
        },
        status:function (state, getters, rootState) {
            return rootState.status;
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
        }
    },
    actions: {
        setBaseUrls: function (context, data) {
            context.commit("setBaseUrls", data, {
                root: true
            });
        },
        setInject: function (context, data) {
            context.commit("setBefore", data.before, {
                root: true
            })
            context.commit("setAfter", data.after, {
                root: true
            })
        }
    }
}
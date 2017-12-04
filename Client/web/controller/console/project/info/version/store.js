module.exports={
    namespaced:true,
    getters:{
        event:function (state,getters,rootState) {
            return rootState.event;
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
        }
    },
    actions:{
        switchVersion:function (context,obj) {
            if(obj)
            {
                session.set("versionId",obj._id);
                session.set("versionName",obj.version);
                session.set("versionDis",obj.dis);
            }
            else
            {
                session.remove("versionId");
                session.remove("versionName");
                session.remove("versionDis");
            }
            return context.dispatch("project/info/init",null,{
                root:true
            }).then(function (data) {
                if(data[0].code!=200)
                {
                    return data[0].msg;
                }
                if(data[1].code!=200)
                {
                    return data[1].msg;
                }
                if(data[2].code!=200)
                {
                    return data[2].msg;
                }
                if(data[3].code!=200)
                {
                    return data[3].msg;
                }
                if(data[4].code!=200)
                {
                    return data[4].msg;
                }
                return true;
            });
        }
    }
}
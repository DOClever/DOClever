var list=require("./list/store.js")
var info=require("./info/store.js")
var doc=require("./doc/store.js")
var test=require("./test/store.js")
module.exports={
    namespaced:true,
    state:function () {
        return {
            type:"list",
            event:new Vue()
        }
    },
    getters:{
        event:function (state) {
            return state.event;
        }
    },
    actions:{
        init:function (context) {
            return context.dispatch("list/init");
        },
        changeToList:function (context) {
            session.remove("snapshotId");
            session.remove("snapshotDis");
            session.remove("snapshotCreator");
            session.remove("snapshotDate");
            session.remove("versionId");
            session.remove("versionName");
            session.remove("versionDis");
            session.remove("projectType");
            session.remove("projectId");
            session.remove("projectName");
            context.state.type="list";
        },
        changeToInfo:function (context,obj) {
            if(obj.type=="interface")
            {
                session.set("projectType","interface");
                session.set("projectId",obj.id);
                session.set("projectName",obj.name);
                context.state.type="info";
            }
            else if(obj.type=="doc")
            {
                session.set("projectType","doc");
                session.set("projectId",obj.id);
                session.set("projectName",obj.name);
                context.state.type="doc";
            }
            else if(obj.type=="test")
            {
                session.set("projectType","test");
                session.set("projectId",obj.id);
                session.set("projectName",obj.name);
                context.state.type="test";
            }
        },
    },
    modules:{
        list:list,
        info:info,
        doc:doc,
        test:test
    },
}

if (module.hot) {
    module.hot.accept(['./list/store','./info/store','./doc/store','./test/store'], function () {
        var list=require("./list/store.js")
        var info=require("./info/store.js")
        var doc=require("./doc/store.js")
        var test=require("./test/store.js")
        store.hotUpdate({
            modules: {
                list:list,
                info:info,
                doc:doc,
                test:test
            }
        })
    })
}
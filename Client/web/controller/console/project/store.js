var list=require("./list/store.js")
var info=require("./info/store.js")
var doc=require("./doc/store.js")
module.exports={
    namespaced:true,
    state:{
        type:"list"
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
            context.state.type="list"
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
        },
    },
    modules:{
        list:list,
        info:info,
        doc:doc
    },
}
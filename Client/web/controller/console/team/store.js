var list=require("./list/store.js")
var info=require("./info/store.js")
module.exports={
    namespaced:true,
    state:{
        type:"list"
    },
    getters:{

    },
    mutations:{

    },
    actions:{
        init:function (context) {
            return Promise.all([context.dispatch("list/init")]);
        },
        changeToList:function (context) {
            session.remove("teamId");
            session.remove("teamName");
            context.state.type="list";
            context.dispatch("project/changeToList",null,{
                root:true
            });
        },
        changeToInfo:function (context,obj) {
            session.set("teamId",obj.id);
            session.set("teamName",obj.name);
            context.state.type="info";
            context.dispatch("project/changeToList",null,{
                root:true
            });
        }
    },
    modules:{
        list:list,
        info:info
    }
}
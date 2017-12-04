var person=require("./person/store");
var project=require("./project/store");
var team=require("./team/store");
var message=require("./message/store");
module.exports=new Vuex.Store({
    namespaced:true,
    state:{
        init:false,
        event:new Vue(),
    },
    getters:{

    },
    mutations:{

    },
    actions:{
        init:function (context) {
            return Promise.all([
                context.dispatch("project/init"),
                context.dispatch("team/init"),
                context.dispatch("person/init"),
                context.dispatch("message/init")
            ]).then(function () {
                context.state.init=true;
            })
        }
    },
    modules:{
        person:person,
        project:project,
        team:team,
        message:message
    }
})
var person=require("./person/store");
var project=require("./project/store");
var team=require("./team/store");
var message=require("./message/store");
var store=new Vuex.Store({
    namespaced:true,
    state:{
        init:false,
        event:new Vue(),
        objCopyJSON:null
    },
    getters:{

    },
    mutations:{
        setObjCopyJSON:function (state,data) {
            state.objCopyJSON=data;
        }
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

module.exports=store;

if (module.hot) {
    module.hot.accept(['./person/store','./project/store','./team/store','./message/store'], function () {
        var person = require('./person/store')
        var project = require('./project/store')
        var team = require('./team/store')
        var message = require('./message/store')
        store.hotUpdate({
            modules: {
                person:person,
                project:project,
                team:team,
                message:message
            }
        })
    })
}
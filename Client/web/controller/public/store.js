var rootStore=require("../console/store")
module.exports=new Vuex.Store({
    namespaced: true,
    state:{
        event:new Vue(),
        curProject:{}
    },
    actions:{
        init:function (context) {
            return new Promise(function (resolve) {
                rootStore.state.event.$on("init",function () {
                    context.state.curProject=rootStore.state.project.info.project;
                    resolve();
                })
            })
        }
    },
})
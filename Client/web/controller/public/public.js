var info=require("../console/project/info/info.vue");
var store=require("./store")
var vue=new Vue({
    el:"#app",
    data:{
        type:0,
    },
    store:store,
    components:{
        "info":info,
    },
    computed:{
        project:function () {
            return store.state.curProject;
        }
    },
    methods: {

    },
    beforeCreate:function () {
        var _this=this;
        var id=location.hash.substr(1);
        if(!id)
        {
            $.stopLoading();
            $.notify("当前分享页面无效",0);
            return;
        }
        session.set("projectId",id);
        store.dispatch("init").then(function () {
            $.stopLoading()
        })
    }
});
window.vueObj=vue;
$.ready(function () {
    $.startLoading();
});

if (module.hot) {
    module.hot.accept();
}
/**
 * Created by sunxin on 2017/5/20.
 */
var mainNav=require("./component/mainNav.vue")
var interface=require("./component/interface.vue")
var setting=require("./component/setting.vue")
var global=require("./component/global.vue")
var config=require("./util/config");
var bus=require("./bus/projectInfoBus")
var vue=new Vue({
    el: "#app",
    data: {
        type:0
    },
    components:{
        "mainnav":mainNav,
        "interface":interface,
        "setting":setting,
        "global":global,
    },
    mounted:function () {
        bus.$emit("initInterface",window.interface);
        bus.$emit("initInfo",window.project);
        bus.$emit("initStatus",window.state);
    }
})
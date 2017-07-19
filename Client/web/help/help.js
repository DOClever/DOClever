/**
 * Created by sunxin on 2017/3/3.
 */
var mainNav=require("../component/mainNav.vue");
var vue=new Vue({
    el: "#app",
    data: {
        isLogin:session.get('id')?true:false,
    },
    components:{
        "mainnav":mainNav
    },
    methods:{

    },
})
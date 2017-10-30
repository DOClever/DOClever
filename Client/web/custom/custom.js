var mainNav=require("../component/mainNav.vue");
var vue=new Vue({
    el: "#app",
    data: {
        isLogin:session.get('id')?true:false
    },
    components:{
        "mainnav":mainNav
    },
    methods:{

    },
})
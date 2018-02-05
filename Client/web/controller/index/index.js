var mainNav=require("component/mainNav.vue");
var commonFooter=require("component/commonFooter.vue");
var VueFullpage=require("fullpage-vue");
var vue=new Vue({
    "el":"#app",
    components:{
        "mainnav":mainNav,
        "commonfooter":commonFooter,
    },
    data:{
        dialogVisible:false,

        isLogin:session.get('id')?true:false,
        opts: {
            start: 0,
            dir: 'v',
            duration: 500,
            beforeChange: function (prev, next)
            {
                if(next==6)
                {
                    vue.bShowNext=false;
                }
                else
                {
                    vue.bShowNext=true;
                }
                var imgElements = document.body.getElementsByTagName("img");
                for(var i=0; i<imgElements.length; i++) {
                    if(imgElements[i].hasAttribute("lazy") && imgElements[i].getAttribute("lazy")==next && !imgElements[i].src){
                        imgElements[i].src=imgElements[i].getAttribute("real_src");
                    }
                }
            },
            afterChange: function (prev, next) {

            }
        },
        bShowNext:true
    },
    methods:{
        start:function () {
            if(this.isLogin)
            {
                location.href='console/console.html';
            }
            else
            {
                location.href='login/login.html';
            }
        },
        moveNext:function(){
            this.$refs.example.$fullpage.moveNext();
        }
    }
})
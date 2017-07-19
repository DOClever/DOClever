/**
 * Created by sunxin on 2017/2/16.
 */
var mainNav=require("./component/mainNav.vue")
var VueFullpage=require("fullpage-vue");
Vue.use(VueFullpage);
var vue=new Vue({
    "el":"#app",
    data:{
        dis:[
          {
              title:"DOClever是我目前用到过最好的一个接口管理平台",
              name:"iOS开发者李续续"
          },
          {
              title:"有了DOClever，和前端的沟通都顺畅了很多",
              name:"JAVA程序员张洋"
          },
            {
                title:"使用DOClever可以让我和后端的数据无缝衔接，再也停不下来",
                name:"前端工程师李彩凤"
            }
        ],
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
            },
            afterChange: function (prev, next) {

            }
        },
        bShowNext:true
    },
    components:{
        "mainnav":mainNav
    },
    methods:{
        start:function () {
            if(this.isLogin)
            {
                location.href='project/project.html';
            }
            else
            {
                location.href='login/login.html';
            }
        },
        moveNext(){
            this.$refs.example.$fullpage.moveNext();
        }
    }
})
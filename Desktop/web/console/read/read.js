var store=require("./store");
var list=require("./component/list.vue")
var config=require("common/js/config")
var showInterface=require("../project/doc/component/interface.vue");
if(location.hash.length<=1)
{
    alert("链接不正确");
    window.close();
}
var id=location.hash.substr(1,24);
var baseUrl=decodeURIComponent(location.hash.substr(25));
sessionStorage.setItem("baseUrl",baseUrl);
new Vue({
    el:"#app",
    data:{
        md:null,
        type:0,
        key:""
    },
    store:store,
    components:{
        "list":list
    },
    watch:{
        key:function (val) {
            this.$store.dispatch("search",{
                key:val,
                type:this.type
            })
        }
    },
    computed:{
        selDoc:function () {
            return this.$store.state.selDoc;
        },
        preview:function () {
            if(!this.selDoc)
            {
                return "";
            }
            this.$nextTick(function () {
                var ele=document.getElementById("preview");
                var arrImg=ele.querySelectorAll("img");
                for(let i=0;i<arrImg.length;i++)
                {
                    if(/^http:\/\/localhost\:8081/.test(arrImg[i].src))
                    {
                        let src=arrImg[i].src.substr(21);
                        arrImg[i].src=(sessionStorage.getItem("env")=="doclever.cn"?config.onlineHost:sessionStorage.getItem("baseUrl"))+src;
                    }
                    else if(/^file:\/\//.test(arrImg[i].src))
                    {
                        let index=arrImg[i].src.lastIndexOf(":");
                        let src=arrImg[i].src.substr(index+1);
                        arrImg[i].src=(sessionStorage.getItem("env")=="doclever.cn"?config.onlineHost:sessionStorage.getItem("baseUrl"))+src;
                    }
                }
                var arrLink=ele.querySelectorAll("a");
                for(var i=0;i<arrLink.length;i++)
                {
                    if(/^interface\:\/\//.test(arrLink[i].href))
                    {
                        arrLink[i].style.textDecoration="none";
                        arrLink[i].style.color="#67C23A";
                        var href=arrLink[i].href;
                        var maoIndex=href.indexOf("/");
                        var wenIndex=href.indexOf("?");
                        var id=href.substring(maoIndex+2,wenIndex);
                        var str=href.substr(wenIndex+1);
                        var option={};
                        var arr=str.split("&");
                        arr.forEach(function (obj) {
                            var arr=obj.split("=");
                            option[arr[0]]=arr[1]?arr[1]:"";
                        })
                        arrLink[i].href="javascript:void(0)";
                        arrLink[i].onclick=function (id,run) {
                            var _this=this;
                            $.startHud();
                            Promise.all([
                                net.get("/doc/interface",{
                                    id:id,
                                }),
                                net.get("/doc/interfaceInfo",{
                                    id:id,
                                })
                            ]).then(function (values) {
                                var data1=values[0];
                                var data2=values[1];
                                $.stopHud();
                                if(data1.code!=200)
                                {
                                    $.tip(data1.msg,0);
                                    return;
                                }
                                if(data2.code!=200)
                                {
                                    $.tip(data2.msg,0);
                                    return;
                                }
                                $.showBox(_this,showInterface,{
                                    run:run,
                                    source:data1.data,
                                    baseUrls:data2.data.baseUrls,
                                    status:data2.data.status,
                                    before:data2.data.before,
                                    after:data2.data.after
                                })
                            })
                        }.bind(this,id,option["run"]?Number(option["run"]):0)
                    }
                    else if(/^http:\/\/localhost\:8081/.test(arrLink[i].href))
                    {
                        let href=arrLink[i].href.substr(21);
                        arrLink[i].href=(sessionStorage.getItem("env")=="doclever.cn"?config.onlineHost:sessionStorage.getItem("baseUrl"))+href;
                    }
                    else if(/^file:\/\//.test(arrLink[i].href))
                    {
                        arrLink[i].download=arrLink[i].innerText;
                        let index=arrLink[i].href.lastIndexOf(":");
                        let href=arrLink[i].href.substr(index+1);
                        arrLink[i].href=(sessionStorage.getItem("env")=="doclever.cn"?config.onlineHost:sessionStorage.getItem("baseUrl"))+href;
                    }
                    else
                    {
                        arrLink[i].target="_blank";
                    }
                }
            })
            return this.md.render(this.selDoc.content);
        },
        doc:function () {
            return store.state.doc;
        },
        list:function () {
            return store.state.list
        }
    },
    methods:{

    },
    created:function () {
        var _this=this;
        sessionStorage.setItem("login","1");
        window.hljs.initHighlightingOnLoad();
        this.md = window.markdownit({
            highlight: function (str, lang) {
                if (lang && window.hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs"><code>' +
                            window.hljs.highlight(lang, str, true).value +
                            '</code></pre>';
                    } catch (__) {}
                }
                return '<pre class="hljs"><code>' + _this.md.utils.escapeHtml(str) + '</code></pre>';
            }
        });
        store.dispatch("init",id).then(function (data) {
            $.stopLoading();
            if(data.code!=200)
            {
                $.tip(data.msg,0)
            }
        })
    },
})


$.ready(function () {
    $.startLoading();
});


if (module.hot) {
    module.hot.accept();
}






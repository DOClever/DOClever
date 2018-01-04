var store=require("./store");
var list=require("./component/list.vue")
var showInterface=require("../console/project/doc/component/interface.vue");
if(location.hash.length<=1)
{
    alert("链接不正确");
    window.close();
}
var id=location.hash.substr(1);
new Vue({
    el:"#app",
    data:{
        md:null,
    },
    store:store,
    components:{
        "list":list
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
                var arrLink=ele.querySelectorAll("a");
                for(var i=0;i<arrLink.length;i++)
                {
                    arrLink[i].target="_blank";
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
                                    $.notify(data1.msg,0);
                                    return;
                                }
                                if(data2.code!=200)
                                {
                                    $.notify(data2.msg,0);
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
                $.notify(data.msg,0)
            }
        })
    }
})

$.ready(function () {
    $.startLoading();
});

if (module.hot) {
    module.hot.accept();
}






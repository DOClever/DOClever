/**
 * Created by sunxin on 2017/1/9.
 */
var mainNav=require("../component/mainNav.vue")
var runQuery=require("../component/runQuery.vue")
var runHeader=require("../component/runHeader.vue")
var runBody=require("../component/runBody.vue")
var runParam=require("../component/runParam.vue")
var encrypt=require("../component/encrypt.vue")
var runInject=require("../component/runInject.vue")
var store=require("./store")
if((!session.get("interfaceId") || !session.get("groupId")) && location.hash.length<=1)
{
    alert("请从项目详情页进来!");
    location.href="../projectinfo/projectinfo.html"
}
var vue=new Vue({
    el: "#app",
    data: {
        session:$.clone(session.raw()),
        runPending:false
    },
    components:{
        "mainnav":mainNav,
        "runquery":runQuery,
        "runheader":runHeader,
        "runbody":runBody,
        "runparam":runParam,
        "encrypt":encrypt,
        "runinject":runInject
    },
    store:store,
    computed:{
        interface:function () {
            return store.state.interface;
        },
        baseUrl:{
            get:function () {
                return store.state.baseUrl;
            },
            set:function (val) {
                store.commit("setBaseUrl",val);
            }
        },
        paramTab:function () {
            return "Param ("+store.getters.paramCount+")";
        },
        queryTab:function () {
            return "Query ("+store.getters.queryCount+")";
        },
        headerTab:function () {
            return "Header ("+store.getters.headerCount+")";
        },
        bodyTab:function () {
            return "Body ("+(store.state.bodyInfo.type==0?store.getters.bodyCount:"Raw")+")";
        },
        param:function () {
            return store.state.param
        },
        querySave:function () {
            return store.getters.querySave
        },
        headerSave:function () {
            return store.getters.headerSave
        },
        bodySave:function () {
            return store.getters.bodySave
        },
        drawMix:function () {
            return store.state.drawMix
        },
        bodyInfo:function () {
            return store.state.bodyInfo
        },
        queryRawShow:function () {
            return store.state.queryRawShow;
        },
        headerRawShow:function () {
            return store.state.headerRawShow;
        },
        bodyRawShow:function () {
            return store.state.bodyRawShow;
        },
        status:function () {
            return store.state.status;
        },
        second:function () {
            return store.state.second;
        },
        type:function () {
            return store.state.type;
        },
        draw:function () {
            return store.state.draw;
        },
        drawMix:function () {
            return store.state.drawMix;
        },
        imgUrl:function () {
            return store.state.imgUrl;
        },
        rawData:function () {
            return store.state.rawData;
        },
        resHeader:function () {
            return store.state.resHeader;
        },
        errorCount:function () {
            return store.state.errorCount;
        },
        queryRawStr:{
            get:function () {
                return store.state.queryRawStr
            },
            set:function (val) {
                store.commit("setQueryRawStr",val);
            }
        },
        headerRawStr:{
            get:function () {
                return store.state.headerRawStr
            },
            set:function (val) {
                store.commit("setHeaderRawStr",val);
            }
        },
        bodyRawStr:{
            get:function () {
                return store.state.bodyRawStr
            },
            set:function (val) {
                store.commit("setBodyRawStr",val);
            }
        },
    },
    methods:{
        run:function () {
            var _this=this;
            this.runPending=true;
            store.dispatch("run").then(function (data) {
                _this.runPending=false;
                if(data.code==200)
                {
                    $.notify("运行成功",1);
                }
                else
                {
                    $.notify(data.msg,0);
                }
            })
        },
        save:function () {
            store.dispatch("save").then(function (data) {
                if(data && data.code==0)
                {
                    $.notify(data.msg,0);
                }
            })
        },
        toggleQuery:function () {
            store.commit("toggleQuery");
        },
        toggleHeader:function () {
            store.commit("toggleHeader");
        },
        toggleBody:function () {
            store.commit("toggleBody");
        },
        changeUrl:function (val) {
            store.commit("changeUrl",val);
        },
        querySearch:function (queryString,cb) {
            var _this=this;
            setTimeout(function () {
                var results=_this.interface.baseUrl.map(function (obj) {
                    return {value:obj}
                })
                if(!store.state.hash)
                {
                    results.push({
                        value:"MockServer"
                    })
                }
                if(queryString)
                {
                    results=results.filter(function (obj) {
                        return obj.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
                    })
                }
                cb(results);
            },100)
        },
        showAutoComplete:function (event) {
            this.baseUrl="";
            setTimeout(function(){
                event.target.nextSibling.focus();
            },100)
        },
        getError:function (item) {
            var ele=document.createElement("div");
            ele.innerHTML=item;
            var errEle=ele.querySelector("[err]");
            return errEle.getAttribute("err");
        },
        existError:function (item) {
            var ele=document.createElement("div");
            ele.innerHTML=item;
            var errEle=ele.querySelector("[err]");
            if(errEle)
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        changeMethod:function () {
            store.commit("changeMethod")
        },
        paste:function () {
            setTimeout(function () {
                var path=store.state.interface.url;
                var arrStoreQuery=store.state.query;
                arrStoreQuery.splice(0,arrStoreQuery.length);
                var index=path.indexOf("?");
                if(index>-1)
                {
                    var arr=path.split("?");
                    if(arr[1])
                    {
                        var query=arr[1];
                        var arrQuery=query.split("&");
                        for(var i=0;i<arrQuery.length;i++)
                        {
                            if(arrQuery[i])
                            {
                                var arrQuery1=arrQuery[i].split("=");
                                arrStoreQuery.push({
                                    name:arrQuery1[0],
                                    value:arrQuery1[1]?[arrQuery1[1]]:[],
                                    must:1,
                                    remark:"",
                                    selValue:arrQuery1[1]?arrQuery1[1]:"",
                                    enable:1
                                })
                            }
                        }
                    }
                    store.state.interface.url=store.state.interface.url.substring(0,index);
                }
                else
                {
                    arrStoreQuery.push({
                        name:"",
                        must:0,
                        remark:"",
                        value:"",
                        selValue:"",
                        enable:1
                    })
                }
            },100)
        }
    },
    created:function () {
        store.dispatch("init").then(function (data) {
            $.stopLoading()
            if(data.code!=200)
            {
                $.notify(data.msg,0);
            }
        })
    },
})
$.ready(function () {
    $.startLoading();
})
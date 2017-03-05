/**
 * Created by sunxin on 2017/1/9.
 */
var mainNav=require("../component/mainNav.vue")
var runQuery=require("../component/runQuery.vue")
var runHeader=require("../component/runHeader.vue")
var runBody=require("../component/runBody.vue")
var runParam=require("../component/runParam.vue")
var encrypt=require("../component/encrypt.vue")
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
        "encrypt":encrypt
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
                results.push({
                    value:"MockServer"
                })
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
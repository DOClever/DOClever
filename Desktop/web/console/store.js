var person=require("./person/store");
var project=require("./project/store");
var team=require("./team/store");
var message=require("./message/store");
var plugin=require("./plugin/store")
var config=require("common/js/config")
var store=new Vuex.Store({
    namespaced:true,
    state:{
        init:false,
        event:new Vue(),
        objCopyJSON:null,
        mockList:window.apiNode.mock.list,
        memberInfo:{
            level:{}
        },
        copyTestId:null
    },
    getters:{

    },
    mutations:{
        setObjCopyJSON:function (state,data) {
            state.objCopyJSON=data;
        }
    },
    actions:{
        init:function (context) {
            session.remove("snapshotId");
            session.remove("snapshotDis");
            session.remove("snapshotCreator");
            session.remove("snapshotDate");
            session.remove("teamId");
            session.remove("teamName");
            session.remove("versionId");
            session.remove("versionName");
            session.remove("versionDis");
            session.remove("projectType");
            session.remove("projectId");
            session.remove("projectName");
            context.state.init=false;
            let arr=[
                context.dispatch("team/init"),
                context.dispatch("person/init"),
                context.dispatch("message/init")
            ];
            if(sessionStorage.getItem("member"))
            {
                arr.push(context.dispatch("initMemberInfo"))
            }
            return Promise.all(arr).then(function () {
                context.state.init=true;
            })
        },
        initMemberInfo:function (context) {
            return net.get(config.online+"/member/clientinfo",{
                member:sessionStorage.getItem("member")
            },{
                desktop:"1"
            },null,1).then(function (data) {
                if(data.code==200)
                {
                    context.state.memberInfo=data.data;
                }
                return data
            })
        },
        startMock:function (context,obj) {
            let ret=window.apiNode.mock.start(obj.id,obj.name,obj.mockUrl,obj.realUrl,obj.port)
            return ret;
        },
        stopMock:function (context,id) {
            window.apiNode.mock.stop(id);
        },
        removeMock:function (context,id) {
            window.apiNode.mock.remove(id)
        },
        clearMock:function (context) {
            window.apiNode.mock.clear();
        },
        getMockObj:function (context,id) {
            let arr=window.apiNode.mock.list;
            for(let o of arr)
            {
                if(o.id==id)
                {
                    return o;
                }
            }
            return null;
        },
        statics:async function (context) {
            let mac=await global.apiNode.macAddress();
            return net.post(config.online+"/member/ip",{
                mac:mac,
                desktopversion:window.desktopVersion,
                version:sessionStorage.getItem("version")
            },{
                desktop:"1"
            },null,0,0,1);
        }
    },
    modules:{
        person:person,
        project:project,
        team:team,
        message:message,
        plugin:plugin
    }
})
global.store=store;
module.exports=store;

if (module.hot) {
    module.hot.accept(['./person/store','./project/store','./team/store','./message/store','./plugin/store'], function () {
        var person = require('./person/store')
        var project = require('./project/store')
        var team = require('./team/store')
        var message = require('./message/store')
        var plugin = require('./plugin/store')
        store.hotUpdate({
            modules: {
                person:person,
                project:project,
                team:team,
                message:message,
                plugin:plugin
            }
        })
    })
}
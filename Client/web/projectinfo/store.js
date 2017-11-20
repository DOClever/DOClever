var global=require("./global/store");
var inter=require("./interface/store");
var setting=require("./setting/store");
var test=require("./test/store");
var version=require("./version/store");
module.exports=new Vuex.Store({
    namespaced:true,
    state:{
        event:new Vue(),
        project:{
            users:[]
        },
        status:[],
        lastBaseUrl:"",
        roleOption:{},
        role:0,
        own:0,
        guest:0
    },
    getters:{
        interfaceEditRole:function (state) {
            if(state.own==1 || state.role==0)
            {
                return true;
            }
            if(state.roleOption["ie"])
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        testEditRole:function (state) {
            if(state.own==1 || state.role==0)
            {
                return true;
            }
            if(state.roleOption["te"])
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        globalBaseUrlRole:function (state) {
            if(state.own==1 || state.role==0)
            {
                return true;
            }
            if(state.roleOption["gb"])
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        globalStatusRole:function (state) {
            if(state.own==1 || state.role==0)
            {
                return true;
            }
            if(state.roleOption["gs"])
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        globalInjectRole:function (state) {
            if(state.own==1 || state.role==0)
            {
                return true;
            }
            if(state.roleOption["gi"])
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        globalDocRole:function (state) {
            if(state.own==1 || state.role==0)
            {
                return true;
            }
            if(state.roleOption["gd"])
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        versionEditRole:function (state) {
            if(state.own==1 || state.role==0)
            {
                return true;
            }
            if(state.roleOption["ve"])
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        versionRollRole:function (state) {
            if(state.own==1 || state.role==0)
            {
                return true;
            }
            if(state.roleOption["vr"])
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    },
    mutations:{
        setProject:function(state,data){
            state.project=data;
            if(session.get("id")==state.project.owner)
            {
                state.own=1;
                state.role=0;
            }
            else
            {
                state.own=0;
                var bIn=false;
                state.project.users.forEach(function (obj) {
                    if(!obj.option && obj.role==1)
                    {
                        Vue.set(obj,"option",{
                            "ie":0,
                            "te":0,
                            "gb":0,
                            "gs":0,
                            "gi":0,
                            "gd":0,
                            "ve":0,
                            "vr":0
                        })
                    }
                    if(obj.user._id==session.get("id"))
                    {
                        bIn=true;
                        if(obj.role==0)
                        {
                            state.role=0;
                        }
                        else
                        {
                            state.role=1;
                            state.roleOption=obj.option;
                        }
                    }
                })
                if(!bIn && state.project.public)
                {
                    state.role=1;
                    state.guest=1;
                    state.roleOption={
                        "ie":0,
                        "te":0,
                        "gb":0,
                        "gs":0,
                        "gi":0,
                        "gd":0,
                        "ve":0,
                        "vr":0
                    };
                }
            }
        },
        setBaseUrls:function (state,data) {
            state.project.baseUrls=$.clone(data);
        },
        addBaseUrl:function (state,data) {
            if(!state.project.baseUrls)
            {
                state.project.baseUrls=[];
            }
            state.project.baseUrls.push($.clone(data));
        },
        setBefore:function (state,data) {
            state.project.before=data;
        },
        setAfter:function (state,data) {
            state.project.after=data;
        },
        setStatus:function (state,data) {
            state.status=data;
        },
        setLastBaseUrl:function (state,data) {
            state.lastBaseUrl=data;
        }
    },
    modules:{
        global:global,
        interface:inter,
        setting:setting,
        test:test,
        version:version
    }
});
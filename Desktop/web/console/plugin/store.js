var config=require("common/js/config")
module.exports={
    namespaced:true,
    state:{

    },
    getters:{
        level:function (state,getters,rootState) {
            return rootState.memberInfo.level;
        },
        event:function (state,getters,rootState) {
            return rootState.event;
        },
    },
    mutations:{

    },
    actions:{
        createTrade:function (context,obj) {
            var o={
                type:obj.type,
                member:sessionStorage.getItem("member")
            }
            if(obj.type==0)
            {
                o.plugin=obj.plugin
            }
            else
            {
                o.money=obj.money*100
            }
            return net.post(config.online+"/member/trade",o,{
                desktop:"1"
            },null,0,0,1);
        },
        pluginList:function (context) {
            return net.get(config.online+"/member/pluginlist",{
                member:sessionStorage.getItem("member")
            },{
                desktop:"1"
            },null,1);
        },
        pluginInfo:function (context,id) {
            return net.get(config.online+"/member/plugin",{
                id:id,
                member:sessionStorage.getItem("member")
            },{
                desktop:"1"
            },null,1);
        },
        buyWithPoint:function (context,id) {
            return net.post(config.online+"/member/buypluginwithpoint",{
                id:id,
                member:sessionStorage.getItem("member")
            },{
                desktop:"1"
            },null,0,0,1)
        }
    },
    modules:{

    }
}
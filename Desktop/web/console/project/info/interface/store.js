/**
 * Created by sunxin on 2017/2/23.
 */
var uuid=require("uuid");
module.exports={
    namespaced:true,
    state:function () {
        return {
            autoSave:false,
            interfaceList:[],
            interfaceSearchList:[],
            interface:null,
            searchText:"",
            searchType:0,
            selTabId:null,
            tabList:[],
        }
    },
    getters:{
        projectId:function (state,getters,rootState) {
            return rootState.info.project._id;
        },
        event:function (state,getters,rootState) {
            return rootState.event
        },
        baseUrls:function (state,getters,rootState) {
            return rootState.info.project.baseUrls;
        },
        template:function (state,getters,rootState) {
            return rootState.info.template;
        },
        objCopyJSON:function (state,getters,rootState) {
              return window.store.state.objCopyJSON;
        },
        status:function (state,getters,rootState) {
            return rootState.info.status;
        },
        interfaceEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/interfaceEditRole"];
        },
        testEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/testEditRole"];
        },
        globalBaseUrlRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalBaseUrlRole"];
        },
        globalStatusRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalStatusRole"];
        },
        globalInjectRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalInjectRole"];
        },
        globalDocRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/globalDocRole"];
        },
        versionEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/versionEditRole"];
        },
        versionRollRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["info/versionRollRole"];
        }
    },
    mutations:{
        init:function (state) {
            state.autoSave=false;
            state.interfaceList=[];
            state.interfaceSearchList=[];
            state.interface=null;
            state.objCopy=null;
            state.searchText="";
            state.searchType=0;
            state.selInterfaceId="";
            state.tabList=[];
            state.selTabId="";
        },
        initInterfaceList:function (state,data) {
            function init(data,list) {
                var arr=[]
                for(var i=0;i<data.length;i++)
                {
                    data[i].menu=0;
                    if(data[i].data)
                    {
                        if(list && list[i] && list[i]._id==data[i]._id)
                        {
                            data[i].show=list[i].show;
                        }
                        else
                        {
                            data[i].show=0;
                        }
                        data[i].data=init(data[i].data,(list && list[i])?list[i].data:null)
                    }
                    else
                    {
                        data[i].select=0;
                    }
                    arr.push(data[i]);
                }
                return arr;
            }
            state.interfaceList=init(data,state.interfaceList);
        },
        setSearchText:function (state,data) {
            state.searchText=data;
        },
        setSearchType:function (state,data) {
            state.searchType=data;
        },
        setStatus:function (state,data) {
            state.status=data;
        },
        setInterfaceSearchList:function (state,data) {
            state.interfaceSearchList=data;
        },
        setInterface:function (state,data) {
            state.interface=data;
        },
        setInterfaceList:function (state,data) {
            state.interfaceList=data;
        },
        setObjCopy:function (state,data) {
            state.objCopy=data;
        },
        searchInterface:function (state) {
            if(!state.searchText)
            {
                return;
            }
            state.interfaceSearchList=(function (list) {
                var searchList=[];
                for(var i=0;i<list.length;i++)
                {
                    var obj=list[i];
                    if(obj.data)
                    {
                        var objCopy={};
                        for(var key in obj)
                        {
                            objCopy[key]=obj[key];
                        }
                        objCopy.data=arguments.callee(objCopy.data)
                        if(objCopy.data.length>0)
                        {
                            searchList.push(objCopy);
                        }
                    }
                    else
                    {
                        var str;
                        if(state.searchType==0)
                        {
                            str=obj.name?obj.name:"";
                        }
                        else
                        {
                            str=obj.url?obj.url:"";
                        }
                        if(str.toLowerCase().indexOf(state.searchText.toLowerCase())>-1)
                        {
                            searchList.push(obj);
                        }
                    }
                }
                return searchList;
            })(state.interfaceList)
        },
    },
    actions:{
        add:function (context,data) {
            let index=1;
            let arr=[];
            context.state.tabList.forEach(function (obj) {
                if(!isNaN(obj._id))
                {
                    arr.push(Number(obj._id));
                }
            })
            while(arr.includes(index))
            {
                index++;
            }
            let obj={
                _id:String(index),
                name:(data.item && data.item.name)?data.item.name:"未命名",
                group:data.id,
                item:data.item
            }
            context.state.tabList.push(obj)
            context.state.selTabId=obj._id;
        },
        getAllInterface:function (context,data) {
            context.commit("initInterfaceList",data.data);
            context.commit("info/setBaseUrls",data.baseUrl,{
                root:true
            });
        },
        refreshData:function (context,data) {
            context.commit("initInterfaceList",data);
            if(context.state.interface)
            {
                context.state.interface.select=0;
            }
            context.commit("setInterface",null);
            context.commit("searchInterface");
        },
        refresh:function (context) {
            session.remove("snapshotId");
            session.remove("snapshotDis");
            session.remove("snapshotCreator");
            session.remove("snapshotDate");
            return net.get("/project/interface",{
                id:session.get("projectId"),
                sort:session.get("sort")?session.get("sort"):0
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data.data);
                    context.commit("info/setBaseUrls",data.data.baseUrl,{
                        root:true
                    });
                }
                return data;
            })
        },
        renameGroup:function (context,data) {
            return net.post("/group/create",data,{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        removeGroup:function (context,data) {
            return net.delete("/group/item",data).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        clear:function (context) {
            return net.delete("/project/clear",{
                id:session.get("projectId"),
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        removeInterface:function (context,data) {
            return net.delete("/interface/item",{
                id:data
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        destroyInterface:function (context,data) {
            return net.delete("/interface/destroyitem",{
                id:data
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        move:function (context,obj) {
            var pro;
            if(obj.obj.folder)
            {
                pro=net.put("/group/move",{
                    group:obj.obj.id,
                    to:obj.top?"":(obj.group?obj.group._id:""),
                    index:obj.index
                })
            }
            else
            {
                pro=net.put("/interface/move",{
                    id:obj.obj.id,
                    group:obj.group._id,
                    index:obj.index
                })
            }
            return pro.then(function (data) {
                if(data.code==200)
                {
                    context.commit("initInterfaceList",data.data);
                    (function (list,objGroup) {
                        for(var i=0;i<list.length;i++)
                        {
                            var o=list[i];
                            if(o.data)
                            {
                                if(o._id==obj.obj.id)
                                {
                                    if(objGroup)
                                    {
                                        objGroup.show=1;
                                    }
                                    return true;
                                }
                                else
                                {
                                    var ret=arguments.callee(o.data,o);
                                    if(ret)
                                    {
                                        return true;
                                    }
                                }
                            }
                            else
                            {
                                if(o._id==obj.obj.id)
                                {
                                    objGroup.show=1;
                                    if(obj.obj.select)
                                    {
                                        o.select=1;
                                        context.commit("setInterface",o);
                                        context.getters.event.$emit("moveInterface",{
                                            group:obj.group._id,
                                            id:obj.obj.id
                                        });
                                    }
                                    return true;
                                }
                            }
                        }
                        return false;
                    })(context.state.interfaceList);
                }
                return data;
            })
        },
        addGroup:function (context,query) {
            return net.post("/group/create",query.query,{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                if(data.code==200)
                {
                    if(query.group)
                    {
                        query.group.show=1;
                    }
                    context.commit("initInterfaceList",data.data);
                }
                return data;
            })
        },
        copy:function (context,data) {
            return net.get("/interface/item",{
                id:data.item1._id,
                group:data.item._id
            }).then(function (data) {
                if(data.code==200)
                {
                    var method=data.data.method;
                    var url=$.trim(data.data.url);
                    var name=$.trim(data.data.name)+"(副本)";
                    var param=data.data.param;
                    var obj={
                        method:method,
                        url:url,
                        group:{
                            _id:data.data.group._id
                        },
                        name:name,
                        remark:data.data.remark,
                        owner:"",
                        editor:"",
                        createdAt:"",
                        updatedAt:"",
                        finish:0,
                        param:param
                    }
                    context.state.objCopy=obj;
                }
                return data;
            })

        },
        mergeGroup:function (context,id) {
            return net.put("/group/merge",{
                group:id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        mergeInterface:function (context,id) {
            return net.put("/interface/merge",{
                id:id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        info:function (context,data) {
            let arr=context.state.tabList.map(function (obj) {
                return obj._id;
            })
            if(!arr.includes(data.item1._id))
            {
                context.state.tabList.push(data.item1)
            }
            else
            {
                if(context.state.interface)
                {
                    context.state.interface.select=0;
                }
                context.state.interface=data.item1;
                context.state.interface.select=1;
            }
            context.state.selTabId=data.item1._id;
        }
    }
}
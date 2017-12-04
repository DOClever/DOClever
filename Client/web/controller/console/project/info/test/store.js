/**
 * Created by sunxin on 2017/4/26.
 */
module.exports={
    namespaced:true,
    state:{
        data:[],
        test:null,
        selNode:null,
        groupModel:[],
    },
    getters:{
        baseUrls:function (state,getters,rootState) {
            return rootState.project.info.project.baseUrls;
        },
        before:function (state,getters,rootState) {
            return rootState.project.info.project.before;
        },
        after:function (state,getters,rootState) {
            return rootState.project.info.project.after;
        },
        event:function (state,getters,rootState) {
            return rootState.event;
        },
        interfaceEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/interfaceEditRole"];
        },
        testEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/testEditRole"];
        },
        globalBaseUrlRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalBaseUrlRole"];
        },
        globalStatusRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalStatusRole"];
        },
        globalInjectRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalInjectRole"];
        },
        globalDocRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/globalDocRole"];
        },
        versionEditRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/versionEditRole"];
        },
        versionRollRole:function (state,getters,rootState,rootGetters) {
            return rootGetters["project/info/versionRollRole"];
        }
    },
    mutations:{
        init:function (state,data) {
            state.data=data?data:[];
            state.test=null;
            state.selNode=null;
            state.groupModel=[];
        },
        setGroupModel:function (state,data) {
            state.groupModel=data;
        }
    },
    actions:{
        urlList:function (context) {
            return net.get("/project/urllist",{
                id:session.get("projectId")
            }).then(function (data) {
                return data;
            })
        },
        addModule:function (context,info) {
            var query;
            if(info.type==1)
            {
                query={
                    name:info.name,
                    module:info.node.data._id
                }
            }
            else
            {
                query={
                    name:info.name,
                    project:info.project
                };
            }
            return net.post("/test/module",query).then(function (data) {
                if(data.code==200)
                {
                    if(info.type==1)
                    {
                        info.node.data.name=data.data.name;
                    }
                    else
                    {
                        info.tree.store.append(data.data);
                    }
                }
                return data;
            })
        },
        addGroup:function (context,info) {
            var query={
                name:info.name
            }
            if(info.node.level==1)
            {
                query.module=info.node.data._id;
            }
            else
            {
                query.group=info.node.data._id
            }
            return net.post("/test/group",query).then(function (data) {
                if(data.code==200)
                {
                    if(info.node.level==1)
                    {
                        info.node.store.append(data.data,info.node.data);
                    }
                    else
                    {
                        info.node.data.name=data.data.name;
                    }
                }
                return data;
            })
        },
        removeModule:function (context,info) {
            return net.delete("/test/module",{
                module:info.data._id
            }).then(function (data) {
                if(data.code==200)
                {
                    info.store.remove(info.data);
                }
                return data;
            })
        },
        addTest:function (context,info) {
            var query={
                name:info.name,
                group:info.node.data._id
            }
            return net.post("/test/test",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.test=data.data;
                    info.node.store.append({
                        name:data.data.name,
                        id:data.data.id,
                        _id:data.data._id,
                        group:data.data.group,
                        status:data.data.status
                    },info.node.data);
                    context.state.selNode=info.node.store.getNode(data.data.id);
                    context.state.selNode.store.setCurrentNodeKey(data.data.id);
                    context.state.selNode.store.setDefaultExpandedKeys([data.data.id])
                    context.state.groupModel=[data.data.module,data.data.group]
                }
                return data;
            })
        },
        removeGroup:function (context,info) {
            return net.delete("/test/group",{
                group:info.data._id
            }).then(function (data) {
                if(data.code==200)
                {
                    info.store.remove(info.data);
                }
                return data;
            })
        },
        removeTest:function (context,info) {
            return net.delete("/test/test",{
                id:info.data._id
            }).then(function (data) {
                if(data.code==200)
                {
                    info.store.remove(info.data);
                    if(info==context.state.selNode)
                    {
                        context.state.selNode=null;
                    }
                }
                return data;
            })
        },
        info:function (context,node) {
            return net.get("/test/info",{
                id:node.data._id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.test=data.data;
                    context.state.selNode=node;
                    context.state.groupModel=[data.data.module,data.data.group];
                }
                else
                {
                    context.state.test=null;
                    context.state.selNode=null;
                }
                return data;
            })
        },
        save:function (context,data) {
            if(!context.state.test.name)
            {
                return {
                    code:0,
                    msg:"名称不能为空"
                }
            }
            var obj={
                id:context.state.test._id,
                name:context.state.test.name,
                group:context.state.groupModel[1],
                remark:context.state.test.remark===undefined?"":context.state.test.remark,
                status:context.state.test.status,
                code:document.getElementById("testContent").innerHTML,
                output:context.state.test.output===undefined?"":context.state.test.output
            }
            return net.post("/test/test",obj).then(function (data) {
                if(data.code==200)
                {
                    context.state.selNode.data.name=context.state.test.name;
                    context.state.selNode.data.status=context.state.test.status;
                    if(context.state.selNode.data.group!=data.data.group)
                    {
                        var id;
                        context.state.selNode.store.root.childNodes.forEach(function (obj) {
                            obj.childNodes.forEach(function (obj) {
                                if(obj.data._id==data.data.group)
                                {
                                    id=obj.id;
                                }
                            })
                        })
                        context.state.selNode.data.group=data.data.group;
                        var node=context.state.selNode.store.getNode(id);
                        context.state.selNode.store.remove(context.state.selNode.data);
                        context.state.selNode.store.append(context.state.selNode.data,node.data);
                        context.state.selNode=context.state.selNode.store.getNode(data.data.id);
                        context.state.selNode.store.setCurrentNodeKey(data.data.id);
                        context.state.selNode.store.setDefaultExpandedKeys([data.data.id])
                    }
                }
                return data;
            })
        },
        showInterface:function (context,obj) {
            var itemData;
            return net.get("/interface/item",{
                id:obj.id,
                project:session.get("projectId")
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("handleInterface",{
                        interface:data.data,
                        originInterface:obj.interface,
                        status:obj.status
                    });
                }
                return data;
            })
        },
        handleInterface:function (context,obj) {
            obj.interface.param.forEach(function (objParam,index) {
                Vue.set(objParam,"encrypt",{
                    type:"",
                    salt:""
                })
                objParam.queryParam.forEach(function (item,i) {
                    if(item.value && typeof(item.value)=="object" && (item.value instanceof Array))
                    {
                        item.value={
                            type:0,
                            status:"",
                            data:item.value.map(function (obj) {
                                return {
                                    value:obj,
                                    remark:""
                                }
                            })
                        }
                    }
                    if(obj.originInterface && obj.originInterface.id==obj.interface.id && (obj.originInterface.paramId==objParam.id || (!obj.originInterface.paramId && i==0)))
                    {
                        Vue.set(item,"enable",obj.originInterface.queryParam[i].enable);
                        Vue.set(item,"selValue",obj.originInterface.queryParam[i].selValue);
                        Vue.set(item,"encrypt",obj.originInterface.queryParam[i].encrypt);
                    }
                    else
                    {
                        Vue.set(item,"enable",1);
                        Vue.set(item,"selValue","");
                        if(item.value && item.value.type==0 && item.value.data.length>0)
                        {
                            item.selValue=item.value.data[0].value;
                        }
                        else if(item.value && item.value.type==1 && item.value.status)
                        {
                            var objStatus=null;
                            obj.status.forEach(function (obj) {
                                if(obj.id==item.value.status)
                                {
                                    objStatus=obj;
                                }
                            })
                            if(objStatus && objStatus.data.length>0)
                            {
                                item.selValue=objStatus.data[0].key;
                            }
                            else
                            {
                                item.selValue="";
                            }
                        }
                        else
                        {
                            item.selValue="";
                        }
                    }
                })
                if(objParam.bodyParam)
                {
                    objParam.bodyParam.forEach(function (item,i) {
                        if(item.value && typeof(item.value)=="object" && (item.value instanceof Array))
                        {
                            item.value={
                                type:0,
                                status:"",
                                data:item.value.map(function (obj) {
                                    return {
                                        value:obj,
                                        remark:""
                                    }
                                })
                            }
                        }
                        if(obj.originInterface && obj.originInterface.id==obj.interface.id && (obj.originInterface.paramId==objParam.id || (!obj.originInterface.paramId && i==0)))
                        {
                            Vue.set(item,"enable",obj.originInterface.bodyParam[i].enable);
                            Vue.set(item,"selValue",obj.originInterface.bodyParam[i].selValue);
                            Vue.set(item,"encrypt",obj.originInterface.bodyParam[i].encrypt);
                        }
                        else
                        {
                            Vue.set(item,"enable",1);
                            Vue.set(item,"selValue","");
                            if(item.value && item.value.type==0 && item.value.data.length>0)
                            {
                                item.selValue=item.value.data[0].value;
                            }
                            else if(item.value && item.value.type==1 && item.value.status)
                            {
                                var objStatus=null;
                                obj.status.forEach(function (obj) {
                                    if(obj.id==item.value.status)
                                    {
                                        objStatus=obj;
                                    }
                                })
                                if(objStatus && objStatus.data.length>0)
                                {
                                    item.selValue=objStatus.data[0].key;
                                }
                                else
                                {
                                    item.selValue="";
                                }
                            }
                            else
                            {
                                item.selValue="";
                            }
                        }
                    })
                }
                if(obj.originInterface && obj.originInterface.id==obj.interface.id && (obj.originInterface.paramId==objParam.id || (!obj.originInterface.paramId && i==0)))
                {
                    objParam.header=obj.originInterface.header
                }
                else
                {
                    objParam.header.forEach(function (item) {
                        Vue.set(item,"enable",1);
                    })
                }
                objParam.restParam.forEach(function (item,i) {
                    if(obj.originInterface && obj.originInterface.id==obj.interface.id && (obj.originInterface.paramId==objParam.id || (!obj.originInterface.paramId && i==0)))
                    {
                        Vue.set(item,"selValue",obj.originInterface.restParam[i].selValue);
                    }
                    else
                    {
                        Vue.set(item,"selValue","");
                        if(item.value && item.value.type==0 && item.value.data.length>0)
                        {
                            item.selValue=item.value.data[0].value;
                        }
                        else if(item.value && item.value.type==1 && item.value.status)
                        {
                            var objStatus=null;
                            obj.status.forEach(function (obj) {
                                if(obj.id==item.value.status)
                                {
                                    objStatus=obj;
                                }
                            })
                            if(objStatus && objStatus.data.length>0)
                            {
                                item.selValue=objStatus.data[0].key;
                            }
                            else
                            {
                                item.selValue="";
                            }
                        }
                        else
                        {
                            item.selValue="";
                        }
                    }
                });
                if(obj.interface.method=="POST" || obj.interface.method=="PUT" || obj.interface.method=="PATCH")
                {
                    if(obj.originInterface && obj.originInterface.id==obj.interface.id && (obj.originInterface.paramId==objParam.id || (!obj.originInterface.paramId && i==0)))
                    {
                        objParam.bodyInfo=obj.originInterface.bodyInfo
                        objParam.encrypt=obj.originInterface.encrypt;
                    }
                    else
                    {
                        Vue.set(objParam,"encrypt",{
                            type:"",
                            salt:""
                        });
                        if(objParam.bodyParam===undefined)
                        {
                            Vue.set(objParam,"bodyParam",[]);
                        }
                        if(objParam.bodyInfo===undefined)
                        {
                            Vue.set(objParam,"bodyInfo",{
                                type:0,
                                rawType:0
                            });
                        }
                        if(objParam.bodyInfo.rawText===undefined)
                        {
                            Vue.set(objParam.bodyInfo,"rawText","");
                        }
                        if(objParam.bodyInfo.rawTextRemark===undefined)
                        {
                            Vue.set(objParam.bodyInfo,"rawTextRemark","");
                        }
                        if(objParam.bodyInfo.rawFileRemark===undefined)
                        {
                            Vue.set(objParam.bodyInfo,"rawFileRemark","");
                        }
                        if(objParam.bodyInfo.rawJSONType===undefined)
                        {
                            Vue.set(objParam.bodyInfo,"rawJSONType",0);
                        }
                        if(objParam.bodyInfo.rawJSON==undefined)
                        {
                            Vue.set(objParam.bodyInfo,"rawJSON",[]);
                        }
                        var bFind=false;
                        for(var i=0;i<objParam.header.length;i++)
                        {
                            var obj1=objParam.header[i];
                            if(obj1.name.toLowerCase()=="content-type" && obj1.value.toLowerCase().indexOf("application/json")>-1)
                            {
                                bFind=true;
                                break;
                            }
                        }
                        if(bFind && objParam.bodyInfo.rawText)
                        {
                            var obj1;
                            try
                            {
                                obj1=JSON.parse(objParam.bodyInfo.rawText);
                            }
                            catch (e)
                            {

                            }
                            if(obj1)
                            {
                                var result=[];
                                for(var key in obj1)
                                {
                                    helper.handleResultData(key,obj1[key],result,null,1)
                                }
                                objParam.bodyInfo.rawJSON=result;
                                objParam.bodyInfo.rawText="";
                                objParam.bodyInfo.rawType=2;
                            }
                        }
                    }
                }
                if(obj.originInterface && obj.originInterface.id==obj.interface.id && (obj.originInterface.paramId==objParam.id || (!obj.originInterface.paramId && i==0)))
                {
                    objParam.before=obj.originInterface.before
                }
                else
                {
                    if(!objParam.before)
                    {
                        Vue.set(objParam,"before",{
                            mode:0,
                            code:""
                        })
                    }
                    else
                    {
                        if(typeof(objParam.before)=="string")
                        {
                            objParam.before={
                                mode:0,
                                code:objParam.before
                            }
                        }
                    }
                }
                if(obj.originInterface && obj.originInterface.id==obj.interface.id && (obj.originInterface.paramId==objParam.id || (!obj.originInterface.paramId && i==0)))
                {
                    objParam.after=obj.originInterface.after
                }
                else
                {
                    if(!objParam.after)
                    {
                        Vue.set(objParam,"after",{
                            mode:0,
                            code:""
                        })
                    }
                    else
                    {
                        if(typeof(objParam.after)=="string")
                        {
                            objParam.after={
                                mode:0,
                                code:objParam.after
                            }
                        }
                    }
                }
            })
        },
    }
}
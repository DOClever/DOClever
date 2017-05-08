/**
 * Created by sunxin on 2017/4/26.
 */
module.exports=new Vuex.Store({
    state:{
        data:[],
        test:null,
        selNode:null,
        groupModel:[],
    },
    mutations:{
        init:function (state,data) {
            state.data=data;
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
            obj.interface.queryParam.forEach(function (item,i) {
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
                if(obj.originInterface && obj.originInterface.id==obj.interface.id)
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
            obj.interface.bodyParam.forEach(function (item) {
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
                if(obj.originInterface && obj.originInterface.id==obj.interface.id)
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
            if(obj.originInterface && obj.originInterface.id==obj.interface.id)
            {
                obj.interface.header=obj.originInterface.header
            }
            else
            {
                obj.interface.header.forEach(function (item) {
                    Vue.set(item,"enable",1);
                })
            }
            obj.interface.restParam.forEach(function (item) {
                if(obj.originInterface && obj.originInterface.id==obj.interface.id)
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
            if(obj.interface.method=="POST" || obj.interface.method=="PUT")
            {
                if(obj.originInterface && obj.originInterface.id==obj.interface.id)
                {
                    obj.interface.bodyInfo=obj.originInterface.bodyInfo
                    obj.interface.encrypt=obj.originInterface.encrypt;
                }
                else
                {
                    Vue.set(obj.interface,"encrypt",{
                        type:"",
                        salt:""
                    });
                    if(obj.interface.bodyInfo.rawText===undefined)
                    {
                        Vue.set(obj.interface.bodyInfo,"rawText","");
                    }
                    if(obj.interface.bodyInfo.rawTextRemark===undefined)
                    {
                        Vue.set(obj.interface.bodyInfo,"rawTextRemark","");
                    }
                    if(obj.interface.bodyInfo.rawFileRemark===undefined)
                    {
                        Vue.set(obj.interface.bodyInfo,"rawFileRemark","");
                    }
                    if(obj.interface.bodyInfo.rawJSON==undefined)
                    {
                        Vue.set(obj.interface.bodyInfo,"rawJSON",[]);
                    }
                    var bFind=false;
                    for(var i=0;i<obj.interface.header.length;i++)
                    {
                        var obj1=obj.interface.header[i];
                        if(obj1.name.toLowerCase()=="content-type" && obj1.value.toLowerCase()=="application/json")
                        {
                            bFind=true;
                            break;
                        }
                    }
                    if(bFind && obj.interface.bodyInfo.rawText)
                    {
                        var obj;
                        try
                        {
                            obj=JSON.parse(obj.interface.bodyInfo.rawText);
                        }
                        catch (e)
                        {

                        }
                        if(obj)
                        {
                            var result=[];
                            for(var key in obj)
                            {
                                helper.handleResultData(key,obj[key],result,null,1)
                            }
                            obj.interface.bodyInfo.rawJSON=result;
                            obj.interface.bodyInfo.rawText="";
                            obj.interface.bodyInfo.rawType=2;
                        }
                    }
                }
            }
            if(obj.originInterface && obj.originInterface.id==obj.interface.id)
            {
                obj.interface.before=obj.originInterface.before
            }
            else
            {
                if(!obj.interface.before)
                {
                    Vue.set(obj.interface,"before",{
                        mode:0,
                        code:""
                    })
                }
                else
                {
                    if(typeof(obj.interface.before)=="string")
                    {
                        obj.interface.before={
                            mode:0,
                            code:obj.interface.before
                        }
                    }
                }
            }
            if(obj.originInterface && obj.originInterface.id==obj.interface.id)
            {
                obj.interface.after=obj.originInterface.after
            }
            else
            {
                if(!obj.interface.after)
                {
                    Vue.set(obj.interface,"after",{
                        mode:0,
                        code:""
                    })
                }
                else
                {
                    if(typeof(obj.interface.after)=="string")
                    {
                        obj.interface.after={
                            mode:0,
                            code:obj.interface.after
                        }
                    }
                }
            }
        },
    }
})
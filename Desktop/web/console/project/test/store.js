/**
 * Created by sunxin on 2017/4/26.
 */
module.exports={
    namespaced:true,
    state:function () {
        return {
            data:[],
            selTest:null,
            test:{
                owner:{},
                cooperation:[]
            },
            selNode:null,
            groupModel:[],
            selUser:"",
            infoType:"",
            tree:null,
            interfaceList:[],
            baseUrl:"",
            baseUrls:[],
            arrSelBaseUrl:[],
            env:[],
            objCopy:null,
            collection:[],
            selCollection:null,
            tempData:null,
        }
    },
    getters:{
        baseUrls:function (state,getters,rootState) {
            return rootState.info.project.baseUrls;
        },
        before:function (state,getters,rootState) {
            return rootState.info.project.before;
        },
        after:function (state,getters,rootState) {
            return rootState.info.project.after;
        },
        event:function (state,getters,rootState) {
            return rootState.event
        },
        ownRole:function (state) {
            if(state.test.owner._id==session.get("id"))
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        editRole:function (state) {
            if(session.get("id")==state.selUser)
            {
                return true
            }
            else
            {
                var objUser=null;
                state.test.cooperation.forEach(function (obj) {
                    if(obj.user==state.selUser)
                    {
                        objUser=obj;
                    }
                })
                if(!objUser)
                {
                    return false;
                }
                else
                {
                    return objUser.users.indexOf(session.get("id"))>-1
                }
            }
        }
    },
    mutations:{
        init:function (state,data) {
            state.data=data?data.testList:[];
            state.selTest=null;
            state.selNode=null;
            state.groupModel=[];
            state.test=data?data.info:{
                owner:{},
                cooperation:[]
            };
            state.selUser=data?data.user:"";
            state.infoType="";
            state.baseUrl="";
            state.baseUrls=[];
            state.arrSelBaseUrl=[];
            state.env=[];
            state.objCopy=null;
            state.collection=data?data.collectionList:[];
            state.selCollection=null;
        },
        setGroupModel:function (state,data) {
            state.groupModel=data;
        },
    },
    actions:{
        init:function (context) {
            context.commit("init");
            net.get("/test/interfacelist",{
            }).then(function (dt) {
                if(dt.code==200)
                {
                    context.state.interfaceList=dt.data;
                }
                return dt;
            })
            return net.get("/test/info",{
                project:session.get("projectId")
            }).then(function (dt) {
                if(dt.code==200)
                {
                    context.commit("init",dt.data);
                    context.dispatch("baseUrl",1)
                }
                return dt;
            })
        },
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
                    project:info.project,
                    user:context.state.selUser
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
                        context.state.data.push(data.data);
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
                query.user=context.state.selUser
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
                        info.node.data.data.push(data.data);
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
                    for(var i=0;i<context.state.data.length;i++)
                    {
                        if(context.state.data[i]._id==info.data._id)
                        {
                            context.state.data.splice(i,1);
                            break;
                        }
                    }
                }
                return data;
            })
        },
        addTest:function (context,info) {
            var query={
                name:info.name,
                group:info.node.data._id,
                user:context.state.selUser
            }
            return net.post("/test/test",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.selTest=data.data;
                    info.node.data.data.push(data.data);
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
                    for(var i=0;i<context.state.data.length;i++)
                    {
                        var obj=context.state.data[i];
                        var bFind=false;
                        for(var j=0;j<obj.data.length;j++)
                        {
                            var obj1=obj.data[j];
                            if(obj1._id==info.data._id)
                            {
                                bFind=true;
                                obj.data.splice(j,1);
                                break;
                            }
                        }
                        if(bFind)
                        {
                            break;
                        }
                    }
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
                    if(info==context.state.selNode)
                    {
                        context.state.selNode=null;
                        context.state.infoType=""
                    }
                    for(var i=0;i<context.state.data.length;i++)
                    {
                        var obj=context.state.data[i];
                        var bFind=false;
                        for(var j=0;j<obj.data.length;j++)
                        {
                            var obj1=obj.data[j];
                            var bFind1=false;
                            for(var k=0;k<obj1.data.length;k++)
                            {
                                var obj2=obj1.data[k];
                                if(obj2._id==info.data._id)
                                {
                                    bFind1=true;
                                    obj1.data.splice(k,1);
                                    break;
                                }
                            }
                            if(bFind1)
                            {
                                bFind=true;
                                break;
                            }
                        }
                        if(bFind)
                        {
                            break;
                        }
                    }
                }
                return data;
            })
        },
        info:function (context,node) {
            return net.get("/test/test",{
                id:node.data._id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.selTest=data.data;
                    context.state.selNode=node;
                    context.state.groupModel=[data.data.module,data.data.group];
                    context.state.infoType="testinfo"
                }
                else
                {
                    context.state.selTest=null;
                    context.state.selNode=null;
                }
                return data;
            })
        },
        collectionInfo:function (context,id) {
            return net.get("/test/collection",{
                collection:id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.selCollection=data.data;
                    context.state.infoType="collectioninfo"
                }
                else
                {
                    context.state.selCollection=null;
                }
                return data;
            })
        },
        save:function (context,data) {
            if(!context.state.selTest.name)
            {
                return {
                    code:0,
                    msg:"名称不能为空"
                }
            }
            var ele=document.getElementById("testContent");
            var tempEle=document.createElement("div");
            tempEle.innerHTML=ele.innerHTML;
            var arrLink=tempEle.querySelectorAll("a[data]");
            var arrLinkOuter=[];
            arrLink.forEach(function (obj) {
                var str=obj.getAttribute("data");
                var type=obj.getAttribute("type");
                var id=Date.now()+$.rand(1,10000);
                var objPush={
                    text:id,
                    html:obj.outerHTML
                }
                arrLinkOuter.push(objPush);
                var parentNode=obj.parentNode;
                parentNode.replaceChild(document.createTextNode(objPush.text),obj);
                parentNode.normalize();
            })
            var arrChild=tempEle.childNodes;
            for(var i=0;i<arrChild.length;i++)
            {
                var objDiv=arrChild[i];
                if(objDiv.textContent)
                {
                    objDiv.innerHTML=$.tagReplace(objDiv.textContent);
                }
            }
            arrLinkOuter.forEach(function (obj) {
                tempEle.innerHTML=tempEle.innerHTML.replace(obj.text,obj.html);
            })
            context.state.selTest.ui.forEach(function (obj) {
                if(obj.type=="interface")
                {
                    delete obj.info;
                }
            })
            var code=tempEle.innerHTML;
            var obj={
                id:context.state.selTest._id,
                name:context.state.selTest.name,
                group:context.state.groupModel[1],
                remark:context.state.selTest.remark===undefined?"":context.state.selTest.remark,
                status:context.state.selTest.status,
                code:code,
                ui:JSON.stringify(context.state.selTest.ui),
                output:context.state.selTest.output===undefined?"":context.state.selTest.output,
                user:context.state.selUser
            }
            return net.post("/test/test",obj).then(function (data) {
                if(data.code==200)
                {
                    if(context.state.selNode.data.group._id && context.state.selNode.data.group._id!=data.data.group._id)
                    {
                        var oldGroupData,newGroupData,index;
                        context.state.selNode.store.root.childNodes.forEach(function (obj) {
                            obj.childNodes.forEach(function (obj) {
                                if(obj.data._id==data.data.group._id)
                                {
                                    newGroupData=obj.data.data;
                                }
                                else if(obj.data._id==context.state.selNode.data.group._id)
                                {
                                    oldGroupData=obj.data.data;
                                    oldGroupData.forEach(function (obj,i) {
                                        if(obj._id==context.state.selTest._id)
                                        {
                                            index=i;
                                        }
                                    })
                                }
                            })
                        })
                        oldGroupData.splice(index,1);
                        newGroupData.push(data.data);
                        context.state.selNode.data.group=data.data.group;
                        context.state.selNode.store.setCurrentNodeKey(data.data.id);
                        context.state.selNode.store.setDefaultExpandedKeys([data.data.id])
                    }
                }
                return data;
            })
        },
        showInterface:function (context,obj) {
            var itemData;
            return net.get("/test/interface",{
                interface:obj.id,
            }).then(function (data) {
                if(data.code==200)
                {
                    obj.status=data.data.status;
                    obj.baseUrls.splice(0,obj.baseUrls.length);
                    for(var i=0;i<data.data.baseUrls.length;i++)
                    {
                        obj.baseUrls[i]=data.data.baseUrls[i];
                    }
                    context.dispatch("handleInterface",{
                        interface:data.data.interface,
                        originInterface:obj.interface,
                        status:obj.status,
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
        changeUser:function (context) {
            context.state.data=[];
            context.state.selTest=null;
            context.state.selNode=null;
            context.state.groupModel=[];
            context.state.infoType="";
            context.state.baseUrl="";
            context.state.baseUrls=[];
            context.state.arrSelBaseUrl=[];
            context.state.env=[];
            context.state.collection=[];
            context.state.selCollection=null;
            return Promise.all([
                net.get("/test/list",{
                    project:session.get("projectId"),
                    user:context.state.selUser
                }),
                net.get("/test/collectionlist",{
                    project:session.get("projectId"),
                    user:context.state.selUser
                }),
                context.dispatch("baseUrl",1)
            ]).then(function (values) {
                var data1=values[0];
                var data2=values[1];
                if(data1.code==200)
                {
                    context.state.data=data1.data;
                }
                if(data2.code==200)
                {
                    context.state.collection=data2.data;
                }
                return data1;
            })
        },
        baseUrl:function (context,ignore) {
            var urls="",arrProject=[];;
            if(document.getElementById("testContent") && !ignore)
            {
                var ele=document.getElementById("testContent");
                var arr=ele.querySelectorAll("a[data]");
                arr.forEach(function (obj) {
                    var type=obj.getAttribute("type");
                    if(type!=1)
                    {
                        return;
                    }
                    var data=obj.getAttribute("data");
                    var o=JSON.parse(data);
                    if(o.project && o.project._id && arrProject.indexOf(o.project._id)==-1)
                    {
                        arrProject.push(o.project._id);
                    }
                })
            }
            if(context.state.selTest && context.state.selTest.ui.length>0  && !ignore)
            {
                context.state.selTest.ui.forEach(function (obj) {
                    if(obj.type=="interface")
                    {
                        let o=JSON.parse(obj.data);
                        if(o.project && o.project._id && arrProject.indexOf(o.project._id)==-1)
                        {
                            arrProject.push(o.project._id);
                        }
                    }
                })
            }
            urls=arrProject.join(",");
            return net.get("/test/urllist",{
                project:session.get("projectId"),
                user:context.state.selUser,
                urls:urls
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.baseUrls=data.data;
                }
                return data;
            })
        },
        renameCollection:function (context,data) {
            return net.post("/test/collection",{
                collection:data.id,
                name:data.name
            }).then(function (data) {
                return data;
            })
        },
        addCollection:function (context,name) {
            return net.post("/test/collection",{
                name:name,
                project:session.get("projectId"),
                user:context.state.selUser
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.collection.unshift(data.data);
                }
                return data;
            })
        },
        removeCollection:function (context,id) {
            return net.delete("/test/collection",{
                collection:id
            }).then(function (data) {
                if(data.code==200)
                {
                    for(var i=0;i<context.state.collection.length;i++)
                    {
                        if(context.state.collection[i]._id==id)
                        {
                            context.state.collection.splice(i,1);
                            break;
                        }
                    }
                }
                return data;
            })
        },
        saveCollection:function (context,data) {
            data.project=session.get("projectId");
            return net.post("/test/collection",data).then(function (dt) {
                return dt
            })
        },
        changeExample:function (context,obj) {
            var pro;
            if(obj.id)
            {
                pro=net.get("/example/item",{
                    id:obj.id
                })
            }
            else
            {
                pro=net.get("/interface/param",{
                    id:obj.objInterface._id,
                    param:obj.objOriginal.id
                })
            }
            return pro.then(function (data) {
                if(data.code==200)
                {
                    var objNew;
                    if(obj.id)
                    {
                        objNew={
                            queryParam:data.data.param.query.filter(function (obj) {
                                if(obj.name)
                                {
                                    return true;
                                }
                                else
                                {
                                    return false;
                                }
                            }),
                            header:data.data.param.header.filter(function (obj) {
                                if(obj.name)
                                {
                                    return true;
                                }
                                else
                                {
                                    return false;
                                }
                            }),
                            restParam:data.data.param.param.filter(function (obj) {
                                if(obj.name)
                                {
                                    return true;
                                }
                                else
                                {
                                    return false;
                                }
                            }),
                            before:data.data.param.before,
                            after:data.data.param.after
                        }
                        if(data.data.param.body)
                        {
                            objNew.bodyParam=data.data.param.body.filter(function (obj) {
                                if(obj.name)
                                {
                                    return true;
                                }
                                else
                                {
                                    return false;
                                }
                            });
                        }
                        if(data.data.param.bodyInfo)
                        {
                            objNew.bodyInfo=data.data.param.bodyInfo;
                        }
                    }
                    else
                    {
                        objNew={
                            queryParam:data.data.queryParam,
                            header:data.data.header,
                            restParam:data.data.restParam,
                            before:data.data.before,
                            after:data.data.after
                        }
                        if(data.data.bodyParam)
                        {
                            objNew.bodyParam=data.data.bodyParam;
                        }
                        if(data.data.bodyInfo)
                        {
                            objNew.bodyInfo=data.data.bodyInfo;
                        }
                        Vue.set(objNew,"encrypt",{
                            type:"",
                            salt:""
                        })
                        objNew.queryParam.forEach(function (item,i) {
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
                        })
                        if(objNew.bodyParam)
                        {
                            objNew.bodyParam.forEach(function (item,i) {
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
                            })
                        }
                        objNew.header.forEach(function (item) {
                            Vue.set(item,"enable",1);
                        })
                        objNew.restParam.forEach(function (item,i) {
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
                        });
                        if(obj.objInterface.method=="POST" || obj.objInterface.method=="PUT" || obj.objInterface.method=="PATCH")
                        {
                            Vue.set(objNew,"encrypt",{
                                type:"",
                                salt:""
                            });
                            if(objNew.bodyParam===undefined)
                            {
                                Vue.set(objNew,"bodyParam",[]);
                            }
                            if(objNew.bodyInfo===undefined)
                            {
                                Vue.set(objNew,"bodyInfo",{
                                    type:0,
                                    rawType:0
                                });
                            }
                            if(objNew.bodyInfo.rawText===undefined)
                            {
                                Vue.set(objNew.bodyInfo,"rawText","");
                            }
                            if(objNew.bodyInfo.rawTextRemark===undefined)
                            {
                                Vue.set(objNew.bodyInfo,"rawTextRemark","");
                            }
                            if(objNew.bodyInfo.rawFileRemark===undefined)
                            {
                                Vue.set(objNew.bodyInfo,"rawFileRemark","");
                            }
                            if(objNew.bodyInfo.rawJSONType===undefined)
                            {
                                Vue.set(objNew.bodyInfo,"rawJSONType",0);
                            }
                            if(objNew.bodyInfo.rawJSON==undefined)
                            {
                                Vue.set(objNew.bodyInfo,"rawJSON",[]);
                            }
                            var bFind=false;
                            for(var i=0;i<objNew.header.length;i++)
                            {
                                var obj1=objNew.header[i];
                                if(obj1.name.toLowerCase()=="content-type" && obj1.value.toLowerCase().indexOf("application/json")>-1)
                                {
                                    bFind=true;
                                    break;
                                }
                            }
                            if(bFind && objNew.bodyInfo.rawText)
                            {
                                var obj1;
                                try
                                {
                                    obj1=JSON.parse(objNew.bodyInfo.rawText);
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
                                    objNew.bodyInfo.rawJSON=result;
                                    objNew.bodyInfo.rawText="";
                                    objNew.bodyInfo.rawType=2;
                                }
                            }
                        }
                    }
                    for(var key in objNew)
                    {
                        Vue.set(obj.objOriginal,key,objNew[key]);
                    }
                    if(obj.id)
                    {
                        Vue.set(obj.objOriginal,"example",{
                            id:data.data._id,
                            name:data.data.name
                        });
                    }
                    else
                    {
                        delete obj.objOriginal.example
                    }
                }
                return data;
            })
        },
        importModule:function (context,obj) {
            return net.post("/test/importmodule",{
                content:obj,
                project:session.get("projectId")
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.selTest=null;
                    context.state.selNode=null;
                    return net.get("/test/list",{
                        project:session.get("projectId"),
                        user:context.state.selUser
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            context.state.data=data.data;
                        }
                        return data;
                    })
                }
                return data;
            })
        },
        importGroup:function (context,obj) {
            return net.post("/test/importgroup",{
                content:obj.content,
                module:obj.module
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.selTest=null;
                    context.state.selNode=null;
                    return net.get("/test/list",{
                        project:session.get("projectId"),
                        user:context.state.selUser
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            context.state.data=data.data;
                        }
                        return data;
                    })
                }
                return data;
            })
        },
        importTest:function (context,obj) {
            return net.post("/test/importtest",{
                content:obj.content,
                group:obj.group
            }).then(function (data) {
                if(data.code==200)
                {
                    obj.node.data.data.push(data.data);
                }
                return data;
            })
        },
        pasteTest:function (context,obj) {
            return net.post("/test/pastetest",{
                test:window.store.state.copyTestId,
                group:obj.group
            }).then(function (data) {
                if(data.code==200)
                {
                    obj.node.data.data.push(data.data);
                }
                return data;
            })
        }
    }
}








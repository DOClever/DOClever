module.exports= {
    namespaced: true,
    state:function () {
        return {
            doc:{
                owner:{

                }
            },
            list:[],
            selDoc:null,
            selItem:null,
        }
    },
    getters:{
        ownRole:function (state) {
            if(state.doc.owner._id==session.get("id"))
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        event:function (state,getters,rootState) {
            return rootState.event
        }
    },
    mutations:{
        init:function (state) {
            state.doc={
                owner:{

                }
            };
        },
        clear:function (state) {
            state.selDoc=null;
            state.selItem=null;
        }
    },
    actions:{
        init:function (context) {
            context.commit("init");
            return net.get("/doc/project",{
                project:session.get("projectId")
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.doc=data.data;
                }
                return data;
            })
        },
        list:function (context) {
            return net.get("/doc/structure",{
                project:session.get("projectId")
            }).then(function (data) {
                if(data.code==200)
                {
                    (function (arr) {
                        for(var i=0;i<arr.length;i++)
                        {
                            var obj=arr[i];
                            obj.menu=0;
                            obj.show=0;
                            arguments.callee(obj.childGroup);
                            for(var j=0;j<obj.childDoc.length;j++)
                            {
                                var obj1=obj.childDoc[j];
                                obj1.menu=0;
                                obj1.select=0;
                            }
                        }
                    })(data.data);
                    context.state.list=data.data
                }
                return data;
            })
        },
        addGroup:function (context,data) {
            var query={
                name:data.name,
                project:session.get("projectId")
            }
            if(data.parent)
            {
                query.parent=data.parent._id
            }
            return net.post("/doc/group",query).then(function (dt) {
                if(dt.code==200)
                {
                    if(data.parent)
                    {
                        dt.data.menu=0;
                        dt.data.show=0;
                        data.parent.show=1;
                        data.parent.childGroup.push(dt.data);
                    }
                    else
                    {
                        dt.data.menu=0;
                        dt.data.show=0;
                        context.state.list.push(dt.data);
                    }
                }
                return dt;
            })
        },
        renameGroup:function (context,data) {
            var query={
                group:data.item._id,
                name:data.name,
                project:session.get("projectId")
            }
            if(data.parent)
            {
                query.parent=data.parent._id
            }
            return net.post("/doc/group",query).then(function (dt) {
                if(dt.code==200)
                {
                    data.item.name=data.name;
                }
                return dt;
            })
        },
        removeGroup:function (context,data) {
            var query={
                group:data.id,
            }
            return net.delete("/doc/group",query).then(function (dt) {
                if(dt.code==200)
                {
                    var index,arr,bSel=false;
                    if(data.parent)
                    {
                        arr=data.parent.childGroup;
                    }
                    else
                    {
                        arr=context.state.list;
                    }
                    if(context.state.selItem)
                    {
                        (function (arr) {
                            for(var i=0;i<arr.length;i++)
                            {
                                var obj=arr[i];
                                for(var j=0;j<obj.childDoc.length;j++)
                                {
                                    if(obj.childDoc[j]._id==context.state.selItem._id)
                                    {
                                        bSel=true;
                                        return true;
                                    }
                                }
                                var ret=arguments.callee(obj.childGroup);
                                if(ret)
                                {
                                    return true;
                                }
                            }
                            return false;
                        })(arr)
                    }
                    for(var i=0;i<arr.length;i++)
                    {
                        if(arr[i]._id==data.id)
                        {
                            index=i;
                            break;
                        }
                    }
                    arr.splice(index,1);
                    context.state.doc.useSize=dt.data;
                    if(bSel)
                    {
                        context.state.selItem=null;
                        context.state.selDoc=null;
                    }
                }
                return dt;
            })
        },
        move:function (context,data) {
            var pro;
            if(data.obj.folder)
            {
                var query={
                    group:data.obj.id,
                    index:data.index
                }
                if(data.group)
                {
                    query.to=data.group._id
                }
                pro=net.put("/doc/movegroup",query)
            }
            else
            {
                var query={
                    id:data.obj.id,
                    to:data.group._id,
                    index:data.index
                }
                pro=net.put("/doc/movedoc",query)
            }
            return pro.then(function (dt) {
                if(dt.code==200)
                {
                    var arrFrom,arrTo;
                    if(data.obj.group)
                    {
                        if(data.obj.folder)
                        {
                            (function (arr) {
                                for(var i=0;i<arr.length;i++)
                                {
                                    if(arr[i]._id==data.obj.group)
                                    {
                                        arrFrom=arr[i].childGroup;
                                        return true;
                                    }
                                    else
                                    {
                                        var ret=arguments.callee(arr[i].childGroup);
                                        if(ret)
                                        {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            })(context.state.list)
                        }
                        else
                        {
                            (function (arr) {
                                for(var i=0;i<arr.length;i++)
                                {
                                    var obj=arr[i];
                                    for(var j=0;j<obj.childDoc.length;j++)
                                    {
                                        var obj1=obj.childDoc[j];
                                        if(obj1._id==data.obj.id)
                                        {
                                            arrFrom=obj.childDoc;
                                            return true;
                                        }
                                    }
                                    var ret=arguments.callee(arr[i].childGroup);
                                    if(ret)
                                    {
                                        return true;
                                    }
                                }
                                return false;
                            })(context.state.list)
                        }
                    }
                    else
                    {
                        arrFrom=context.state.list;
                    }
                    if(data.group)
                    {
                        if(data.obj.folder)
                        {
                            arrTo=data.group.childGroup;
                        }
                        else
                        {
                            arrTo=data.group.childDoc;
                        }
                    }
                    else
                    {
                        arrTo=context.state.list;
                    }
                    var indexFrom=data.obj.index;
                    var indexTo=data.index;
                    if(arrFrom==arrTo)
                    {
                        var obj1=arrFrom[indexFrom];
                        arrFrom.splice(indexFrom,1);
                        arrFrom.splice(indexTo,0,obj1);
                    }
                    else
                    {
                        var obj1=arrFrom[indexFrom];
                        if(obj1.childDoc)
                        {
                            obj1.parent=data.group?data.group._id:"";
                        }
                        else
                        {
                            obj1.group=data.group._id
                        }
                        arrFrom.splice(indexFrom,1);
                        arrTo.splice(indexTo,0,obj1)
                    }
                }
                return dt;
            })
        },
        addDoc:function (context,data) {
            var query={
                name:data.name,
                group:data.group._id,
                project:session.get("projectId")
            }
            return net.post("/doc/doc",query).then(function (dt) {
                if(dt.code==200)
                {
                    var obj=dt.data;
                    obj.menu=0;
                    obj.select=0;
                    data.group.show=1;
                    data.group.childDoc.push(obj);
                }
                return dt;
            })
        },
        removeDoc:function (context,data) {
            return net.delete("/doc/doc",{
                id:data.id
            }).then(function (dt) {
                if(dt.code==200)
                {
                    data.group.childDoc.splice(data.index,1);
                    context.state.doc.useSize=dt.data;
                    if(context.state.selItem && context.state.selItem._id==data.id)
                    {
                        context.state.selItem=null;
                        context.state.selDoc=null;
                    }
                }
                return dt;
            })
        },
        renameDoc:function (context,data) {
            var query={
                id:data.item._id,
                name:data.name,
                group:data.group,
                project:session.get("projectId")
            }
            return net.post("/doc/doc",query).then(function (dt) {
                if(dt.code==200)
                {
                    data.item.name=data.name
                }
                return dt;
            })
        },
        info:function (context,data) {
            return net.get("/doc/doc",{
                id:data._id
            }).then(function (dt) {
                if(dt.code==200)
                {
                    if(context.state.selItem)
                    {
                        context.state.selItem.select=0;
                    }
                    context.state.selItem=data;
                    context.state.selItem.select=1;
                    context.state.selDoc=dt.data;
                }
                return dt;
            })
        }
    }
}










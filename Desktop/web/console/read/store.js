module.exports=new Vuex.Store({
    state:{
        doc:{
            owner:{

            }
        },
        list:[],
        selDoc:null,
        selItem:null,
    },
    actions:{
        init:function (context,id) {
            return Promise.all([
                net.get("/doc/project",{
                    project:id
                }),
                net.get("/doc/structure",{
                    project:id
                })
            ]).then(function (values) {
                var data1=values[0];
                var data2=values[1];
                if(data1.code==200)
                {
                    context.state.doc=data1.data;
                }
                else
                {
                    return data1;
                }
                if(data2.code==200)
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
                    })(data2.data);
                    context.state.list=data2.data;
                }
                else
                {
                    return data2;
                }
                return {
                    code:200
                }
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
        },
        search:function (context,obj) {
            context.state.selDoc=null;
            context.state.selItem=null;
            return net.get("/doc/filterstructure",{
                project:context.state.doc._id,
                key:obj.key,
                type:obj.type
            }).then(function (data) {
                if(data.code==200)
                {
                    (function (arr) {
                        for(var i=0;i<arr.length;i++)
                        {
                            var obj=arr[i];
                            obj.menu=0;
                            obj.show=1;
                            arguments.callee(obj.childGroup);
                            for(var j=0;j<obj.childDoc.length;j++)
                            {
                                var obj1=obj.childDoc[j];
                                obj1.menu=0;
                                obj1.select=0;
                            }
                        }
                    })(data.data);
                    context.state.list=data.data;
                }
                return data;
            })
        }
    }
})
module.exports= {
    namespaced: true,
    state:function () {
        return {
            selTest:{
                user:session.get("id"),
                name:"",
                remark:"",
                ui:[],
                code:"",
                output:"",
                status:0,
                group:"",
                module:"",
                project:"",
            },
            baseUrl:"",
            env:[],
            interfaceList:[],
            groupModel:[],
            rootInfo:$.getProjectStore("info/")
        }
    },
    getters:{
        event:function (state,getters,rootState,rootGetters) {
            return window.store.state.event;
        },
        baseUrls: function (state, getters, rootState) {
            return state.rootInfo.state.project.baseUrls;
        },
    },
    mutations:{
        init:function (state) {
            state.selTest={
                user:session.get("id"),
                name:"",
                remark:"",
                ui:[],
                code:"",
                output:"",
                status:0,
                group:"",
                module:"",
                project:""
            };
            state.baseUrl="";
            state.env=[];
            state.interfaceList=[];
            state.groupModel=[];
        },
        setInterfaceList:function (state,data) {
            state.interfaceList=data;
        }
    },
    actions:{
        showInterface:function (context,data) {
            return window.store.dispatch("project/test/showInterface",data,{
                root:true
            })
        },
        changeExample:function (context,data) {
            return window.store.dispatch("test/changeExample",data,{
                root:true
            })
        },
        save:function (context) {
            if(!context.state.selTest.name)
            {
                return {
                    code:0,
                    msg:"名称不能为空"
                }
            }
            if(context.state.groupModel.length==0 && !context.state.selTest.group)
            {
                return {
                    code:0,
                    msg:"请选择业务分组"
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
                name:context.state.selTest.name,
                group:context.state.selTest.group?context.state.selTest.group:context.state.groupModel[context.state.groupModel.length-1],
                remark:context.state.selTest.remark===undefined?"":context.state.selTest.remark,
                status:context.state.selTest.status,
                code:code,
                ui:JSON.stringify(context.state.selTest.ui),
                output:context.state.selTest.output===undefined?"":context.state.selTest.output,
                user:context.state.selTest.user
            }
            if(context.state.selTest._id)
            {
                obj.id=context.state.selTest._id
            }
            return net.post("/test/test",obj).then(function (data) {
                return data;
            })
        },
        testInfo:function (context,id) {
            return net.get("/test/test",{
                id:id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.selTest=data.data;
                }
                return data
            })
        }
    }
}
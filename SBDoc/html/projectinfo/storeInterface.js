/**
 * Created by sunxin on 2017/2/23.
 */
module.exports=new Vuex.Store({
    state:{
        interfaceList:[],
        interfaceSearchList:[],
        interface:null,
        interfaceEdit:null,
        baseUrls:[],
        query:[{
            name:"",
            must:0,
            remark:""
        }],
        header:[{
            name:"",
            value:"",
            remark:""
        }],
        body:[{
            name:"",
            type:0,
            must:0,
            remark:"",
        }],
        param:[

        ],
        bodyInfo:{
            type:0,
            rawType:0,
            rawTextRemark:"",
            rawFileRemark:"",
            rawText:"",
            rawJSON:[{
                name:"",
                must:1,
                type:0,
                remark:"",
                show:1,
                mock:"",
                drag:1
            }]
        },
        outInfo:{
            type:0,
            rawRemark:"",
            rawMock:"",
            jsonType:0
        },
        result:[],
        resultObject:[
            {
                name:"",
                must:0,
                type:0,
                remark:"",
                show:0,
                mock:"",
                drag:1
            }
        ],
        resultArray:[
            {
                name:null,
                must:0,
                type:0,
                remark:"",
                show:0,
                mock:"",
                drag:1
            }
        ],
        preview:"",
        drawMix:[],
        objCopy:null,
        search:false,
        searchText:"",
        searchType:0,
        status:[],
        globalBefore:"",
        globalAfter:""
    },
    getters:{
        querySave:function (state,getters) {
            return state.query.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            })
        },
        headerSave:function (state,getters) {
            return state.header.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            });
        },
        bodySave:function (state,getters) {
            return state.body.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            })
        },
        queryCount:function (state,getters) {
            return getters.querySave.length
        },
        headerCount:function (state,getters) {
            return getters.headerSave.length
        },
        bodyCount:function (state,getters) {
            return getters.bodySave.length
        },
        paramCount:function (state,getters) {
            return state.param.length;
        },
        rawMock:function (state) {
            var bJSON=false,obj={};
            if(state.bodyInfo.type==1 && state.bodyInfo.rawType==2 && state.bodyInfo.rawJSON)
            {
                bJSON=true;
                var result=helper.resultSave(state.bodyInfo.rawJSON);
                helper.convertToJSON(result,obj);
            }
            var info=helper.handleMockInfo(0,state.param,state.query,state.header,bJSON?obj:state.body,state);
            return helper.mock(state.outInfo.rawMock,info);
        },
        rawJSON:function (state) {
            var obj={};
            var result=helper.resultSave(state.bodyInfo.rawJSON);
            helper.convertToJSON(result,obj);
            return helper.format(JSON.stringify(obj),1,result,state.status).draw;
        }
    },
    mutations:{
        initInterfaceList:function (state,data) {
            var arr=[]
            for(var i=0;i<data.length;i++)
            {
                data[i].show=0;
                for(var j=0;j<data[i].data.length;j++)
                {
                    data[i].data[j].select=0;
                }
                arr.push(data[i]);
            }
            state.interfaceList=arr;
        },
        setBaseUrls:function (state,data) {
            state.baseUrls=data;
        },
        addBaseUrls:function (state,data) {
            state.baseUrls.push(data);
        },
        setSearch:function (state,data) {
            state.search=data;
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
        setPreview:function (state,data) {
            state.preview=data;
        },
        setDrawMix:function (state,data) {
            state.drawMix=data;
        },
        setInterface:function (state,data) {
            state.interface=data;
        },
        setInterfaceEdit:function (state,data) {
            state.interfaceEdit=data;
        },
        setInterfaceList:function (state,data) {
            state.interfaceList=data;
        },
        setObjCopy:function (state,data) {
            state.objCopy=data;
        },
        setGlobalBefore:function (state,val) {
            state.globalBefore=val;
        },
        setGlobalAfter:function (state,val) {
            state.globalAfter=val;
        },
        initParam:function (state,data) {
            state.query.splice(0,state.query.length);
            state.header.splice(0,state.header.length);
            state.body.splice(0,state.body.length);
            state.resultObject.splice(0,state.resultObject.length);
            state.resultArray.splice(0,state.resultArray.length);
            state.param.splice(0,state.param.length);
            state.query.push({
                name:"",
                must:0,
                remark:""
            });
            state.header.push({
                name:"",
                value:"",
                remark:""
            });
            state.body.push({
                name:"",
                type:0,
                must:0,
                remark:"",
            });
            state.resultObject.push({
                name:"",
                must:1,
                type:0,
                remark:"",
                show:1,
                drag:1,
                mock:""
            })
            state.resultArray.push({
                name:null,
                must:1,
                type:0,
                remark:"",
                show:1,
                drag:1,
                mock:""
            })
            state.bodyInfo={
                type:0,
                rawType:0,
                rawTextRemark:"",
                rawFileRemark:"",
                rawText:"",
                rawJSON:[{
                    name:"",
                    must:1,
                    type:0,
                    remark:"",
                    show:1,
                    mock:"",
                    drag:1
                }]
            };
            state.outInfo={
                type:0,
                rawRemark:"",
                rawMock:"",
                jsonType:0
            }
            state.result=state.resultObject
        },
        initInterface:function (state,data) {
            if(state.interfaceEdit.queryParam.length>0)
            {
                state.query=state.interfaceEdit.queryParam;
                state.query.forEach(function (item) {
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
                })
            }
            else
            {
                state.interfaceEdit.queryParam=state.query;
            }
            if(state.interfaceEdit.bodyParam.length>0)
            {
                state.body=state.interfaceEdit.bodyParam;
                state.body.forEach(function (item) {
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
                })
            }
            else
            {
                state.interfaceEdit.bodyParam=state.body;
            }
            if(state.interfaceEdit.header.length>0)
            {
                state.header=state.interfaceEdit.header;
            }
            else
            {
                state.interfaceEdit.header=state.header;
            }
            if(state.interfaceEdit.outParam.length>0)
            {
                helper.initResultShow(state.interfaceEdit.outParam);
                state.result=state.interfaceEdit.outParam;
            }
            else
            {
                state.interfaceEdit.outParam=state.result;
            }
            if(state.interfaceEdit.restParam.length>0)
            {
                state.param=state.interfaceEdit.restParam;
                state.param.forEach(function (item) {
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
                })
            }
            else
            {
                state.interfaceEdit.restParam=state.param;
            }
            if(state.interfaceEdit.bodyInfo)
            {
                state.bodyInfo=state.interfaceEdit.bodyInfo;
                if(state.bodyInfo.rawText===undefined)
                {
                    Vue.set(state.bodyInfo,"rawText","");
                }
                if(state.bodyInfo.rawTextRemark===undefined)
                {
                    Vue.set(state.bodyInfo,"rawTextRemark","");
                }
                if(state.bodyInfo.rawFileRemark===undefined)
                {
                    Vue.set(state.bodyInfo,"rawFileRemark","");
                }
                if(state.bodyInfo.rawJSON==undefined)
                {
                    Vue.set(state.bodyInfo,"rawJSON",[{
                        name:"",
                        must:1,
                        type:0,
                        remark:"",
                        show:1,
                        mock:"",
                        drag:1
                    }]);
                }
                else
                {
                    helper.initResultShow(state.bodyInfo.rawJSON);
                }
                var bFind=false;
                for(var i=0;i<state.header.length;i++)
                {
                    var obj=state.header[i];
                    if(obj.name.toLowerCase()=="content-type" && obj.value.toLowerCase()=="application/json")
                    {
                        bFind=true;
                        break;
                    }
                }
                if(bFind && state.bodyInfo.rawText)
                {
                    var obj;
                    try
                    {
                        obj=JSON.parse(state.bodyInfo.rawText);
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
                        state.bodyInfo.rawJSON=result;
                        state.bodyInfo.rawText="";
                        state.bodyInfo.rawType=2;
                    }
                }
            }
            else
            {
                state.interfaceEdit.bodyInfo=state.bodyInfo;
            }
            if(state.interfaceEdit.outInfo)
            {
                state.outInfo=state.interfaceEdit.outInfo;
                if(state.outInfo.jsonType===undefined)
                {
                    Vue.set(state.outInfo,"jsonType",0);
                }
                else if(state.outInfo.jsonType==0)
                {
                    state.resultObject=state.result;
                }
                else
                {
                    state.resultArray=state.result;
                }
            }
            else
            {
                state.interfaceEdit.outInfo=state.outInfo;
            }
            if(!state.interfaceEdit.before)
            {
                Vue.set(state.interfaceEdit,"before",{
                    mode:0,
                    code:""
                })
            }
            else
            {
                if(typeof(state.interfaceEdit.before)=="string")
                {
                    state.interfaceEdit.before={
                        mode:0,
                        code:state.interfaceEdit.before
                    }
                }
            }
            if(!state.interfaceEdit.after)
            {
                Vue.set(state.interfaceEdit,"after",{
                    mode:0,
                    code:""
                })
            }
            else
            {
                if(typeof(state.interfaceEdit.after)=="string")
                {
                    state.interfaceEdit.after={
                        mode:0,
                        code:state.interfaceEdit.after
                    }
                }
            }
        },
        changeMethod:function (state) {
            if(state.interfaceEdit.method=="POST" || state.interfaceEdit.method=="PUT" || state.interfaceEdit.method=="PATCH")
            {
                if(state.header.length==1 && !state.header[0].name)
                {
                    state.header[0].name="Content-Type";
                    state.header[0].value="application/x-www-form-urlencoded"
                }
                else
                {
                    var bFind=false;
                    for(var i=0;i<state.header.length;i++)
                    {
                        var obj=state.header[i];
                        if(obj.name=="Content-Type")
                        {
                            bFind=true;
                            break;
                        }
                    }
                    if(!bFind)
                    {
                        state.header.push({
                            name:"Content-Type",
                            value:"application/x-www-form-urlencoded",
                            remark:""
                        })
                    }
                }
            }
            else
            {
                for(var i=0;i<state.header.length;i++)
                {
                    var obj=state.header[i];
                    if(obj.name=="Content-Type")
                    {
                        if(state.header.length>1)
                        {
                            state.header.splice(i,1);
                        }
                        else
                        {
                            state.header[0].name="";
                            state.header[0].value="";
                            state.header[0].remark="";
                        }
                        break;
                    }
                }
            }
        },
        changeUrl:function (state,val) {
            if(val)
            {
                var arrParam=[];
                var arr=val.match(/\{([^\s]+?)\}/g);
                if(arr)
                {
                    for(var i=0;i<arr.length;i++)
                    {
                        var str=arr[i].substr(1,arr[i].length-2);
                        var bFind=false;
                        for(var j=0;j<state.param.length;j++)
                        {
                            if(str==state.param[j].name)
                            {
                                bFind=true;
                                arrParam.push(state.param[j]);
                                break;
                            }
                        }
                        if(!bFind)
                        {
                            arrParam.push({
                                name:str,
                                remark:"",
                                value:{
                                    type:0,
                                    status:"",
                                    data:[]
                                }
                            })
                        }
                    }
                }
                state.param=arrParam;
                state.interfaceEdit.restParam=state.param;
            }
        },
        changePreview:function (state,val) {
            if(val==1)
            {
                var obj=state.outInfo.jsonType==1?[]:{};
                var result=helper.resultSave(state.result);
                var bJSON=false,objJSON={};
                if(state.bodyInfo.type==1 && state.bodyInfo.rawType==2 && state.bodyInfo.rawJSON)
                {
                    bJSON=true;
                    var result1=helper.resultSave(state.bodyInfo.rawJSON);
                    helper.convertToJSON(result1,objJSON);
                }
                var info=helper.handleMockInfo(0,state.param,state.query,state.header,bJSON?objJSON:state.body,state);
                helper.convertToJSON(result,obj,info);
                state.drawMix=helper.format(JSON.stringify(obj),1,result,state.status).draw;
            }
        },
        searchInterface:function (state) {
            if(!state.search)
            {
                return;
            }
            state.interfaceSearchList=[];
            state.interfaceList.forEach(function (obj) {
                var objCopy=$.clone(obj);
                objCopy.data=obj.data.filter(function (o) {
                    var str;
                    if(state.searchType==0)
                    {
                        str=o.name;
                    }
                    else
                    {
                        str=o.url;
                    }
                    if(str.toLowerCase().indexOf(state.searchText.toLowerCase())>-1)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                })
                if(objCopy.data.length>0)
                {
                    state.interfaceSearchList.push(objCopy);
                }
            })
        },
        toggleResultType:function (state) {
            if(state.outInfo.jsonType==1)
            {
                state.result=state.resultArray
            }
            else
            {
                state.result=state.resultObject
            }
        }
    },
    actions:{
        add:function (context,data) {
            if(context.state.interface && (data.id || (data.item && !data.item._id)))
            {
                context.state.interface.select=0;
                context.commit("setInterface",null);
            }
            context.commit("initParam");
            if(data.item)
            {
                context.commit("setInterfaceEdit",data.item);
            }
            else
            {
                context.commit("setInterfaceEdit",{
                    "name": "",
                    "group": {
                        "_id": data.id,
                    },
                    "url": "",
                    "remark": "",
                    "method": "GET",
                    "finish":0,
                    "outParam": [{
                        name:"",
                        must:0,
                        type:0,
                        remark:"",
                        show:0,
                        mock:"",
                        drag:1
                    }],
                    "bodyParam": [{
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                    }],
                    "queryParam": [{
                        name:"",
                        must:0,
                        remark:""
                    }],
                    "header": [{
                        name:"",
                        value:"",
                        remark:""
                    }],
                    "bodyInfo":{
                        type:0,
                        rawType:0,
                        rawTextRemark:"",
                        rawFileRemark:"",
                        rawText:"",
                        rawJSON:[{
                            name:"",
                            must:1,
                            type:0,
                            remark:"",
                            show:1,
                            mock:"",
                            drag:1
                        }]

                    },
                    outInfo:{
                        type:0,
                        rawRemark:"",
                        rawMock:"",
                        jsonType:0
                    },
                    restParam:[],
                    before:"",
                    after:""
                });
            }
            context.commit("initInterface");
        },
        getAllInterface:function (context,data) {
            context.commit("initInterfaceList",data);
        },
        refreshData:function (context,data) {
            context.commit("setInterfaceList",helper.refreshInterface(context.state.interfaceList,data));
            if(context.state.interface)
            {
                context.state.interface.select=0;
            }
            context.commit("setInterface",null);
            context.commit("setInterfaceEdit",null);
            context.commit("searchInterface");
        },
        info:function (context,obj) {
            context.dispatch("showInfo",{
                data:obj.item,
                data1:obj.item1
            });
        },
        showInfo:function (context,data) {
            if(context.state.interface)
            {
                context.state.interface.select=0;
            }
            context.commit("setInterface",data.data1);
            context.state.interface.select=1;
            context.commit("setInterfaceEdit",$.clone(data.data1));
            context.commit("initParam");
            if(context.state.interface)
            {
                context.commit("initInterface");
            }
            else
            {
                context.commit("setInterfaceEdit",null);
            }
            context.commit("setPreview",0);
        },
    }
})
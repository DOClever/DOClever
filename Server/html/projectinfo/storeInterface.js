/**
 * Created by sunxin on 2017/2/23.
 */
var uuid=require("uuid");
module.exports=new Vuex.Store({
    state:{
        interfaceList:[],
        interfaceSearchList:[],
        interface:null,
        interfaceEdit:null,
        baseUrls:[],
        param:[
            {
                name:"",
                remark:"",
                id:"",
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
                    rawJSON:[],
                    rawJSONType:0
                },
                rawJSONObject:[{
                    name:"",
                    must:1,
                    type:0,
                    remark:"",
                    show:1,
                    mock:"",
                    drag:1
                }],
                rawJSONArray:[{
                    name:null,
                    must:1,
                    type:0,
                    remark:"",
                    show:1,
                    mock:"",
                    drag:1
                }],
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
                before:{
                    mode:0,
                    code:""
                },
                after:{
                    mode:0,
                    code:""
                }
            }
        ],
        index:0,
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
        bodyInfo:function (state,getters) {
            return state.param[state.index].bodyInfo;
        },
        outInfo:function (state,getters) {
            return state.param[state.index].outInfo;
        },
        querySave:function (state,getters) {
            return state.param[state.index].query.filter(function (obj) {
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
            return state.param[state.index].header.filter(function (obj) {
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
            return state.param[state.index].body.filter(function (obj) {
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
            return state.param[state.index].param.length;
        },
        curParam:function (state,getters) {
            return state.param[state.index];
        },
        rawMock:function (state,getters) {
            var bJSON=false,obj={};
            if(getters.curParam.bodyInfo.type==1 && getters.curParam.bodyInfo.rawType==2 && getters.curParam.bodyInfo.rawJSON)
            {
                obj=getters.curParam.bodyInfo.rawJSONType==0?{}:[];
                bJSON=true;
                var result=helper.resultSave(getters.curParam.bodyInfo.rawJSON);
                helper.convertToJSON(result,obj);
            }
            var info=helper.handleMockInfo(0,getters.curParam.param,getters.curParam.query,getters.curParam.header,bJSON?obj:getters.curParam.body,state);
            return helper.mock(getters.curParam.outInfo.rawMock,info);
        },
        rawJSON:function (state,getters) {
            var obj=getters.curParam.bodyInfo.rawJSONType==0?{}:[];
            var result=helper.resultSave(getters.curParam.bodyInfo.rawJSON);
            helper.convertToJSON(result,obj);
            return helper.format(JSON.stringify(obj),1,result,getters.curParam.status).draw;
        },
    },
    mutations:{
        setIndex:function (state,data) {
            state.index=data;
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
            state.param=[
                {
                    name:"参数",
                    remark:"",
                    id:uuid(),
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
                        rawJSON:[],
                        rawJSONType:0
                    },
                    rawJSONObject:[{
                        name:"",
                        must:1,
                        type:0,
                        remark:"",
                        show:1,
                        mock:"",
                        drag:1
                    }],
                    rawJSONArray:[{
                        name:null,
                        must:1,
                        type:0,
                        remark:"",
                        show:1,
                        mock:"",
                        drag:1
                    }],
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
                }
            ];
            state.param[0].result=state.param[0].resultObject;
            state.param[0].bodyInfo.rawJSON=state.param[0].rawJSONObject;
            state.index=0;
        },
        initInterface:function (state,data) {
            for(var i=1;i<state.interfaceEdit.param.length;i++)
            {
                state.param.push($.clone(state.param[0]));
            }
            state.interfaceEdit.param.forEach(function (objInter,index) {
                state.param[index].name=objInter.name;
                state.param[index].id=objInter.id;
                state.param[index].remark=objInter.remark;
                if(objInter.queryParam.length>0)
                {
                    state.param[index].query=objInter.queryParam;
                    state.param[index].query.forEach(function (item) {
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
                    state.param[index].query.push({
                        name:"",
                        must:0,
                        remark:""
                    });
                }
                else
                {
                    objInter.queryParam=state.param[index].query;
                }
                if(objInter.bodyParam && objInter.bodyParam.length>0)
                {
                    state.param[index].body=objInter.bodyParam;
                    state.param[index].body.forEach(function (item) {
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
                    state.param[index].body.push({
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                    });
                }
                else
                {
                    objInter.bodyParam=state.param[index].body;
                }
                if(objInter.header.length>0)
                {
                    state.param[index].header=objInter.header;
                    state.param[index].header.push({
                        name:"",
                        value:"",
                        remark:""
                    });
                }
                else
                {
                    objInter.header=state.param[index].header;
                }
                if(objInter.outParam.length>0)
                {
                    helper.initResultShow(objInter.outParam);
                    state.param[index].result=objInter.outParam;
                }
                else
                {
                    objInter.outParam=state.param[index].result;
                }
                if(objInter.restParam.length>0)
                {
                    state.param[index].param=objInter.restParam;
                    state.param[index].param.forEach(function (item) {
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
                    objInter.restParam=state.param[index].param;
                }
                if(objInter.bodyInfo)
                {
                    state.param[index].bodyInfo=objInter.bodyInfo;
                    if(state.param[index].bodyInfo.rawText===undefined)
                    {
                        Vue.set(state.param[index].bodyInfo,"rawText","");
                    }
                    if(state.param[index].bodyInfo.rawTextRemark===undefined)
                    {
                        Vue.set(state.param[index].bodyInfo,"rawTextRemark","");
                    }
                    if(state.param[index].bodyInfo.rawFileRemark===undefined)
                    {
                        Vue.set(state.param[index].bodyInfo,"rawFileRemark","");
                    }
                    if(state.param[index].bodyInfo.rawJSONType===undefined)
                    {
                        Vue.set(state.param[index].bodyInfo,"rawJSONType",0);
                    }
                    if(state.param[index].bodyInfo.rawJSON==undefined)
                    {
                        Vue.set(state.param[index].bodyInfo,"rawJSON",state.param[index].rawJSONObject);
                    }
                    else
                    {
                        helper.initResultShow(state.param[index].bodyInfo.rawJSON);
                        if(state.param[index].bodyInfo.rawJSONType==0)
                        {
                            state.param[index].rawJSONObject=state.param[index].bodyInfo.rawJSON;
                        }
                        else
                        {
                            state.param[index].rawJSONArray=state.param[index].bodyInfo.rawJSON;
                        }
                    }
                    var bFind=false;
                    for(var i=0;i<state.param[index].header.length;i++)
                    {
                        var obj=state.param[index].header[i];
                        if(obj.name.toLowerCase()=="content-type" && obj.value.toLowerCase()=="application/json")
                        {
                            bFind=true;
                            break;
                        }
                    }
                    if(bFind && state.param[index].bodyInfo.rawText)
                    {
                        var obj;
                        try
                        {
                            obj=JSON.parse(state.param[index].bodyInfo.rawText);
                        }
                        catch (e)
                        {

                        }
                        if(obj)
                        {
                            var result=[];
                            for(var key in obj)
                            {
                                helper.handleResultData(key,obj[key],result,null,1,null,1)
                            }
                            state.param[index].bodyInfo.rawJSON=result;
                            state.param[index].bodyInfo.rawJSONType=(obj instanceof Array)?1:0;
                            state.param[index].bodyInfo.rawText="";
                            state.param[index].bodyInfo.rawType=2;
                        }
                    }
                }
                else
                {
                    objInter.bodyInfo=state.param[index].bodyInfo;
                }
                if(objInter.outInfo)
                {
                    state.param[index].outInfo=objInter.outInfo;
                    if(state.param[index].outInfo.jsonType===undefined)
                    {
                        Vue.set(state.param[index].outInfo,"jsonType",0);
                    }
                    else if(state.param[index].outInfo.jsonType==0)
                    {
                        state.param[index].resultObject=state.param[index].result;
                    }
                    else
                    {
                        state.param[index].resultArray=state.param[index].result;
                    }
                }
                else
                {
                    objInter.outInfo=state.param[index].outInfo;
                }
                if(!objInter.before)
                {
                    Vue.set(objInter,"before",{
                        mode:0,
                        code:""
                    })
                }
                else
                {
                    if(typeof(objInter.before)=="string")
                    {
                        objInter.before={
                            mode:0,
                            code:objInter.before
                        }
                    }
                }
                state.param[index].before=objInter.before;
                if(!objInter.after)
                {
                    Vue.set(objInter,"after",{
                        mode:0,
                        code:""
                    })
                }
                else
                {
                    if(typeof(objInter.after)=="string")
                    {
                        objInter.after={
                            mode:0,
                            code:objInter.after
                        }
                    }
                }
                state.param[index].after=objInter.after;
            })
        },
        changeMethod:function (state) {
            if(state.interfaceEdit.method=="POST" || state.interfaceEdit.method=="PUT" || state.interfaceEdit.method=="PATCH")
            {
                state.param.forEach(function (obj,index) {
                    if(obj.header.length==1 && !obj.header[0].name)
                    {
                        obj.header[0].name="Content-Type";
                        obj.value="application/x-www-form-urlencoded"
                    }
                    else
                    {
                        var bFind=false;
                        for(var i=0;i<obj.header.length;i++)
                        {
                            var obj=obj.header[i];
                            if(obj.name=="Content-Type")
                            {
                                bFind=true;
                                break;
                            }
                        }
                        if(!bFind)
                        {
                            obj.header.push({
                                name:"Content-Type",
                                value:"application/x-www-form-urlencoded",
                                remark:""
                            })
                        }
                    }
                    if(!obj.bodyInfo)
                    {
                        obj.bodyInfo={
                            type:0,
                            rawType:0,
                            rawTextRemark:"",
                            rawFileRemark:"",
                            rawText:"",
                            rawJSON:[],
                            rawJSONType:0
                        }
                    }
                })
            }
            else
            {
                state.param.forEach(function (obj,index) {
                    for(var i=0;i<obj.header.length;i++)
                    {
                        var obj1=obj.header[i];
                        if(obj1.name=="Content-Type")
                        {
                            if(obj.header.length>1)
                            {
                                obj.header.splice(i,1);
                            }
                            else
                            {
                                obj.header[0].name="";
                                obj.header[0].value="";
                                obj.header[0].remark="";
                            }
                            break;
                        }
                    }
                })
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
                        for(var j=0;j<state.param[state.index].param.length;j++)
                        {
                            if(str==state.param[state.index].param[j].name)
                            {
                                bFind=true;
                                arrParam.push(state.param[state.index].param[j]);
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
                state.param.forEach(function (obj,index) {
                    obj.param=arrParam;
                    state.interfaceEdit.param[index].restParam=obj.param;
                })
            }
        },
        changePreview:function (state,val) {
            if(val==1)
            {
                var obj=state.param[state.index].outInfo.jsonType==1?[]:{};
                var result=helper.resultSave(state.param[state.index].result);
                var bJSON=false,objJSON={};
                if(state.param[state.index].bodyInfo.type==1 && state.param[state.index].bodyInfo.rawType==2 && state.param[state.index].bodyInfo.rawJSON)
                {
                    objJSON=state.param[state.index].bodyInfo.rawJSONType==0?{}:[];
                    bJSON=true;
                    var result1=helper.resultSave(state.param[state.index].bodyInfo.rawJSON);
                    helper.convertToJSON(result1,objJSON);
                }
                var info=helper.handleMockInfo(0,state.param[state.index].param,state.param[state.index].query,state.param[state.index].header,bJSON?objJSON:state.param[state.index].body,state);
                helper.convertToJSON(result,obj,info);
                state.drawMix=helper.format(JSON.stringify(obj),1,result,state.status).draw;
            }
        },
        searchInterface:function (state) {
            if(!state.search)
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
                            str=obj.name;
                        }
                        else
                        {
                            str=obj.url;
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
        toggleResultType:function (state) {
            if(state.param[state.index].outInfo.jsonType==1)
            {
                state.param[state.index].result=state.param[state.index].resultArray
            }
            else
            {
                state.param[state.index].result=state.param[state.index].resultObject
            }
        }
    },
    actions:{
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
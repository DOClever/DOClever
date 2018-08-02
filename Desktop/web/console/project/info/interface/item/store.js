var run=require("../run/store");
var uuid=require("uuid")
var config=require("common/js/config")
module.exports={
    namespaced:true,
    modules:{
        run:run,
    },
    state:function () {
        return {
            tabItem:null,
            baseUrl:"",
            type:"edit",
            newInterfaceStr:"",
            parent:$.getProjectStore("info/interface/"),
            rootInfo:$.getProjectStore("info/"),
            interfaceEdit:null,
            interface:null,
            param:[
                {
                    name:"",
                    remark:"",
                    id:"",
                    query:[{
                        name:"",
                        must:0,
                        remark:"",
                        enable:1,
                        selValue:""
                    }],
                    header:[{
                        name:"",
                        value:"",
                        remark:"",
                        enable:1,
                    }],
                    body:[{
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                        enable:1,
                        selValue:""
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
            status:[],
            type:"",
            example:{}
        }
    },
    getters:{
        template:function (state,getters,rootState) {
            return state.parent.getters.template;
        },
        autoSave:function (state,getters,rootState) {
            return state.parent.state.autoSave;
        },
        interfaceList:function (state) {
            return state.parent.state.interfaceList;
        },
        baseUrls:function (state) {
            return state.parent.getters.baseUrls;
        },
        bodyInfo:function (state,getters) {
            return state.param[state.index].bodyInfo;
        },
        outInfo:function (state,getters) {
            return state.param[state.index].outInfo;
        },
        event:function (state,getters,rootState) {
            return state.parent.getters.event;
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
        param:function (state,getters) {
            return state.param[state.index].param;
        },
        curParam:function (state,getters) {
            return state.param[state.index];
        },
        lastBaseUrl:function (state,getters,rootState) {
            return state.rootInfo.state.lastBaseUrl;
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
        interfaceEditRole:function (state,getters,rootState,rootGetters) {
            return state.parent.getters.interfaceEditRole;
        },
    },
    mutations:{
        setInterface:function (state,data) {
            state.interface=data;
        },
        setTabItem:function (state,data) {
              state.tabItem=data;
        },
        setBaseUrl:function (state,val) {
            state.baseUrl=val;
        },
        init:function (state) {
            state.interfaceEdit=null;
            state.type="list";
            state.example={};
            state.newInterfaceStr="";
        },
        setNewInterfaceStr:function (state,data) {
            state.newInterfaceStr=data;
        },
        setIndex:function (state,data) {
            state.index=data;
        },
        addParam:function (state,data) {
            var obj;
            let objRun={
                fileResult:"",
                resHeader:[],
                reqHeader:{},
                status:"",
                second:"",
                draw:[],
                drawMix:[],
                type:"object",
                imgUrl:"",
                resultData:"",
                rawData:"",
                encryptType:"",
                errorCount:0,
                run:0
            };
            if(data)
            {
                obj=$.clone(state.param[state.index]);
                obj.name=obj.name+"(副本)";
                obj.id=uuid();
            }
            else
            {
                obj={
                    name:"参数",
                    remark:"",
                    id:uuid(),
                    query:[{
                        name:"",
                        must:0,
                        remark:"",
                        enable:1,
                        selValue:""
                    }],
                    header:[{
                        name:"",
                        value:"",
                        remark:"",
                        enable:1,
                    }],
                    body:[{
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                        enable:1,
                        selValue:""
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
                    },
                };
                obj.bodyInfo.rawJSON=obj.rawJSONObject;
                obj.result=obj.resultObject;
            }
            Object.assign(obj,objRun);
            obj.unSave=1;
            state.param.push(obj);
            state.index=state.param.length-1;
            Vue.set(obj,"selParam",$.clone(obj));
            Vue.set(obj,"selExample",{
                id:"",
                value:"无运行实例"
            });
            Vue.set(obj,"initParam",$.clone(obj));
        },
        removeParam:function (state,data) {
            state.param.splice(data,1);
            state.index=0;
        },
        setDrawMix:function (state,data) {
            state.drawMix=data;
        },
        setInterfaceEdit:function (state,data) {
            state.interfaceEdit=data;
        },
        initParam:function (state,data) {
            state.example={};
            state.param=[
                {
                    name:"参数",
                    remark:"",
                    id:uuid(),
                    query:[{
                        name:"",
                        must:0,
                        remark:"",
                        enable:1,
                        selValue:""
                    }],
                    header:[{
                        name:"",
                        value:"",
                        remark:"",
                        enable:1,
                    }],
                    body:[{
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                        enable:1,
                        selValue:""
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
                if(objInter.queryParam && objInter.queryParam.length>0)
                {
                    state.param[index].query=objInter.queryParam;
                    state.param[index].query.forEach(function (item) {
                        Vue.set(item,"enable",1);
                        if(!item.selValue)
                        {
                            Vue.set(item,"selValue","");
                            if(item.value && item.value.type==0 && item.value.data.length>0)
                            {
                                item.selValue=item.value.data[0].value;
                            }
                            else if(item.value && item.value.type==1 && item.value.status)
                            {
                                var objStatus=null;
                                state.rootInfo.state.status.forEach(function (obj1) {
                                    if(obj1.id==item.value.status)
                                    {
                                        objStatus=obj1;
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
                    state.param[index].query.push({
                        name:"",
                        must:0,
                        remark:"",
                        enable:1,
                        selValue:""
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
                        Vue.set(item,"enable",1);
                        if(!item.selValue)
                        {
                            Vue.set(item,"selValue","");
                            if(item.value && item.value.type==0 && item.value.data.length>0)
                            {
                                item.selValue=item.value.data[0].value;
                            }
                            else if(item.value && item.value.type==1 && item.value.status)
                            {
                                var objStatus=null;
                                state.rootInfo.state.status.forEach(function (obj1) {
                                    if(obj1.id==item.value.status)
                                    {
                                        objStatus=obj1;
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
                    state.param[index].body.push({
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                        enable:1,
                        selValue:""
                    });
                }
                else
                {
                    objInter.bodyParam=state.param[index].body;
                }
                if(objInter.header && objInter.header.length>0)
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
                if(objInter.outParam && objInter.outParam.length>0)
                {
                    helper.initResultShow(objInter.outParam);
                    state.param[index].result=objInter.outParam;
                }
                else
                {
                    objInter.outParam=state.param[index].result;
                }
                if(objInter.restParam && objInter.restParam.length>0)
                {
                    state.param[index].param=objInter.restParam;
                    state.param[index].param.forEach(function (item) {
                        if(!item.selValue)
                        {
                            Vue.set(item,"selValue","");
                            if(item.value && item.value.type==0 && item.value.data.length>0)
                            {
                                item.selValue=item.value.data[0].value;
                            }
                            else if(item.value && item.value.type==1 && item.value.status)
                            {
                                var objStatus=null;
                                state.rootInfo.state.status.forEach(function (obj1) {
                                    if(obj1.id==item.value.status)
                                    {
                                        objStatus=obj1;
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
                        if(obj.name.toLowerCase()=="content-type" && obj.value.toLowerCase().indexOf("application/json")>-1)
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
        moveInterface:function (state,id) {
            if(state.interfaceEdit)
            {
                state.interfaceEdit.group._id=id;
            }
        },
        importResult:function (state,obj) {
            if(obj instanceof Array)
            {
                state.param[state.index].outInfo.jsonType=1;
            }
            else
            {
                state.param[state.index].outInfo.jsonType=0;
            }
            var result=[];
            if(state.param[state.index].outInfo.jsonType==1)
            {
                helper.handleResultData(0,obj[0],result,null,1,1,1)
                state.param[state.index].result=state.param[state.index].resultArray=result;
            }
            else
            {
                for(var key in obj)
                {
                    helper.handleResultData(key,obj[key],result,null,1,1,1)
                }
                state.param[state.index].result=state.param[state.index].resultObject=result;
            }
        },
        importQuery:function (state,val) {
            var str=decodeURI($.trim(val));
            var arr=[];
            var param1=str.split("&");
            for(var i=0;i<param1.length;i++)
            {
                var param2=param1[i].split("=");
                if(param2.length>0)
                {
                    arr.push({
                        name:param2[0],
                        must:1,
                        remark:"",
                        value:param2[1]?{
                            type:0,
                            status:"",
                            data:[{
                                value:decodeURIComponent(param2[1]),
                                remark:""
                            }]
                        }:{
                            type:0,
                            status:"",
                            data:[]
                        },
                    })
                }
            }
            arr.push({
                name:"",
                must:0,
                remark:"",
                selValue:"",
                enable:1
            })
            state.param[state.index].query=arr;
            state.interfaceEdit.param[state.index].queryParam=arr;
        },
        importHeader:function (state,val) {
            var arr=$.trim(val).split("\n");
            var arrHeader=[];
            for(var i=0;i<arr.length;i++)
            {
                var line=$.trim(arr[i]);
                var index=line.indexOf(":");
                var key="",value="";
                if(index==-1)
                {
                    key=line;
                }
                else
                {
                    key=$.trim(line.substr(0,index));
                    value=$.trim(line.substr(index+1));
                }
                if(key)
                {
                    arrHeader.push({
                        name:key,
                        value:value,
                        remark:"",
                    })
                }
            }
            arrHeader.push({
                name:"",
                value:"",
                remark:"",
                enable:1
            })
            state.param[state.index].header=arrHeader;
            state.interfaceEdit.param[state.index].header=arrHeader;
        },
        importBody:function (state,val) {
            var str=decodeURI($.trim(val));
            var arr=[];
            var param1=str.split("&");
            for(var i=0;i<param1.length;i++)
            {
                var param2=param1[i].split("=");
                if(param2.length>0)
                {
                    arr.push({
                        name:decodeURIComponent(param2[0]),
                        type:param2[1]=="[FILE]"?1:0,
                        must:1,
                        remark:"",
                        value:(param2[1]!="[FILE]")?(param2[1]?{
                            type:0,
                            status:"",
                            data:[
                                {
                                    value:decodeURIComponent(param2[1]),
                                    remark:""
                                }
                            ]
                        }:{
                            type:0,
                            status:"",
                            data:[]
                        }):{
                            type:0,
                            status:"",
                            data:[]
                        },
                    })
                }
            }
            arr.push({
                name:"",
                type:0,
                must:0,
                remark:"",
                selValue:"",
                enable:1
            })
            state.param[state.index].body=arr;
            state.interfaceEdit.param[state.index].bodyParam=arr;
        },
        changeMethod:function (state) {
            if(state.interfaceEdit.method=="POST" || state.interfaceEdit.method=="PUT" || state.interfaceEdit.method=="PATCH")
            {
                state.param.forEach(function (obj,index) {
                    if(obj.header.length==1 && !obj.header[0].name)
                    {
                        obj.header[0].name="Content-Type";
                        obj.header[0].value="application/x-www-form-urlencoded"
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
                var arr=val.match(/\{([^\s|\}|\{]+?)\}(?!\})/g);
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
        save:async function (context) {
            var obj={
                name:context.state.interfaceEdit.name,
                url:context.state.interfaceEdit.url,
                group:context.state.interfaceEdit.group._id,
                remark:context.state.interfaceEdit.remark,
                project:session.get("projectId"),
                method:context.state.interfaceEdit.method,
                finish:context.state.interfaceEdit.finish,
                param:[]
            }
            if(session.get("autosave"))
            {
                obj.autosave="1";
            }
            if(context.state.interfaceEdit._id)
            {
                obj.id=context.state.interfaceEdit._id
            }
            var originIndex=context.state.index;
            for(var index=0;index<context.state.param.length;index++)
            {
                context.state.index=index;
                var obj1={
                    before:context.state.param[index].before,
                    after:context.state.param[index].after,
                    name:context.state.param[index].name,
                    id:context.state.param[index].id,
                    remark:context.state.param[index].remark,
                }
                obj1.header=context.getters.headerSave;
                obj1.queryParam=context.getters.querySave;
                if(context.state.interfaceEdit.method=="POST" || context.state.interfaceEdit.method=="PUT" || context.state.interfaceEdit.method=="PATCH")
                {
                    if(context.getters.bodyInfo.type==0)
                    {
                        obj1.bodyParam=context.getters.bodySave;
                    }
                    else
                    {
                        obj1.bodyParam=[];
                    }
                    var bodyInfo=$.clone(context.getters.bodyInfo);
                    if(bodyInfo.type==1)
                    {
                        if(bodyInfo.rawType==0)
                        {
                            bodyInfo.rawFileRemark="";
                            delete bodyInfo.rawJSON;
                            delete bodyInfo.rawJSONType;
                        }
                        else if(bodyInfo.rawType==1)
                        {
                            bodyInfo.rawText="";
                            bodyInfo.rawTextRemark="";
                            delete bodyInfo.rawJSON;
                            delete bodyInfo.rawJSONType;
                        }
                        else
                        {
                            bodyInfo.rawFileRemark="";
                            bodyInfo.rawText="";
                            bodyInfo.rawTextRemark="";
                        }
                    }
                    else
                    {
                        bodyInfo.rawType=0;
                        bodyInfo.rawFileRemark="";
                        bodyInfo.rawText="";
                        bodyInfo.rawTextRemark="";
                        delete bodyInfo.rawJSON;
                        delete bodyInfo.rawJSONType;
                    }
                    obj1.bodyInfo=bodyInfo
                }
                if(context.getters.outInfo.type==0)
                {
                    obj1.outParam=helper.resultSave(context.state.param[context.state.index].result);
                    var outInfo=$.clone(context.getters.outInfo);
                    outInfo.rawRemark="";
                    outInfo.rawMock="";
                    obj1.outInfo=outInfo
                }
                else
                {
                    obj1.outParam=[];
                    obj1.outInfo=context.getters.outInfo
                }
                obj1.restParam=context.state.param[context.state.index].param;
                obj.param.push(obj1);
            }
            obj.param=JSON.stringify(obj.param);
            context.state.index=originIndex;
            var header={
                "content-type":"application/x-www-form-urlencoded"
            };
            if(session.get("snapshotId"))
            {
                header.docleversnapshotdis=encodeURIComponent(session.get("snapshotDis"));
            }
            var bMatchUrl=false;
            let baseUrl=context.state.baseUrl;
            if(baseUrl && baseUrl!="MockServer")
            {
                for(var i=0;i<context.state.rootInfo.state.project.baseUrls.length;i++)
                {
                    var reg=new RegExp(context.state.rootInfo.state.project.baseUrls[i].url);
                    if(reg.test(baseUrl))
                    {
                        bMatchUrl=true;
                        break;
                    }
                }
            }
            else
            {
                bMatchUrl=true;
            }
            if(!bMatchUrl)
            {
                let ret=await $.confirm("检测到当前根Url不在BaseUrl之内，是否自动添加");
                if(ret)
                {
                    let data=await net.put("/project/addurl",{
                        id:session.get("projectId"),
                        url:baseUrl
                    });
                    if(data.code==200)
                    {
                        context.state.rootInfo.dispatch("addBaseUrl",{
                            url:baseUrl,
                            remark:""
                        });
                    }
                }
            }
            return net.post("/interface/create",obj,header).then(function (data) {
                if(data.code==200)
                {
                    if(typeof(data.data)=="string")
                    {
                        if(!session.get("snapshotId") && context.state.parent.state.interface._id==context.state.interfaceEdit._id)
                        {
                            context.state.parent.state.interface.name=context.state.interfaceEdit.name;
                            context.state.parent.state.interface.method=context.state.interfaceEdit.method;
                            context.state.parent.state.interface.finish=context.state.interfaceEdit.finish;
                        }
                        Vue.set(context.state.interfaceEdit,"editor",{name:session.get("name")});
                        Vue.set(context.state.interfaceEdit,"updatedAt",$.getNowFormatDate("yyyy-MM-dd hh:mm:ss"))
                    }
                    else
                    {
                        if(data.data instanceof Array)
                        {
                            Vue.set(context.state.interfaceEdit,"editor",{name:session.get("name")});
                            Vue.set(context.state.interfaceEdit,"updatedAt",$.getNowFormatDate("yyyy-MM-dd hh:mm:ss"))
                            context.state.parent.commit("initInterfaceList",data.data);
                            (function _map1(data) {
                                for(var i=0;i<data.length;i++)
                                {
                                    var obj=data[i];
                                    if(obj.data)
                                    {
                                        var ret=arguments.callee(obj.data);
                                        if(ret)
                                        {
                                            obj.show=1;
                                            return true;
                                        }
                                    }
                                    else
                                    {
                                        if(obj._id==context.state.interfaceEdit._id)
                                        {
                                            context.state.parent.state.interface=obj;
                                            obj.select=1;
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            })(context.getters.interfaceList);
                        }
                        else
                        {
                            context.state.interfaceEdit._id=data.data._id;
                            context.state.interfaceEdit.id=data.data.id;
                            context.state.tabItem.name=data.data.name;
                            context.state.tabItem._id=data.data._id;
                            context.state.parent.state.selTabId=data.data._id;
                            Vue.set(context.state.interfaceEdit,"owner",{name:session.get("name")});
                            Vue.set(context.state.interfaceEdit,"editor",{name:session.get("name")});
                            Vue.set(context.state.interfaceEdit,"createdAt",data.data.createdAt);
                            Vue.set(context.state.interfaceEdit,"updatedAt",data.data.updatedAt);
                            (function _map1(list) {
                                for(var i=0;i<list.length;i++)
                                {
                                    var obj=list[i];
                                    if(obj.data)
                                    {
                                        if(obj._id==context.state.interfaceEdit.group._id)
                                        {
                                            var o={
                                                _id:data.data._id,
                                                name:data.data.name,
                                                method:data.data.method,
                                                finish:data.data.finish,
                                                select:1,
                                                menu:0
                                            }
                                            obj.show=1;
                                            obj.data.push(o);
                                            if(context.state.parent.state.interface)
                                            {
                                                context.state.parent.state.interface.select=0;
                                            }
                                            context.state.parent.state.interface=o;
                                            return true;
                                        }
                                        else
                                        {
                                            var ret=arguments.callee(obj.data);
                                            if(ret)
                                            {
                                                obj.show=1;
                                                return true;
                                            }
                                        }
                                    }
                                }
                                return false;
                            })(context.getters.interfaceList);
                        }
                    }
                    context.state.param.forEach(function (obj) {
                        delete obj.unSave;
                    })
                    context.state.parent.commit("searchInterface");
                }
                return data;
            })
        },
        changeType:function (context,data) {
            context.state.type=data;
            if(data=="preview")
            {
                var obj=context.state.param[context.state.index].outInfo.jsonType==1?[]:{};
                var result=helper.resultSave(context.state.param[context.state.index].result);
                var bJSON=false,objJSON={};
                if(context.state.param[context.state.index].bodyInfo.type==1 && context.state.param[context.state.index].bodyInfo.rawType==2 && context.state.param[context.state.index].bodyInfo.rawJSON)
                {
                    objJSON=context.state.param[context.state.index].bodyInfo.rawJSONType==0?{}:[];
                    bJSON=true;
                    var result1=helper.resultSave(context.state.param[context.state.index].bodyInfo.rawJSON);
                    helper.convertToJSON(result1,objJSON);
                }
                var info=helper.handleMockInfo(0,context.state.param[context.state.index].param,context.state.param[context.state.index].query,context.state.param[context.state.index].header,bJSON?objJSON:context.state.param[context.state.index].body,context.state);
                helper.convertToJSON(result,obj,info);
                context.state.drawMix=helper.format(JSON.stringify(obj),1,result,context.state.status).draw;
            }
        },
        saveTemplate:function (context,data) {
            var obj={
                name:data.name,
                url:context.state.interfaceEdit.url,
                remark:context.state.interfaceEdit.remark,
                project:session.get("projectId"),
                method:context.state.interfaceEdit.method,
                param:[]
            }
            if(data.id)
            {
                obj.id=data.id;
            }
            var originIndex=context.state.index;
            for(var index=0;index<context.state.param.length;index++)
            {
                context.state.index=index;
                var obj1={
                    before:context.state.param[index].before,
                    after:context.state.param[index].after,
                    name:context.state.param[index].name,
                    id:context.state.param[index].id,
                    remark:context.state.param[index].remark,
                }
                obj1.header=context.getters.headerSave;
                obj1.queryParam=context.getters.querySave;
                if(context.state.interfaceEdit.method=="POST" || context.state.interfaceEdit.method=="PUT" || context.state.interfaceEdit.method=="PATCH")
                {
                    if(context.getters.bodyInfo.type==0)
                    {
                        obj1.bodyParam=context.getters.bodySave;
                    }
                    else
                    {
                        obj1.bodyParam=[];
                    }
                    var bodyInfo=$.clone(context.getters.bodyInfo);
                    if(bodyInfo.type==1)
                    {
                        if(bodyInfo.rawType==0)
                        {
                            bodyInfo.rawFileRemark="";
                            delete bodyInfo.rawJSON;
                            delete bodyInfo.rawJSONType;
                        }
                        else if(bodyInfo.rawType==1)
                        {
                            bodyInfo.rawText="";
                            bodyInfo.rawTextRemark="";
                            delete bodyInfo.rawJSON;
                            delete bodyInfo.rawJSONType;
                        }
                        else
                        {
                            bodyInfo.rawFileRemark="";
                            bodyInfo.rawText="";
                            bodyInfo.rawTextRemark="";
                        }
                    }
                    else
                    {
                        bodyInfo.rawType=0;
                        bodyInfo.rawFileRemark="";
                        bodyInfo.rawText="";
                        bodyInfo.rawTextRemark="";
                        delete bodyInfo.rawJSON;
                        delete bodyInfo.rawJSONType;
                    }
                    obj1.bodyInfo=bodyInfo
                }
                if(context.getters.outInfo.type==0)
                {
                    obj1.outParam=helper.resultSave(context.state.param[context.state.index].result);
                    var outInfo=$.clone(context.getters.outInfo);
                    outInfo.rawRemark="";
                    outInfo.rawMock="";
                    obj1.outInfo=outInfo
                }
                else
                {
                    obj1.outParam=[];
                    obj1.outInfo=context.getters.outInfo
                }
                obj1.restParam=context.state.param[context.state.index].param;
                obj.param.push(obj1);
            }
            obj.param=JSON.stringify(obj.param);
            context.state.index=originIndex;
            return net.post("/template/item",obj).then(function (data) {
                return data;
            })
        },
        add:function (context,data) {
            if(context.state.parent.state.interface && (data.id || (data.item && !data.item._id)))
            {
                context.state.parent.state.interface.select=0;
                context.state.parent.commit("setInterface",null);
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
                    param:[
                        {
                            name:"参数",
                            remark:"",
                            id:uuid(),
                            "outParam": [{
                                name:"",
                                must:0,
                                type:0,
                                remark:"",
                                show:0,
                                mock:"",
                                drag:1
                            }],
                            "bodyParam": [],
                            "queryParam": [],
                            "header": [],
                            "bodyInfo":{
                                type:0,
                                rawType:0,
                                rawTextRemark:"",
                                rawFileRemark:"",
                                rawText:"",
                                rawJSON:context.getters.curParam.rawJSONObject,
                                rawJSONType:0
                            },
                            outInfo:{
                                type:0,
                                rawRemark:"",
                                rawMock:"",
                                jsonType:0
                            },
                            restParam:[],
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
                });
            }
            context.dispatch("changeType","edit");
            context.commit("initInterface");
            context.dispatch("initRunData");
            context.getters.event.$emit("initInterface");
        },
        init:function (context,obj) {
            var itemData;
            return net.get("/interface/item",{
                id:obj._id,
                group:obj.group,
                project:session.get("projectId")
            }).then(function (data) {
                if(data.code==200)
                {
                    obj.name=data.data.name;
                    obj.method=data.data.method;
                    obj.finish=data.data.finish;
                    itemData=data.data;
                    if(data.data.change)
                    {
                        return net.get("/project/interface",{
                            id:session.get("projectId"),
                            sort:session.get("sort")?session.get("sort"):0
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                context.state.parent.dispatch("refreshData",data.data.data);
                                window.store.commit("info/setBaseUrls",data.data.baseUrl,{
                                    root:true
                                });
                                context.dispatch("showInfo",{
                                    data:itemData._id,
                                    data1:itemData
                                });
                            }
                            return data;
                        })
                    }
                    else
                    {
                        context.dispatch("showInfo",{
                            data:data.data,
                            data1:obj
                        });
                    }
                }
                else
                {
                    throw data.msg
                }
                return data;
            })
        },
        showInfo:function (context,data) {
            if(context.state.parent.state.interface && !session.get("snapshotId"))
            {
                context.state.parent.state.interface.select=0;
            }
            if(data.data==null)
            {
                context.state.parent.commit("setInterface",null);
            }
            else if(typeof(data.data)=="string")
            {
                for(var i=0;i<context.getters.interfaceList.length;i++)
                {
                    var obj=context.getters.interfaceList[i];
                    var bBreak=false;
                    for(var j=0;j<obj.data.length;j++)
                    {
                        var obj1=obj.data[j];
                        if(obj1._id==data.data)
                        {
                            obj.show=1;
                            context.state.parent.commit("setInterface",obj1);
                            obj1.select=1;
                            context.commit("setInterfaceEdit",data.data1);
                            bBreak=true;
                            break;
                        }
                    }
                    if(bBreak)
                    {
                        break;
                    }
                }
            }
            else
            {
                if(!session.get("snapshotId"))
                {
                    for(var i=0;i<context.getters.interfaceList.length;i++)
                    {
                        var obj=context.getters.interfaceList[i];
                        var bBreak=false;
                        for(var j=0;j<obj.data.length;j++)
                        {
                            var obj1=obj.data[j];
                            if(obj1._id==data.data._id)
                            {
                                obj.show=1;
                                context.state.parent.commit("setInterface",obj1);
                                obj1.select=1;
                                context.commit("setInterfaceEdit",data.data1);
                                bBreak=true;
                                break;
                            }
                        }
                        if(bBreak)
                        {
                            break;
                        }
                    }
                }
                context.commit("setInterfaceEdit",data.data);
            }
            context.commit("initParam");
            if(context.state.parent.state.interface)
            {
                context.commit("initInterface");
            }
            else
            {
                context.commit("setInterfaceEdit",null);
            }
            if(context.getters.interfaceEditRole)
            {
                context.dispatch("changeType","edit");
                context.dispatch("initRunData");
            }
            else
            {
                context.dispatch("changeType","preview");
            }

            context.getters.event.$emit("initInterface");
        },
        newInterface:function (context) {
            if(context.state.newInterfaceStr)
            {
                var objInterface=JSON.parse(context.state.newInterfaceStr);
                context.dispatch("add",{
                    id:null,
                    item:objInterface
                });
                context.state.newInterfaceStr="";
            }
        },
        run:function (context,el) {
            var method=context.state.interfaceEdit.method;
            var baseUrl=$.trim(context.state.baseUrl);
            var path=$.trim(context.state.interfaceEdit.url);
            var globalVar={};
            context.getters.baseUrls.forEach(function (obj) {
                if(obj.url==baseUrl && obj.env)
                {
                    obj.env.forEach(function (obj) {
                        globalVar[obj.key]=obj.value;
                    })
                }
            })
            if(!method || !baseUrl || !path)
            {
                return new Promise(function (resolve,reject) {
                    var obj={};
                    obj.code=0;
                    obj.msg="方法，url和路由地址不能为空!"
                    resolve(obj)
                });
            }
            var bMock=false;
            if(baseUrl!="MockServer")
            {
                var indexHttp=baseUrl.indexOf("://"),indexSlash;
                if(indexHttp==-1)
                {
                    indexSlash=baseUrl.indexOf("/")
                }
                else
                {
                    indexSlash=baseUrl.indexOf("/",indexHttp+3);
                }
                if(indexSlash>-1)
                {
                    var baseUrlTemp=baseUrl.substring(0,indexSlash);
                    var pathTemp=baseUrl.substr(indexSlash);
                    if(pathTemp[pathTemp.length-1]=="/" && path[0]=="/")
                    {
                        pathTemp=pathTemp.substr(0,pathTemp.length-1);
                    }
                    else if(pathTemp[pathTemp.length-1]!="/" && path[0]!="/" && pathTemp.indexOf("?")==-1 && pathTemp.indexOf("#")==-1)
                    {
                        pathTemp+="/"
                    }
                    baseUrl=baseUrlTemp;
                    path=pathTemp+path;
                }
                else
                {
                    if(path[0]!="/")
                    {
                        path="/"+path;
                    }
                }
            }
            else
            {
                bMock=true;
                baseUrl=config.baseUrl;
                path="/mock/"+session.get("projectId")+(session.get("versionId")?session.get("versionId"):"")+(path[0]!="/"?("/"+path):path);
            }
            path=helper.handleGlobalVar(path,globalVar);
            if(path.substr(0,2)=="//")
            {
                path=path.substr(1);
            }
            var param={};
            context.getters.param.forEach(function (obj) {
                param[obj.name]=helper.handleGlobalVar(obj.selValue,globalVar);
            })
            var query={};
            context.getters.querySave.forEach(function (obj) {
                if(obj.encrypt && obj.encrypt.type)
                {
                    var value=helper.encrypt(obj.encrypt.type,helper.handleGlobalVar(obj.selValue,globalVar),obj.encrypt.salt);
                    var key=obj.name;
                    if(obj.encrypt.key)
                    {
                        key=helper.encrypt(obj.encrypt.type,key,obj.encrypt.salt);
                    }
                    query[key]=value;
                }
                else
                {
                    query[obj.name]=helper.handleGlobalVar(obj.selValue,globalVar);
                }

            })
            var header={};
            context.getters.headerSave.forEach(function (obj) {
                if(obj.encrypt && obj.encrypt.type)
                {
                    var value=helper.encrypt(obj.encrypt.type,helper.handleGlobalVar(obj.value,globalVar),obj.encrypt.salt);
                    var key=obj.name;
                    header[key]=value;
                }
                else
                {
                    header[obj.name]=helper.handleGlobalVar(obj.value,globalVar);
                }
            })
            var body={},bUpload=false;
            if(method=="POST" || method=="PUT" || method=="PATCH")
            {
                if(context.getters.curParam.bodyInfo.type==0)
                {
                    var arr=el.querySelectorAll("[custom]");
                    context.getters.bodySave.forEach(function (obj,index) {
                        if(obj.type==0)
                        {
                            if(obj.encrypt && obj.encrypt.type)
                            {
                                var value=helper.encrypt(obj.encrypt.type,helper.handleGlobalVar(obj.selValue,globalVar),obj.encrypt.salt);
                                var key=obj.name;
                                if(obj.encrypt.key)
                                {
                                    key=helper.encrypt(obj.encrypt.type,key,obj.encrypt.salt);
                                }
                                body[key]=value;
                            }
                            else
                            {
                                body[obj.name]=helper.handleGlobalVar(obj.selValue,globalVar);
                            }
                        }
                        else if(obj.type==1)
                        {
                            if(arr[index].files.length>0)
                            {
                                if(obj.encrypt && obj.encrypt.type && obj.encrypt.key)
                                {
                                    var key=helper.encrypt(obj.encrypt.type,obj.name,obj.encrypt.salt);
                                    body[key]=arr[index].files[0];
                                }
                                else
                                {
                                    body[obj.name]=arr[index].files[0];
                                }
                                bUpload=true;
                            }
                            else
                            {
                                if(obj.encrypt && obj.encrypt.type && obj.encrypt.key)
                                {
                                    var key=helper.encrypt(obj.encrypt.type,obj.name,obj.encrypt.salt);
                                    body[key]="";
                                }
                                else
                                {
                                    body[obj.name]="";
                                }

                            }
                        }
                    })
                }
                else
                {
                    if(context.getters.curParam.bodyInfo.rawType==0)
                    {
                        var encryptType=context.getters.curParam.encryptType;
                        if(encryptType)
                        {
                            body=helper.encrypt(encryptType,helper.handleGlobalVar(context.getters.curParam.bodyInfo.rawText,globalVar),document.getElementById("bodyRawEncryptSalt").querySelector("input").value)
                        }
                        else
                        {
                            body=helper.handleGlobalVar(context.getters.curParam.bodyInfo.rawText,globalVar);
                        }
                    }
                    else if(context.getters.curParam.bodyInfo.rawType==2)
                    {
                        var obj=context.getters.curParam.bodyInfo.rawJSONType==0?{}:[];
                        var result=helper.resultSave(context.getters.curParam.bodyInfo.rawJSON,0,globalVar);
                        helper.convertToJSON(result,obj,null,1);
                        body=obj;
                    }
                    else
                    {
                        if(!context.getters.curParam.fileResult)
                        {
                            return new Promise(function (resolve,reject) {
                                var obj={};
                                obj.code=0;
                                obj.msg="上传内容不能为空！";
                                resolve(obj)
                            });
                        }
                        body=context.getters.curParam.fileResult;
                    }
                }
            }

            if(context.getters.curParam.before.mode==0)
            {
                if(context.state.rootInfo.state.project.before)
                {
                    helper.runBefore(context.state.rootInfo.state.project.before,baseUrl,path,method,query,header,body,param)
                }
                helper.runBefore(context.getters.curParam.before.code,baseUrl,path,method,query,header,body,param)
            }
            else
            {
                helper.runBefore(context.getters.curParam.before.code,baseUrl,path,method,query,header,body,param)
            }
            for(var paramKey in param)
            {
                path=path.replace("{"+paramKey+"}",param[paramKey])
            }
            if((method=="POST" || method=="PUT" || method=="PATCH") && context.getters.curParam.bodyInfo.type==1 && context.getters.curParam.bodyInfo.rawType==2)
            {
                body=JSON.stringify(body);
            }
            query=$.param(query);
            if(query.length>0)
            {
                path=path+"?"+query;
            }
            var startDate=new Date();
            var bContent=false,contentKey;
            context.getters.curParam.resultData="";
            var func=window.apiNode.net(method,baseUrl+path,header,body);
            return func.then(function (result) {
                context.getters.curParam.run=1;
                context.getters.curParam.reqHeader=header;
                context.getters.curParam.resHeader=result.header;
                context.getters.curParam.status=String(result.status);
                context.getters.curParam.second=(((new Date())-startDate)/1000).toFixed(3);
                context.getters.curParam.type=typeof (result.data);
                if(context.getters.curParam.after.mode==0)
                {
                    if(context.state.rootInfo.state.project.after)
                    {
                        helper.runAfter(context.state.rootInfo.state.project.after,result.status,result.header,result.data)
                    }
                    helper.runAfter(context.getters.curParam.after.code,result.status,result.header,result.data)
                }
                else
                {
                    helper.runAfter(context.getters.curParam.after.code,result.status,result.header,result.data)
                }
                if(context.getters.curParam.type=="object" && !(result.data instanceof Blob))
                {
                    context.getters.curParam.type="object"
                    context.getters.curParam.resultData=result.data;
                    context.getters.curParam.rawData=JSON.stringify(result.data);
                    var outParam=helper.resultSave(context.getters.curParam.result)
                    context.getters.curParam.draw=helper.format(context.getters.curParam.rawData,0,outParam,context.state.rootInfo.state.status).draw;
                    var obj=helper.format(context.getters.curParam.rawData,1,outParam,context.state.rootInfo.state.status);
                    context.getters.curParam.drawMix=obj.draw
                    context.getters.curParam.errorCount=obj.error;
                }
                else if(result.header["content-type"] && result.header["content-type"].indexOf("image/")>-1)
                {
                    if(context.getters.curParam.imgUrl)
                    {
                        $.revokeUrlObject(context.getters.curParam.imgUrl);
                        context.getters.curParam.imgUrl=""
                    }
                    context.getters.curParam.type="img";
                    context.getters.curParam.rawData="";
                    context.getters.curParam.imgUrl=$.createUrlObject(result.data);
                    context.getters.curParam.errorCount=0;
                }
                else if(result.header["content-type"] && result.header["content-type"].indexOf("/html")>-1)
                {
                    context.getters.curParam.type="html";
                    context.getters.curParam.rawData=result.data;
                    context.getters.curParam.draw=result.data
                    context.getters.curParam.drawMix=result.data;
                    context.getters.curParam.errorCount=0;
                }
                else
                {
                    if(result.header["content-type"]===undefined || (result.header["content-type"] && result.header["content-type"].indexOf("/xml")==-1))
                    {
                        var ele=document.createElement("div");
                        ele.innerHTML=result.data;
                        if(ele.childNodes.length>1 || (ele.childNodes.length>0 && ele.childNodes[0].nodeType==1))
                        {
                            context.getters.curParam.type="html";
                        }
                    }
                    context.getters.curParam.rawData=result.data;
                    context.getters.curParam.draw=result.data
                    context.getters.curParam.drawMix=result.data;
                    context.getters.curParam.errorCount=0;
                }
                return {
                    code:200
                }
            })
        },
        initBaseUrl:function (context) {
            if(context.state.rootInfo.state.lastBaseUrl)
            {
                context.commit("setBaseUrl",context.state.rootInfo.state.lastBaseUrl);
            }
            else
            {
                context.commit("setBaseUrl",context.state.rootInfo.state.project.length>0?context.state.rootInfo.state.project.baseUrls[0].url:"");
            }
        },
        setLastBaseUrl:function (context,data) {
            context.state.rootInfo.commit("setLastBaseUrl",data)
        },
        changeExample:function (context,id) {
            if(id)
            {
                return net.get("/example/item",{
                    id:id
                }).then(function (data) {
                    if(data.code==200)
                    {
                        var obj={
                            query:data.data.param.query,
                            header:data.data.param.header,
                            body:data.data.param.body?data.data.param.body:[{
                                name:"",
                                type:0,
                                must:0,
                                remark:"",
                                enable:1,
                                selValue:""
                            }],
                            param:data.data.param.param,
                            bodyInfo:data.data.param.bodyInfo?data.data.param.bodyInfo:{
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
                            before:data.data.param.before,
                            after:data.data.param.after,
                            fileResult:"",
                            resHeader:[],
                            reqHeader:{},
                            status:"",
                            second:"",
                            draw:[],
                            drawMix:[],
                            type:"object",
                            imgUrl:"",
                            resultData:"",
                            queryRawShow:0,
                            headerRawShow:0,
                            bodyRawShow:0,
                            queryRawStr:"",
                            headerRawStr:"",
                            bodyRawStr:"",
                            rawData:"",
                            encryptType:"",
                            errorCount:0,
                            run:0
                        }
                        for(var key in obj)
                        {
                            Vue.set(context.getters.curParam,key,obj[key]);
                        }
                        if(context.getters.curParam.bodyInfo.rawJSON.length==0)
                        {
                            context.getters.curParam.bodyInfo.rawJSON=context.getters.curParam.rawJSONObject;
                        }
                        var param=data.data.param;
                        if(param.type=="object")
                        {
                            param.draw=helper.format(param.rawData,0,[],context.state.rootInfo.state.status).draw;
                        }
                        else
                        {
                            param.draw=param.rawData;
                        }
                        Vue.set(context.getters.curParam,"selParam",$.clone(data.data.param));
                        Vue.set(context.getters.curParam,"selExample",{
                            id:data.data._id,
                            value:data.data.name
                        });
                    }
                    return data;
                })
            }
            else
            {
                var obj=$.clone(context.getters.curParam.initParam);
                for(var key in obj)
                {
                    Vue.set(context.getters.curParam,key,obj[key]);
                }
                return new Promise(function (resolve,reject) {
                    setTimeout(function () {
                        resolve({
                            code:200
                        })
                    },200);
                })
            }
        },
        saveExample:function (context,obj) {
            var obj1={
                query:context.getters.curParam.query,
                header:context.getters.curParam.header,
                body:context.getters.curParam.body,
                param:context.getters.curParam.param,
                before:context.getters.curParam.before,
                after:context.getters.curParam.after,
                run:context.getters.curParam.run
            };
            if(context.getters.curParam.run)
            {
                obj1.status=context.getters.curParam.status;
                obj1.second=context.getters.curParam.second;
                obj1.type=context.getters.curParam.type;
                obj1.rawData=context.getters.curParam.rawData;
                obj1.resHeader=context.getters.curParam.resHeader;
                obj1.reqHeader=context.getters.curParam.reqHeader
            }
            if(context.state.interfaceEdit.method=="POST" || context.state.interfaceEdit.method=="PUT" || context.state.interfaceEdit.method=="PATCH")
            {
                obj1.bodyInfo=context.getters.curParam.bodyInfo;
            }
            var query={
                project:session.get("projectId"),
                interface:context.state.interfaceEdit._id,
                paramid:context.getters.curParam.id,
                param:JSON.stringify(obj1)
            }
            if(obj.type=="save")
            {
                query.id=context.getters.curParam.selExample.id;
                query.name=context.getters.curParam.selExample.value;
            }
            else if(obj.type=="saveAs")
            {
                query.name=obj.name
            }
            else if(obj.type=="rename")
            {
                query.name=obj.name;
                query.id=context.getters.curParam.selExample.id
            }
            return net.post("/example/item",query).then(function (data) {
                if(data.code==200)
                {
                    if(obj.type=="saveAs")
                    {
                        return context.dispatch("changeExample",data.data._id);
                    }
                    else if(obj.type=="rename")
                    {
                        context.getters.curParam.selExample.value=obj.name
                    }
                    else if(obj.type=="save")
                    {
                        if(context.getters.curParam.run)
                        {
                            context.getters.curParam.selParam.run=1;
                            context.getters.curParam.selParam.status=context.getters.curParam.status;
                            context.getters.curParam.selParam.second=context.getters.curParam.second;
                            context.getters.curParam.selParam.type=context.getters.curParam.type;
                            context.getters.curParam.selParam.rawData=context.getters.curParam.rawData;
                            context.getters.curParam.selParam.resHeader=context.getters.curParam.resHeader
                            context.getters.curParam.selParam.reqHeader=context.getters.curParam.reqHeader
                            if(context.getters.curParam.type=="object")
                            {
                                context.getters.curParam.selParam.draw=helper.format(context.getters.curParam.selParam.rawData,0,[],context.state.rootInfo.state.status).draw;
                            }
                        }
                    }
                }
                return data;
            })
        },
        removeExample:function (context) {
            return net.delete("/example/item",{
                id:context.getters.curParam.selExample.id
            }).then(function (data) {
                if(data.code==200)
                {
                    return context.dispatch("changeExample");
                }
                return data;
            })
        },
        joinTest:function (context) {
            var pro;
            if(context.getters.curParam.selExample.id)
            {
                pro=context.dispatch("saveExample",{
                    type:"save"
                })
            }
            else
            {
                pro=helper.delay(0);
            }
            return pro.then(function () {
                var obj=$.clone(context.state.parent.state.interface);
                delete obj.param;
                Object.assign(obj,{
                    paramId:context.getters.curParam.id,
                    queryParam:context.getters.curParam.query.filter(function (obj) {
                        if(obj.name)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }),
                    header:context.getters.curParam.header.filter(function (obj) {
                        if(obj.name)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }),
                    restParam:context.getters.curParam.param.filter(function (obj) {
                        if(obj.name)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }),
                    before:context.getters.curParam.before,
                    after:context.getters.curParam.after,
                    encrypt:context.getters.curParam.encrypt?context.getters.curParam.encrypt:{
                        "type":"",
                        "salt":""
                    },
                    baseUrl:"defaultUrl",
                    pullInject:0,
                    outInfo:context.getters.curParam.outInfo,
                    outParam:context.getters.curParam.result
                })
                if(context.getters.curParam.body)
                {
                    obj.bodyParam=context.getters.curParam.body.filter(function (obj) {
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
                if(context.getters.curParam.bodyInfo)
                {
                    obj.bodyInfo=context.getters.curParam.bodyInfo;
                }
                if(context.getters.curParam.selExample.id)
                {
                    obj.example=context.getters.curParam.selExample.id;
                }
                return obj;
            })
        },
        initRunData:function (context) {
            context.state.param.forEach(function (obj) {
                var objKey={
                    fileResult:"",
                    resHeader:[],
                    reqHeader:{},
                    status:"",
                    second:"",
                    draw:[],
                    drawMix:[],
                    type:"object",
                    imgUrl:"",
                    resultData:"",
                    rawData:"",
                    encryptType:"",
                    errorCount:0,
                    run:0
                }
                for(var key in objKey)
                {
                    Vue.set(obj,key,objKey[key]);
                }
                Vue.set(obj,"selParam",$.clone(obj));
                Vue.set(obj,"selExample",{
                    id:"",
                    value:"无运行实例"
                });
                Vue.set(obj,"initParam",$.clone(obj));
            })
            context.dispatch("initBaseUrl");
        },
        generateResult:function (context,resType) {
            var result=[],outInfo;
            var resultData,type;
            if(resType==1)
            {
                resultData=context.getters.curParam.resultData;
                type=context.getters.curParam.type;
            }
            else
            {
                resultData=context.getters.curParam.selParam.rawData?JSON.parse(context.getters.curParam.selParam.rawData):"";
                type=context.getters.curParam.selParam.type;
            }
            if(resultData)
            {
                if((resultData instanceof Array) && resultData.length>0)
                {
                    var resultObj=helper.findObj(context.getters.curParam.result,key);
                    helper.handleResultData(key,resultData[0],result,resultObj)
                }
                else
                {
                    for(var key in resultData)
                    {
                        var resultObj=helper.findObj(context.getters.curParam.result,key);
                        helper.handleResultData(key,resultData[key],result,resultObj)
                    }
                }
            }
            if(type=="object")
            {
                outInfo={
                    type:0,
                    rawRemark:"",
                    rawMock:"",
                    jsonType:(resultData && (resultData instanceof Array))?1:0
                }
            }
            else
            {
                outInfo={
                    type:1,
                    rawRemark:context.getters.curParam.outInfo?context.getters.curParam.outInfo.rawRemark:"",
                    rawMock:context.getters.curParam.outInfo?context.getters.curParam.outInfo.rawMock:"",
                    jsonType:0
                }
            }
            context.getters.curParam.outInfo=outInfo;
            context.getters.curParam.result=result;
        }
    }
}

if (module.hot) {
    module.hot.accept(['../run/store','../test/store'], function () {
        var run=require("../run/store");
        var test=require("../test/store");
        store.hotUpdate({
            modules: {
                run:run,
                test:test
            }
        })
    })
}
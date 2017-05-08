/**
 * Created by sunxin on 2017/2/28.
 */
var config=require("../util/config")
module.exports=new Vuex.Store({
    state:{
        interface:{},
        baseUrl:"",
        baseUrls:[],
        query:[{
            name:"",
            must:0,
            remark:"",
            value:"",
            selValue:"",
            enable:1
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
            value:"",
            selValue:"",
            enable:1
        }],
        param:[],
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
        fileResult:"",
        resHeader:[],
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
        arrStatus:[],
        globalBefore:"",
        globalAfter:""
    },
    getters:{
        querySave:function (state,getters) {
            return state.query.filter(function (obj) {
                if(obj.name && obj.enable)
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
                if(obj.name && obj.enable)
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
    },
    mutations:{
        clear:function (state) {
            state.interface={};
            state.baseUrl="";
            state.baseUrls=[];
            state.query=[{
                name:"",
                must:0,
                remark:"",
                value:"",
                selValue:"",
                enable:1
            }];
            state.header=[{
                name:"",
                value:"",
                remark:""
            }];
            state.body=[{
                name:"",
                type:0,
                must:0,
                remark:"",
                value:"",
                selValue:"",
                enable:1
            }];
            state.param=[];
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
            state.fileResult="";
            state.resHeader=[];
            state.status="";
            state.second="";
            state.draw=[];
            state.drawMix=[];
            state.type="object";
            state.imgUrl="";
            state.resultData="";
            state.queryRawShow=0;
            state.headerRawShow=0;
            state.bodyRawShow=0;
            state.queryRawStr="";
            state.headerRawStr="";
            state.bodyRawStr="";
            state.rawData="";
            state.encryptType="";
            state.errorCount=0;
            state.arrStatus=[];
        },
        initData:function (state,data) {
            state.interface=data;
            if(state.interface.queryParam.length>0)
            {
                for(var i=0;i<state.interface.queryParam.length;i++)
                {
                    Vue.set(state.interface.queryParam[i],"enable",1);
                    Vue.set(state.interface.queryParam[i],"selValue","");
                    if(state.interface.queryParam[i].value && state.interface.queryParam[i].value.type==0 && state.interface.queryParam[i].value.data.length>0)
                    {
                        state.interface.queryParam[i].selValue=state.interface.queryParam[i].value.data[0].value;
                    }
                    else if(state.interface.queryParam[i].value && state.interface.queryParam[i].value.type==1 && state.interface.queryParam[i].value.status)
                    {
                        var objStatus=null;
                        state.arrStatus.forEach(function (obj) {
                            if(obj.id==state.interface.queryParam[i].value.status)
                            {
                                objStatus=obj;
                            }
                        })
                        if(objStatus && objStatus.data.length>0)
                        {
                            state.interface.queryParam[i].selValue=objStatus.data[0].key;
                        }
                        else
                        {
                            state.interface.queryParam[i].selValue="";
                        }
                    }
                    else
                    {
                        state.interface.queryParam[i].selValue="";
                    }

                }
                state.query=state.interface.queryParam;
            }
            if(state.interface.bodyParam.length>0)
            {
                for(var i=0;i<state.interface.bodyParam.length;i++)
                {
                    Vue.set(state.interface.bodyParam[i],"enable",1);
                    Vue.set(state.interface.bodyParam[i],"selValue","");
                    if(state.interface.bodyParam[i].value && state.interface.bodyParam[i].value.type==0 && state.interface.bodyParam[i].value.data.length>0)
                    {
                        state.interface.bodyParam[i].selValue=state.interface.bodyParam[i].value.data[0].value;
                    }
                    else if(state.interface.bodyParam[i].value && state.interface.bodyParam[i].value.type==1 && state.interface.bodyParam[i].value.status)
                    {
                        var objStatus=null;
                        state.arrStatus.forEach(function (obj) {
                            if(obj.id==state.interface.bodyParam[i].value.status)
                            {
                                objStatus=obj;
                            }
                        })
                        if(objStatus && objStatus.data.length>0)
                        {
                            state.interface.bodyParam[i].selValue=objStatus.data[0].key;
                        }
                        else
                        {
                            state.interface.bodyParam[i].selValue="";
                        }
                    }
                    else
                    {
                        state.interface.bodyParam[i].selValue="";
                    }

                }
                state.body=state.interface.bodyParam;
            }
            if(state.interface.header.length>0)
            {
                state.header=state.interface.header;
            }
            if(state.interface.restParam.length>0)
            {
                for(var i=0;i<state.interface.restParam.length;i++)
                {
                    Vue.set(state.interface.restParam[i],"selValue","");
                    if(state.interface.restParam[i].value && state.interface.restParam[i].value.type==0 && state.interface.restParam[i].value.data.length>0)
                    {
                        state.interface.restParam[i].selValue=state.interface.restParam[i].value.data[0].value;
                    }
                    else if(state.interface.restParam[i].value && state.interface.restParam[i].value.type==1 && state.interface.restParam[i].value.status)
                    {
                        var objStatus=null;
                        state.arrStatus.forEach(function (obj) {
                            if(obj.id==state.interface.restParam[i].value.status)
                            {
                                objStatus=obj;
                            }
                        })
                        if(objStatus && objStatus.data.length>0)
                        {
                            state.interface.restParam[i].selValue=objStatus.data[0].key;
                        }
                        else
                        {
                            state.interface.restParam[i].selValue="";
                        }
                    }
                    else
                    {
                        state.interface.restParam[i].selValue="";
                    }

                }
                state.param=state.interface.restParam;
            }
            if(state.interface.bodyInfo)
            {
                state.bodyInfo=state.interface.bodyInfo;
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
            }
        },
        setFileResult:function (state,data) {
            state.fileResult=data;
        },
        toggleQuery:function (state) {
            if(state.queryRawShow)
            {
                state.queryRawShow=0;
                var str=$.trim(state.queryRawStr);
                var arr=[];
                var param1=str.split("&");
                for(var i=0;i<param1.length;i++)
                {
                    var param2=param1[i].split("=");
                    if(param2.length>0)
                    {
                        var valueObj=helper.findValue(state.query,param2[0]);
                        arr.push({
                            name:param2[0],
                            must:valueObj?valueObj.must:1,
                            remark:valueObj?valueObj.remark:"",
                            selValue:param2[1]?decodeURIComponent(param2[1]):"",
                            enable:valueObj?valueObj.enable:1,
                            value:valueObj?valueObj.value:null,
                            encrypt:(valueObj && valueObj.encrypt)?valueObj.encrypt:{
                                    type:"",
                                    salt:"",
                                    key:0
                                }
                        })
                    }
                }
                state.query=arr;
            }
            else
            {
                state.queryRawShow=1;
                var str="",arr=state.query;
                for(var i=0;i<arr.length;i++)
                {
                    if(arr[i].name)
                    {
                        str+=(arr[i].name+"="+(encodeURIComponent(arr[i].selValue))+((i!=arr.length-1)?"&":""))
                    }
                }
                state.queryRawStr=str;
            }
        },
        toggleHeader:function (state) {
            if(state.headerRawShow)
            {
                state.headerRawShow=0;
                var arr=$.trim(state.headerRawStr).split("\n");
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
                        var obj=helper.findValue(state.header,key);
                        arrHeader.push({
                            name:key,
                            value:value,
                            remark:obj?obj.remark:"",
                            encrypt:(obj && obj.encrypt)?obj.encrypt:{
                                    type:"",
                                    salt:"",
                                    key:0
                                }
                        })
                    }
                }
                if(arrHeader.length==0)
                {
                    arrHeader.push({
                        name:"",
                        value:"",
                        remark:""
                    })
                }
                state.header=arrHeader;
            }
            else
            {
                state.headerRawShow=1;
                var str="",arr=state.header;
                for(var i=0;i<arr.length;i++)
                {
                    if(arr[i].name)
                    {
                        str+=(arr[i].name+":"+(arr[i].value?arr[i].value:"")+((i!=arr.length-1)?"\n":""))
                    }
                }
                state.headerRawStr=str;
            }
        },
        toggleBody:function (state) {
            if(state.bodyRawShow)
            {
                state.bodyRawShow=0;
                var str=$.trim(state.bodyRawStr);
                var arr=[];
                var param1=str.split("&");
                for(var i=0;i<param1.length;i++)
                {
                    var param2=param1[i].split("=");
                    if(param2.length>0)
                    {
                        var valueObj=helper.findValue(state.body,param2[0]);
                        var selValue=param2[1]?decodeURIComponent(param2[1]):""
                        if(valueObj && valueObj.type!=1)
                        {
                            valueObj.selValue=selValue;
                        }
                        arr.push({
                            name:param2[0],
                            type:valueObj?valueObj.type:(selValue=="[FILE]"?1:0),
                            must:valueObj?valueObj.must:1,
                            remark:valueObj?valueObj.remark:"",
                            selValue:selValue,
                            enable:valueObj?valueObj.enable:1,
                            value:valueObj?valueObj.value:null,
                            encrypt:(valueObj && valueObj.encrypt)?valueObj.encrypt:{
                                    type:"",
                                    salt:"",
                                    key:0
                                }
                        })
                    }
                }
                state.body=arr;
            }
            else
            {
                state.bodyRawShow=1;
                var str="",arr=state.body;
                for(var i=0;i<arr.length;i++)
                {
                    if(arr[i].name)
                    {
                        str+=(arr[i].name+"="+(arr[i].type==1?"[FILE]":encodeURIComponent(arr[i].selValue))+((i!=arr.length-1)?"&":""))
                    }
                }
                state.bodyRawStr=str;
            }
        },
        changeMethod:function (state) {
            if(state.interface.method=="POST" || state.interface.method=="PUT")
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
            }
        },
        setBaseUrls:function (state,val) {
            state.baseUrls=val;
            state.baseUrl=val.length>0?val[0]:""
        },
        setBaseUrl:function (state,val) {
            state.baseUrl=val;
        },
        setQueryRawStr:function (state,val) {
            state.queryRawStr=val;
        },
        setHeaderRawStr:function (state,val) {
            state.headerRawStr=val;
        },
        setBodyRawStr:function (state,val) {
            state.bodyRawStr=val;
        },
        setArrStatus:function (state,val) {
            state.arrStatus=val;
        },
        setGlobalBefore:function (state,val) {
            state.globalBefore=val;
        },
        setGlobalAfter:function (state,val) {
            state.globalAfter=val;
        },
        setEncryptType:function (state,val) {
            state.encryptType=val;
        },
    },
    actions:{
        run:function (context) {
            var method=context.state.interface.method;
            var baseUrl=$.trim(context.state.baseUrl);
            var path=$.trim(context.state.interface.url);
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
                path="/mock/"+sessionStorage.getItem("projectId")+(path[0]!="/"?("/"+path):path);
            }
            context.state.param.forEach(function (obj) {
                if(obj.name)
                {
                    path=path.replace("{"+obj.name+"}",obj.selValue)
                }
            })
            var query={};
            context.getters.querySave.forEach(function (obj) {
                if(obj.encrypt && obj.encrypt.type)
                {
                    var value=helper.encrypt(obj.encrypt.type,obj.selValue,obj.encrypt.salt);
                    var key=obj.name;
                    if(obj.encrypt.key)
                    {
                        key=helper.encrypt(obj.encrypt.type,key,obj.encrypt.salt);
                    }
                    query[key]=value;
                }
                else
                {
                    query[obj.name]=obj.selValue;
                }

            })
            var header={},arrHeaders=["host","connection","origin","referer","user-agent"],objHeaders={};
            context.getters.headerSave.forEach(function (obj) {
                if(obj.encrypt && obj.encrypt.type)
                {
                    var value=helper.encrypt(obj.encrypt.type,obj.value,obj.encrypt.salt);
                    var key=obj.name;
                    if($.inArr(key,arrHeaders))
                    {
                        objHeaders[key]=value;
                    }
                    else
                    {
                        header[key]=value;
                    }

                }
                else
                {
                    if($.inArr(obj.name,arrHeaders))
                    {
                        objHeaders[obj.name]=obj.value;
                    }
                    else
                    {
                        header[obj.name]=obj.value;
                    }

                }
            })
            var body={},bUpload=false;
            if(method=="POST" || method=="PUT")
            {
                if(context.state.bodyInfo.type==0)
                {
                    var arr=document.getElementById("bodyTable").querySelectorAll("[custom]");
                    context.getters.bodySave.forEach(function (obj,index) {
                        if(obj.type==0)
                        {
                            if(obj.encrypt && obj.encrypt.type)
                            {
                                var value=helper.encrypt(obj.encrypt.type,obj.selValue,obj.encrypt.salt);
                                var key=obj.name;
                                if(obj.encrypt.key)
                                {
                                    key=helper.encrypt(obj.encrypt.type,key,obj.encrypt.salt);
                                }
                                body[key]=value;
                            }
                            else
                            {
                                body[obj.name]=obj.selValue;
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
                    if(context.state.bodyInfo.rawType==0)
                    {
                        var encryptType=context.state.encryptType;
                        if(encryptType)
                        {
                            body=helper.encrypt(encryptType,context.state.bodyInfo.rawText,document.getElementById("bodyRawEncryptSalt").querySelector("input").value)
                        }
                        else
                        {
                            body=context.state.bodyInfo.rawText;
                        }
                    }
                    else if(context.state.bodyInfo.rawType==2)
                    {
                        var obj={};
                        var result=helper.resultSave(context.state.bodyInfo.rawJSON);
                        helper.convertToJSON(result,obj);
                        body=obj;
                    }
                    else
                    {
                        if(!context.state.fileResult)
                        {
                            return new Promise(function (resolve,reject) {
                                var obj={};
                                obj.code=0;
                                obj.msg="上传内容不能为空！";
                                resolve(obj)
                            });
                        }
                        body=context.state.fileResult;
                    }
                }
            }
            if(context.state.interface.before.mode==0)
            {
                if(context.state.globalBefore)
                {
                    helper.runBefore(context.state.globalBefore,baseUrl,path,method,query,header,body)
                }
                helper.runBefore(context.state.interface.before.code,baseUrl,path,method,query,header,body)
            }
            else
            {
                helper.runBefore(context.state.interface.before.code,baseUrl,path,method,query,header,body)
            }
            if((method=="POST" || method=="PUT") && context.state.bodyInfo.type==1 && context.state.bodyInfo.rawType==2)
            {
                body=JSON.stringify(body);
            }
            query=$.param(query);
            if(query.length>0)
            {
                path=path+"?"+query;
            }
            header["__url"]=baseUrl;
            header["__path"]=path;
            header["__method"]=method;
            header["__user"]=session.get("id");
            header["__headers"]=JSON.stringify(objHeaders);
            var proxyUrl="/proxy";
            var bNet=false;
            if(/10\./i.test(baseUrl) || /192\.168\./i.test(baseUrl) || /127\.0\.0\.1/i.test(baseUrl) || /172\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)\./.test(baseUrl) || /localhost/i.test(baseUrl) && !bMock)
            {
                bNet=true;
                proxyUrl="http://127.0.0.1:36742";
            }
            var startDate=new Date();
            var bContent=false,contentKey;
            for(var key in header)
            {
                if(key.toLowerCase()=="content-type")
                {
                    bContent=true;
                    contentKey=key;
                    if(/multipart\/form-data/i.test(header[contentKey]))
                    {
                        bUpload=true;
                    }
                    break
                }
            }
            context.state.resultData="";
            var func;
            if(bUpload || context.state.bodyInfo.type==1)
            {
                if(bContent && context.state.bodyInfo.type==0)
                {
                    delete header[contentKey];
                }
                func=net.upload("POST",proxyUrl,body,header,null,1,bNet)
            }
            else
            {
                func=net.post(proxyUrl,body,header,null,1,bNet)
            }
            return func.then(function (result) {
                context.state.resHeader=result.header;
                context.state.status=String(result.status);
                context.state.second=(((new Date())-startDate)/1000).toFixed(3);
                context.state.type=typeof (result.data);
                if(context.state.type=="object" && !(result.data instanceof Blob))
                {
                    context.state.type="object"
                    context.state.resultData=result.data;
                    context.state.rawData=JSON.stringify(result.data);
                    var outParam=helper.resultSave(context.state.interface.outParam)
                    context.state.draw=helper.format(context.state.rawData,0,outParam,context.state.arrStatus).draw;
                    var obj=helper.format(context.state.rawData,1,outParam,context.state.arrStatus);
                    context.state.drawMix=obj.draw
                    context.state.errorCount=obj.error;
                }
                else if(result.header["content-type"] && result.header["content-type"].indexOf("image/")>-1)
                {
                    context.state.type="img";
                    context.state.rawData="";
                    context.state.imgUrl=baseUrl+path;
                    context.state.errorCount=0;
                }
                else
                {
                    context.state.rawData=result.data;
                    context.state.draw=result.data
                    context.state.drawMix=result.data;
                    context.state.errorCount=0;
                }
                if(context.state.interface.after.mode==0)
                {
                    if(context.state.globalAfter)
                    {
                        helper.runBefore(context.state.globalAfter,baseUrl,path,method,query,header,body)
                    }
                    helper.runBefore(context.state.interface.after.code,baseUrl,path,method,query,header,body)
                }
                else
                {
                    helper.runBefore(context.state.interface.after.code,baseUrl,path,method,query,header,body)
                }
                return {
                    code:200
                }
            })
        },
        save:function (context) {
            var method=context.state.interface.method;
            var baseUrl=$.trim(context.state.baseUrl);
            var path=$.trim(context.state.interface.url);
            if(!method || !baseUrl || !path)
            {
                return new Promise(function (resolve,reject) {
                    var obj={};
                    obj.code=0;
                    obj.msg="方法，url和路由地址不能为空!"
                    resolve(obj)
                });
            }
            var param=[];
            context.state.param.forEach(function (obj) {
                if(obj.name)
                {
                    var value=helper.handleValue(obj);
                    param.push({
                        name:obj.name,
                        remark:obj.remark,
                        value:value
                    })
                }
            })
            var query=[];
            context.getters.querySave.forEach(function (obj) {
                var value=obj.value;
                var value=helper.handleValue(obj);
                query.push({
                    name:obj.name,
                    must:obj.must,
                    remark:obj.remark,
                    value:value
                })
            })
            var header=[];
            context.getters.headerSave.forEach(function (obj) {
                header.push({
                    name:obj.name,
                    value:obj.value,
                    remark:obj.remark
                })
            })
            var body=[],bUpload=false;
            if(method=="POST" || method=="PUT")
            {
                if(context.state.bodyInfo.type==0)
                {
                    context.getters.bodySave.forEach(function (obj) {
                        if(obj.type==0)
                        {
                            var value=helper.handleValue(obj);
                            body.push({
                                name:obj.name,
                                type:0,
                                must:obj.must,
                                remark:obj.remark,
                                value:value
                            })
                        }
                        else if(obj.type==1)
                        {
                            body.push({
                                name:obj.name,
                                type:1,
                                must:obj.must,
                                remark:obj.remark
                            })
                            bUpload=true;
                        }
                    })
                    var contentTypeKey;
                    for(var key in header)
                    {
                        if(key.toLowerCase()=="content-type")
                        {
                            contentTypeKey=key;
                            break;
                        }
                    }
                    if(bUpload)
                    {
                        header[contentTypeKey?contentTypeKey:"content-type"]="multipart/form-data"
                    }
                }
            }
            var result=[];
            if(context.state.resultData)
            {
                for(var key in context.state.resultData)
                {
                    var resultObj=helper.findObj(context.state.interface.outParam,key);
                    helper.handleResultData(key,context.state.resultData[key],result,resultObj)
                }
            }
            var outInfo;
            if(context.state.type=="object")
            {
                outInfo={
                    type:0,
                    rawRemark:"",
                    rawMock:"",
                }
            }
            else
            {
                outInfo={
                    type:1,
                    rawRemark:context.state.interface.outInfo?context.state.interface.outInfo.rawRemark:"",
                    rawMock:context.state.interface.outInfo?context.state.interface.outInfo.rawMock:"",
                    jsonType:(context.state.resultData && (context.state.resultData instanceof Array))?1:0
                }
            }
            var obj={
                _id:context.state.interface._id?context.state.interface._id:null,
                method:method,
                url:path,
                queryParam:query,
                header:header,
                bodyParam:body,
                outParam:result,
                restParam:param,
                group:{
                    _id:context.state.interface.group._id
                },
                name:!context.state.interface._id?"":context.state.interface.name,
                remark:!context.state.interface._id?"":context.state.interface.remark,
                owner:!context.state.interface._id?"":context.state.interface.owner,
                editor:!context.state.interface._id?"":context.state.interface.editor,
                createdAt:!context.state.interface._id?"":context.state.interface.createdAt,
                updatedAt:!context.state.interface._id?"":context.state.interface.updatedAt,
                finish:context.state.interface.finish,
                outInfo:outInfo,
                before:context.state.interface.before,
                after:context.state.interface.after
            }
            if(method=="POST" || method=="PUT")
            {
                obj.bodyInfo=context.state.bodyInfo;
                if(obj.bodyInfo.type==1 && obj.bodyInfo.rawType==2 && obj.bodyInfo.rawJSON)
                {
                    obj.bodyInfo.rawJSON=helper.resultSave(obj.bodyInfo.rawJSON,1);
                }
            }
            session.set("newInterface",JSON.stringify(obj));
            var bMatchUrl=false;
            if(baseUrl!="MockServer")
            {
                for(var i=0;i<context.state.baseUrls.length;i++)
                {
                    var reg=new RegExp(context.state.baseUrls[i]);
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
            var pro=new Promise(function (resolve,reject) {
                resolve();
            })
            if(bMatchUrl)
            {
                return pro;
            }
            else
            {
                $.confirm("检测到当前根Url不在BaseUrl之内，是否自动添加",function () {
                    $.startHud();
                    net.put("/project/addurl",{
                        id:session.get("projectId"),
                        url:baseUrl
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("添加baseUrl成功",1);
                            return pro;

                        }
                        else
                        {
                            return pro;
                        }
                    })
                },function () {
                    return pro;
                })
            }
        },
    }
})
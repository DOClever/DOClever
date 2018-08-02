/**
 * Created by sunxin on 2017/2/22.
 */
var CryptoJS=require("crypto-js")
require("./Base64")
var mockjs=require("mockjs");
var config=require("common/js/config")
var helper={};
helper.methodColor=function (m) {
    if(m==1)
    {
        return "rgb(19,206,106)"
    }
    else if(m==2)
    {
        return "gray"
    }
    else
    {
        return "#50bfff";
    }
}

helper.initResultShow=function (data) {
    for(var i=0;i<data.length;i++)
    {
        Vue.set(data[i],"show",0);
        Vue.set(data[i],"drag",1);
        if(data[i].mock===undefined)
        {
            Vue.set(data[i],"mock","");
        }
        if(data[i].data)
        {
            arguments.callee(data[i].data);
        }
    }
}

helper.refreshInterface=function (localData,data) {
    for(var i=0;i<data.length;i++)
    {
        var obj=data[i];
        var bFind=false,show=0;
        for(var i1=0;i1<localData.length;i1++)
        {
            if(obj._id==localData[i1]._id)
            {
                bFind=true;
                show=localData[i1].show;
                break;
            }
        }
        if(bFind)
        {
            obj.show=show;
        }
        else
        {
            obj.show=0;
        }
        for(var j=0;j<data[i].data.length;j++)
        {
            data[i].data[j].select=0;
        }
    }
    return data;
}

helper.resultSave=function (data,json,globalVar) {
    var arr=[];
    for(var i=0;i<data.length;i++)
    {
        helper.eachResult(data[i],data[i].name===null?{type:3}:null,arr,json,globalVar);
    }
    return arr;
}

helper.eachResult=function (item,pItem,arr,json,globalVar) {
    if(item.name || (!item.name && pItem && pItem.type==3))
    {
        var obj={
            name:item.name,
            type:item.type,
            remark:item.remark,
            must:item.must,
            mock:globalVar?helper.handleGlobalVar(item.mock,globalVar):item.mock
        }
        if(json)
        {
            if(item.value)
            {
                if(item.value.type==0)
                {
                    var v=item.mock,bFind=false;
                    item.value.data.forEach(function (o) {
                        if(o.value==v)
                        {
                            bFind=true;
                        }
                    })
                    if(!bFind && v)
                    {
                        item.value.data.push({
                            value:v,
                            remark:""
                        });
                    }
                }
                obj.value=$.clone(item.value);
            }
            else
            {
                obj.value={
                    type:0,
                    status:"",
                    data:[{
                        value:item.mock,
                        remark:""
                    }]
                }
            }
        }
        if(item.status)
        {
            obj.status=item.status;
        }
        arr.push(obj)
        if(item.type==3 || item.type==4)
        {
            obj.data=[];
            for(var i=0;i<item.data.length;i++)
            {
                arguments.callee(item.data[i],item,obj.data,json,globalVar)
            }
        }
    }
}

helper.convertToJSON=function (data,obj,info,run) {
    var mock=function (data) {
        if(!data.mock || $.trim(data.mock)[0]!="@")
        {
            if(data.type==0)
            {
                if(data.mock)
                {
                    return $.trim(data.mock)
                }
                else
                {
                    return run?"":"mock"
                }
            }
            else if(data.type==1)
            {
                if(data.mock)
                {
                    return parseFloat($.trim(data.mock))
                }
                else
                {
                    return run?null:1
                }
            }
            else if(data.type==2)
            {
                if(data.mock)
                {
                    return Boolean(eval($.trim(data.mock)))
                }
                else
                {
                    return run?null:true
                }
            }
            else if(data.type==5)
            {
                if(data.mock)
                {
                    return $.trim(data.mock)
                }
                else
                {
                    return run?null:"mixed"
                }
            }
        }
        else
        {
            if(run)
            {
                return data.mock;
            }
            var str=$.trim(data.mock).substr(1);
            if(/^date/i.test(str))
            {
                return $.getNowFormatDate("yyyy-MM-dd hh:mm:ss");
            }
            else if(/^img/i.test(str))
            {
                var val=str.length==3?"":str.substring(4,str.length-1),arr;
                if(val)
                {
                    arr=val.split(",");
                }
                return "https://dummyimage.com/"+(arr?(arr[0]+"x"+arr[1]+"/"):"600x400/")+Math.round(Math.random()*999);
            }
            else if(/^num/i.test(str))
            {
                var val=str.substring(4,str.length-1);
                var arr=val.split(",");
                var gap=parseInt(arr[1])-parseInt(arr[0]);
                var temp=Math.round(Math.random()*gap+parseInt(arr[0]));
                if(data.type==1)
                {
                    return temp;
                }
                else
                {
                    return String(temp);
                }
            }
            else if(/^in/i.test(str))
            {
                var val=str.substring(3,str.length-1);
                var arr=val.split(",");
                var temp=Math.round(Math.random()*(arr.length-1));
                temp=arr[temp];
                if(data.type==0 || data.type==5)
                {
                    return String(temp);
                }
                else if(data.type==1)
                {
                    return parseFloat(temp);
                }
                else if(data.type==2)
                {
                    return Boolean(eval(temp));
                }
            }
            else if(/^arr/i.test(str))
            {
                var val=$.trim(str.substring(4,str.length-1));
                if(data.type==5)
                {
                    if(val.length>0)
                    {
                        var arr;
                        try
                        {
                            arr=eval("("+val+")");
                        }
                        catch (err)
                        {
                            arr=[];
                        }
                        if(!(arr instanceof  Array))
                        {
                            arr=[];
                        }
                        return arr;
                    }
                    else
                    {
                        return [];
                    }
                }
                else
                {
                    return null;
                }
            }
            else if(/^obj/i.test(str))
            {
                var val=$.trim(str.substring(4,str.length-1));
                if(data.type==5)
                {
                    if(val.length>0)
                    {
                        var obj;
                        try
                        {
                            obj=eval("("+val+")");
                        }
                        catch (err)
                        {
                            obj={};
                        }
                        if(!(obj instanceof  Object))
                        {
                            obj={};
                        }
                        return obj;
                    }
                    else
                    {
                        return {};
                    }
                }
                else
                {
                    return null;
                }
            }
            else if(/^null/i.test(str))
            {
                return null;
            }
            else if(/^code/i.test(str))
            {
                var val=$.trim(str.substring(5,str.length-1));
                if(info)
                {
                    try
                    {
                        var ret=(function (param,query,header,body,global) {
                            return eval("("+val+")");
                        })(info.param,info.query,info.header,info.body,info.global)
                        if(data.type==0)
                        {
                            return String(ret);
                        }
                        else if(data.type==1)
                        {
                            return parseFloat(ret);
                        }
                        else if(data.type==2)
                        {
                            return Boolean(eval(ret));
                        }
                        else if(data.type==5)
                        {
                            return ret;
                        }
                    }
                    catch (err)
                    {
                        console.log("execute err:"+err);
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
            else if(/^mj/i.test(str))
            {
                var val=$.trim(str.substring(3,str.length-1));
                if(val[0]=="@")
                {
                    return mockjs.mock(val);
                }
                else
                {
                    var obj=eval("("+val+")");
                    if(typeof(obj)=="object")
                    {
                        var objNew={};
                        for(var key in obj)
                        {
                            objNew["mock|"+key]=obj[key];
                        }
                        var ret=mockjs.mock(objNew);
                        for(var key in ret)
                        {
                            return ret[key];
                        }

                    }
                    else
                    {
                        return val;
                    }
                }
            }
        }
        return data.mock?$.trim(data.mock):null;
    }
    var func=function (data,obj) {
        if(data.type==0)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==1)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==2)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==3)
        {
            var objTemp=[];
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(objTemp);
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=objTemp;
            }
            var str=$.trim(data.mock).substr(1),count=1;
            if(/^count/i.test(str))
            {
                var val=str.substring(6,str.length-1);
                var arr=val.split(",");
                var gap=parseInt(arr[1])-parseInt(arr[0]);
                var temp=Math.round(Math.random()*gap+parseInt(arr[0]));
                count=temp;
            }
            for(var j=0;j<count;j++)
            {
                for(var i=0;i<data.data.length;i++)
                {
                    func(data.data[i],objTemp);
                }
            }
        }
        else if(data.type==4)
        {
            var objTemp={};
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(objTemp);
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=objTemp;
            }
            for(var i=0;i<data.data.length;i++)
            {
                func(data.data[i],objTemp);
            }
        }
        else if(data.type==5)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
    }
    for(var i=0;i<data.length;i++)
    {
        func(data[i],obj);
    }
}

helper.format=function (txt,mix,outParam,status) {
    var indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;';
    if(/^\s*$/.test(txt)){
        alert('数据为空,无法格式化! ');
        return;
    }
    var data;
    if(typeof(txt)=="string")
    {
        try{
            txt=txt.replace(/\<|\>|\s/g,function (str) {
                if(str=="<")
                {
                    return "&lt;"
                }
                else if(str==">")
                {
                    return "&gt;"
                }
                else
                {
                    return "&nbsp;"
                }
            })
            var data=eval('('+txt+')');
        }
        catch(e){
            $.tip("数据源语法错误,格式化失败! ",0);
            return;
        };
    }
    else
    {
        data=txt;
    }
    var result=outParam;
    var draw=[],last=false,line='',nodeCount=0,maxDepth=0,errorCount=0;
    var checkType=function (value,raw,obj) {
        if(value===null || value==undefined || raw.type==5)
        {
            return;
        }
        else if(typeof(value)=="string" && raw.type==0)
        {
            return;
        }
        else if(typeof(value)=="number" && raw.type==1)
        {
            return;
        }
        else if(typeof(value)=="boolean" && raw.type==2)
        {
            return;
        }
        else if((typeof(value)=="object" && (value instanceof Array)) && raw.type==3)
        {
            return;
        }
        else if((typeof(value)=="object" && !(value instanceof Array)) && raw.type==4)
        {
            return;
        }
        errorCount++;
        obj.title+="返回数据类型和文档模型不匹配。 "
    }
    var checkExist=function (value,raw,obj) {
        if(typeof(raw)=="object" && !(raw instanceof Array) && raw.type!=5)
        {
            for(var i=0;i<raw.data.length;i++)
            {
                if(raw.data[i].must)
                {
                    var bFind=false;
                    for(var key in value)
                    {
                        if(key==raw.data[i].name)
                        {
                            bFind=true;
                        }
                    }
                    if(!bFind && raw.data[i].name)
                    {
                        errorCount++;
                        obj.title+="必有字段"+raw.data[i].name+"在返回数据里不存在。 ";
                    }
                }
            }
        }
        else if(typeof(raw)=="object" && (raw instanceof Array))
        {
            for(var i=0;i<raw.length;i++)
            {
                if(raw[i].must)
                {
                    var bFind=false;
                    for(var key in value)
                    {
                        if(key==raw[i].name)
                        {
                            bFind=true;
                        }
                    }
                    if(!bFind && raw[i].name)
                    {
                        errorCount++;
                        obj.title+="必有字段"+raw[i].name+"在返回数据里不存在。 ";
                    }
                }
            }
        }
    }
    var notify=function(name,value,isLast,indent,formObj,raw,match,root){
        nodeCount++;
        for (var i=0,tab='';i<indent;i++ ){
            tab+=indentChar;
        }
        maxDepth=++indent;
        if(value&&value.constructor==Array){
            var remark="",errObj={title:""};
            if(raw && !root && match)
            {
                remark=getRemark(name,raw);
                checkType(value,raw,errObj);
            }
            var timestamp=new Date().getTime()+i;
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'')+' <span style="border: 1px gray solid;cursor: pointer;color: #50a3ff;'+((formObj || root)?"":"margin-left: -22px")+'" jsonflag arrsize="'+value.length+'" timestamp="'+timestamp+'" '+(errObj.title?('err="'+errObj.title+'"'):'')+'>-</span> '+'<span jsonleft>[</span>'+line+remark);
            for (var i=0;i<value.length;i++){
                var raw1=getData(i,raw)
                notify(i,value[i],i==value.length-1,indent,false,raw1,errObj.title?0:1,false,status);
            }
            draw.push(tab+'<span timestamp="'+timestamp+'"></span>'+']'+(isLast?line:(','+line)));
        }else   if(value&&typeof value=='object'){
            var remark="",errObj={title:""},bMatch=true;
            if(raw && !root && match)
            {
                remark=getRemark(name,raw)
                checkType(value,raw,errObj);
                if(!errObj.title)
                {
                    checkExist(value,raw,errObj)
                }
                else
                {
                    bMatch=false;
                }
            }
            else if(raw && root && match)
            {
                checkExist(value,raw,errObj)
            }
            var timestamp=new Date().getTime()+i;
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'')+' <span style="border: 1px gray solid;cursor: pointer;color: #50a3ff;'+((formObj || root)?"":"margin-left: -22px")+'" jsonflag timestamp="'+timestamp+'" '+(errObj.title?('err="'+errObj.title+'"'):'')+'>-</span> '+'<span jsonleft>{</span>'+line+remark);
            var len=0,i=0;
            for(var key in value){
                len++;
            }
            for(var key in value){
                var raw1=getData(key,raw)
                notify(key,value[key],++i==len,indent,true,raw1,bMatch?1:0,false,status);
            }
            draw.push(tab+'<span timestamp="'+timestamp+'"></span>'+'}'+(isLast?line:(','+line)))
        }else{
            var remark="",errObj={title:""},statusInfo=null;
            if(raw && !root && match)
            {
                remark=getRemark(name,raw);
                checkType(value,raw,errObj);
            }
            if(typeof value=='string'){
                statusInfo=getStatus(raw,value,status);
                value='"'+"<span style='font-weight: bold'>"+value+"</span>"+'"';
            }
            else if(typeof(value)=="boolean")
            {
                value="<span style='font-weight: bold'>"+(value?"true":"false")+"</span>"
            }
            else
            {
                statusInfo=getStatus(raw,value,status);
                value="<span style='font-weight: bold'>"+value+"</span>"
            }
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'')+"<span style='color: #1daf42' "+(errObj.title?('err="'+errObj.title+'"'):'')+">"+value+"</span>"+(isLast?'':',')+line+remark+(statusInfo?("<span style='color: green;'>(状态码:"+statusInfo.remark+")</span>"):""));
        };
    };
    var getStatus=function (raw,value,status) {
        if(!raw || !status || !raw.status)
        {
            return null;
        }
        var objStatus=null;
        status.forEach(function (obj) {
            if(obj.id==raw.status)
            {
                objStatus=obj;
            }
        })
        if(objStatus)
        {
            var remark="";
            objStatus.data.forEach(function (obj) {
                if(obj.key==value)
                {
                    remark=obj.remark;
                }
            })
            if(!remark)
            {
                return null
            }
            else
            {
                return {
                    id:objStatus.id,
                    remark:remark,
                    value:value
                }
            }
        }
        else
        {
            return null;
        }
    }
    var getData=function (key,raw) {
        if(!raw)
        {
            return null;
        }
        if(raw instanceof  Array)
        {
            if(typeof(key)=="string")
            {
                for(var i=0;i<raw.length;i++)
                {
                    if(raw[i].name && raw[i].name.toLowerCase()==key.toLowerCase())
                    {
                        return raw[i];
                    }
                }
            }
            else if(typeof(key)=="number")
            {
                return raw[key];
            }
        }
        else
        {
            if(!raw.data)
            {
                return null;
            }
            if(typeof(key)=="string")
            {
                for(var i=0;i<raw.data.length;i++)
                {
                    if(raw.data[i].name && raw.data[i].name.toLowerCase()==key.toLowerCase())
                    {
                        return raw.data[i];
                    }
                }
            }
            else if(typeof(key)=="number")
            {
                return raw.data[key];
            }
        }
        return null;
    }
    var getRemark=function (name,raw) {
        var type=["String","Number","Boolean","Array","Object","Mixed"];
        if(!raw)
        {
            return "";
        }
        return "<span style='color: gray'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//类型："+type[raw.type]+"&nbsp;&nbsp;"+(raw.must?"必有字段":"可有字段")+"&nbsp;&nbsp;备注："+(raw.remark?raw.remark:"无")+"</span>";
    }
    var isLast=true,indent=0;
    notify('',data,isLast,indent,false,mix?result:null,1,1,status);
    setTimeout(function () {
        var arr=document.querySelectorAll("span[jsonflag]");
        for(var i=0;i<arr.length;i++)
        {
            arr[i].onclick=function () {
                var timestamp=this.getAttribute("timestamp");
                var ele=this.parentNode.nextSibling;
                var bExpand;
                var left=this.parentNode.querySelector("span[jsonleft]");
                if(this.innerText=="-")
                {
                    this.innerText="+"
                    bExpand=false;
                    if(left.innerText.indexOf("{")>-1)
                    {
                        left.innerText="{...}"
                    }
                    else
                    {
                        left.innerText="["+this.getAttribute("arrsize")+"]"
                    }
                    while(ele)
                    {
                        ele.style.display="none";
                        var span=ele.querySelector("span[timestamp='"+timestamp+"']")
                        if(span)
                        {
                            return;
                        }
                        ele=ele.nextSibling;
                    }
                }
                else
                {
                    this.innerText="-"
                    bExpand=true;
                    if(left.innerText.indexOf("{")>-1)
                    {
                        left.innerText="{"
                    }
                    else
                    {
                        left.innerText="["
                    }
                    while(ele)
                    {
                        ele.style.display="block";
                        var span=ele.querySelector("span[timestamp]")
                        if(span)
                        {
                            if(span.getAttribute("timestamp")==timestamp)
                            {
                                return;
                            }
                            else
                            {
                                if(span.innerText=="+")
                                {
                                    var timestamp1=span.getAttribute("timestamp");
                                    ele=ele.nextSibling;
                                    while(1)
                                    {
                                        var span1=ele.querySelector("span[timestamp]");
                                        if(span1 && span1.getAttribute("timestamp")==timestamp1)
                                        {
                                            break;
                                        }
                                        ele=ele.nextSibling
                                    }
                                }
                            }
                        }
                        ele=ele.nextSibling;
                    }
                }
            }
        }
    },500);
    return {
        draw:draw,
        error:errorCount
    };
}

helper.handleResultData=function (name,data,result,originObj,show,input,bArr) {
    name=typeof(name)=="string"?name:null;
    if(typeof(data)=="string")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:0,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:data):data,
            drag:1
        }
        if(show)
        {
            obj.show=0
        }
        if(input)
        {
            obj.value={
                type:0,
                status:"",
                data:[
                    {
                        value:obj.mock,
                        remark:""
                    }
                ]
            }
        }
        result.push(obj)
    }
    else if(typeof(data)=="number")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:1,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:String(data)):String(data),
            drag:1
        }
        if(show)
        {
            obj.show=0
        }
        if(input)
        {
            obj.value={
                type:0,
                status:"",
                data:[
                    {
                        value:obj.mock,
                        remark:""
                    }
                ]
            }
        }
        result.push(obj)
    }
    else if(typeof(data)=="boolean")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:2,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:String(data)):String(data),
            drag:1
        }
        if(show)
        {
            obj.show=0
        }
        if(input)
        {
            obj.value={
                type:0,
                status:"",
                data:[
                    {
                        value:obj.mock,
                        remark:""
                    }
                ]
            }
        }
        result.push(obj)
    }
    else  if(typeof(data)=="object" && (data instanceof Array))
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:3,
            remark:originObj?originObj.remark:"",
            data:[],
            mock:"",
            drag:1
        };
        if(show)
        {
            obj.show=0
        }
        result.push(obj);
        if(data.length>0)
        {
            if(bArr)
            {
                for(var i=0;i<data.length;i++)
                {
                    var resultObj=originObj?((originObj.data && originObj.data.length>0)?originObj.data[i]:null):null;
                    arguments.callee(null,data[i],obj.data,resultObj,show,input,bArr)
                }
            }
            else
            {
                var resultObj=originObj?((originObj.data && originObj.data.length>0)?originObj.data[0]:null):null;
                arguments.callee(null,data[0],obj.data,resultObj,show,input,bArr)
            }
        }
    }
    else  if(typeof(data)=="object" && data===null)
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:5,
            remark:originObj?originObj.remark:"",
            data:[],
            mock:"",
            drag:1
        };
        if(show)
        {
            obj.show=0
        }
        result.push(obj);
        if(input)
        {
            obj.value={
                type:0,
                status:"",
                data:[

                ]
            }
        }
    }
    else if(typeof(data)=="object" && !(data instanceof Array))
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:4,
            remark:originObj?originObj.remark:"",
            data:[],
            mock:"",
            drag:1
        };
        if(show)
        {
            obj.show=0
        }
        result.push(obj);
        for(var key in data)
        {
            var resultObj=helper.findObj(originObj?originObj.data:null,key);
            arguments.callee(key,data[key],obj.data,resultObj,show,input,bArr)
        }
    }
    else
    {
        return;
    }
}
helper.findObj=function (data,key) {
    if(!data || !key)
    {
        return null;
    }
    for(var i=0;i<data.length;i++)
    {
        if(data[i].name==key)
        {
            return data[i];
        }
    }
    return null;
}

helper.findValue=function (data,key) {
    if(!data || !key)
    {
        return null;
    }
    for(var i=0;i<data.length;i++)
    {
        if(data[i].name==key)
        {
            return {
                value:data[i].value,
                index:i,
                must:data[i].must,
                remark:data[i].remark,
                enable:data[i].enable,
                type:data[i].type,
                encrypt:data[i].encrypt?$.clone(data[i].encrypt):null
            };
        }
    }
    return null;
}

helper.mock=function (data,info) {
    if(!data || $.trim(data)[0]!="@")
    {
        if(data)
        {
            return $.trim(data)
        }
        else
        {
            return "mock"
        }
    }
    else
    {
        var str=$.trim(data).substr(1);
        if(/^date/i.test(str))
        {
            return $.getNowFormatDate("yyyy-MM-dd hh:mm:ss");
        }
        else if(/^img/i.test(str))
        {
            var val=str.length==3?"":str.substring(4,str.length-1),arr;
            if(val)
            {
                arr=val.split(",");
            }
            return "https://dummyimage.com/"+(arr?(arr[0]+"x"+arr[1]+"/"):"600x400/")+Math.round(Math.random()*999);
        }
        else if(/^num/i.test(str))
        {
            var val=str.substring(4,str.length-1);
            var arr=val.split(",");
            var gap=parseInt(arr[1])-parseInt(arr[0]);
            var temp=Math.round(Math.random()*gap+parseInt(arr[0]));
            return String(temp);
        }
        else if(/^in/i.test(str))
        {
            var val=str.substring(3,str.length-1);
            var arr=val.split(",");
            var temp=Math.round(Math.random()*(arr.length-1));
            temp=arr[temp];
            return String(temp);
        }
        else if(/^arr/i.test(str))
        {
            var val=$.trim(str.substring(4,str.length-1));
            if(val.length>0)
            {
                return val;
            }
            else
            {
                return "[]";
            }
        }
        else if(/^obj/i.test(str))
        {
            var val=$.trim(str.substring(4,str.length-1));
            if(val.length>0)
            {
                return val;
            }
            else
            {
                return "{}";
            }
        }
        else if(/^null/i.test(str))
        {
            return "null";
        }
        else if(/^code/i.test(str))
        {
            var val=$.trim(str.substring(5,str.length-1));
            if(info)
            {
                try
                {
                    return (function (param,query,header,body,global) {
                        return eval("("+val+")");
                    })(info.param,info.query,info.header,info.body,info.global)
                }
                catch (err)
                {
                    console.log("execute err:"+err);
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        else if(/^mj/i.test(str))
        {
            var val=$.trim(str.substring(3,str.length-1));
            if(val[0]=="@")
            {
                return mockjs.mock(val);
            }
            else
            {
                var obj=eval("("+val+")");
                if(typeof(obj)=="object")
                {
                    var objNew={};
                    for(var key in obj)
                    {
                        objNew["mock|"+key]=obj[key];
                    }
                    var ret=mockjs.mock(objNew);
                    for(var key in ret)
                    {
                        return ret[key];
                    }

                }
                else
                {
                    return val;
                }
            }
        }
    }
    return data?$.trim(data):null;
}

helper.isSalt=function (type) {
    var arr=["AES","TripleDES","DES","Rabbit","RC4","RC4Drop"];
    if(arr.indexOf(type)>-1)
    {
        return true;
    }
    else
    {
        return false;
    }
}

helper.encrypt=function (type,val,salt) {
    if(!val)
    {
        return ""
    }
    var arr=["Base64","MD5","SHA-1","SHA-256","SHA-512","SHA-3","RIPEMD-160"];
    var arrFunc=[BASE64.encoder,CryptoJS.MD5,CryptoJS.SHA1,CryptoJS.SHA256,CryptoJS.SHA512,CryptoJS.SHA3,CryptoJS.RIPEMD160]
    var arrSalt=["AES","TripleDES","DES","Rabbit","RC4","RC4Drop"];
    var arrSaltFunc=[CryptoJS.AES.encrypt,CryptoJS.TripleDES.encrypt,CryptoJS.DES.encrypt,CryptoJS.Rabbit.encrypt,CryptoJS.RC4.encrypt,CryptoJS.RC4Drop.encrypt];
    var index=arr.indexOf(type);
    if(index>-1)
    {
        return arrFunc[index](val).toString();
    }
    index=arrSalt.indexOf(type);
    if(index>-1)
    {
        return arrSaltFunc[index](val,salt).toString();
    }
    return val;
}

helper.runBefore=function (code,url,path,method,query,header,body,param) {
    var Base64=BASE64.encoder,MD5=CryptoJS.MD5,SHA1=CryptoJS.SHA1,SHA256=CryptoJS.SHA256,SHA512=CryptoJS.SHA512,SHA3=CryptoJS.SHA3,RIPEMD160=CryptoJS.RIPEMD160,AES=CryptoJS.AES.encrypt,TripleDES=CryptoJS.TripleDES.encrypt,DES=CryptoJS.DES.encrypt,Rabbit=CryptoJS.Rabbit.encrypt,RC4=CryptoJS.RC4.encrypt,RC4Drop=CryptoJS.RC4Drop.encrypt;
    try
    {
        if(code)
        {
            eval(code);
        }
    }
    catch (err)
    {
        console.log("Before Error:"+err);
    }
}

helper.runAfter=function (code,status,header,data) {
    try
    {
        if(code)
        {
            eval(code);
        }
    }
    catch (err)
    {
        console.log("After Error:"+err);
    }
}

helper.handleValue=function (obj) {
    var value=obj.value;
    if(obj.selValue)
    {
        if(value)
        {
            if(value.type==0)
            {
                var v=obj.selValue,bFind=false;
                value.data.forEach(function (o) {
                    if(o.value==v)
                    {
                        bFind=true;
                    }
                })
                if(!bFind)
                {
                    value.data.push({
                        value:v,
                        remark:""
                    });
                }
            }
        }
        else
        {
            value={
                type:0,
                status:"",
                data:[{
                    value:obj.selValue,
                    remark:""
                }]
            }
        }
    }
    else
    {
        if(!value)
        {
            value={
                type:0,
                status:"",
                data:[]
            }
        }
    }
    return value;
}

helper.handleMockInfo=function (type,param,query,header,body,state) {
    var info={
        param:{},
        query:{},
        header:{},
        body:{},
        global:{}
    };
    param.forEach(function (obj) {
        if(obj.name)
        {
            if(type==0)
            {
                info.param[obj.name]="";
            }
            else
            {
                info.param[obj.name]=obj.selValue;
            }
        }
    })
    query.forEach(function (obj) {
        if(obj.name)
        {
            if(type==0)
            {
                info.query[obj.name]="";
            }
            else
            {
                info.query[obj.name]=obj.selValue;
            }
        }
    })
    header.forEach(function (obj) {
        if(obj.name)
        {
            info.header[obj.name]=obj.value;
        }
    })
    if(body && (body instanceof Array))
    {
        body.forEach(function (obj) {
            if(obj.name)
            {
                if(type==0)
                {
                    info.body[obj.name]="";
                }
                else
                {
                    info.body[obj.name]=obj.selValue;
                }
            }
        })
    }
    else
    {
        info.body=body;
    }
    if(state && (state.interfaceEdit || state.interface))
    {
        info.global={
            name:type==0?(state.interfaceEdit?state.interfaceEdit.name:state.interface.name):state.interface.name,
            baseurl:type==0?"":state.baseurl,
            path:type==0?(state.interfaceEdit?state.interfaceEdit.url:state.interface.url):state.interface.url,
            method:type==0?(state.interfaceEdit?state.interfaceEdit.method:state.interface.method):state.interface.method
        }
    }
    else
    {
        info.global={};
    }
    return info;
}

helper.getSelection=function () {
    var node=document.getElementById("testContent");
    var oRange = window.getSelection().rangeCount>0?window.getSelection().getRangeAt(0):null;
    if(!oRange)
    {
        return null;
    }
    var ele=oRange.startContainer,bMatch=false;
    while(ele && ele.tagName!="body")
    {
        if(ele==node)
        {
            bMatch=true;
            break;
        }
        else
        {
            ele=ele.parentNode;
        }
    }
    if(!bMatch)
    {
        return null;
    }
    ele=oRange.endContainer,bMatch=false;
    while(ele && ele.tagName!="body")
    {
        if(ele==node)
        {
            bMatch=true;
            break;
        }
        else
        {
            ele=ele.parentNode;
        }
    }
    if(!bMatch)
    {
        return null;
    }
    return oRange;
}

helper.handleTestInterface=function (inter,data,status,bRun) {
    inter.url=data.url;
    inter.method=data.method;
    inter.finish=data.finish;
    inter.remark=data.remark;
    inter.updatedAt=data.updatedAt;
    var retIndex=0;
    data.param.forEach(function (obj,index) {
        var bFindInter=false;
        if(inter.paramId==obj.id || (index==0 && !inter.paramId))
        {
            retIndex=index;
            bFindInter=true;
        }
        if(obj.before) {
            if (typeof(obj.before) != "object") {
                obj.before ={
                    mode:0,
                    code:obj.before
                }
            }
        }
        else
        {
            obj.before ={
                mode:0,
                code:""
            }
        }
        if(obj.after)
        {
            if (typeof(obj.after) != "object") {
                obj.after ={
                    mode:0,
                    code:obj.after
                }
            }
        }
        else
        {
            obj.after ={
                mode:0,
                code:""
            }
        }
        Vue.set(obj,"encrypt",(bFindInter && inter.encrypt)?inter.encrypt:{
            salt:"",
            type:""
        })
        obj.restParam.forEach(function (item) {
            var obj;
            inter.restParam.forEach(function (item1) {
                if(item.name==item1.name)
                {
                    obj=item1;
                }
            })
            if(obj && bFindInter)
            {
                for(var key in obj)
                {
                    item[key]=obj[key];
                }
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
                    status.forEach(function (obj) {
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
        if(bFindInter)
        {
            if(!inter.example && !bRun)
            {
                inter.restParam=obj.restParam;
            }
            else
            {
                obj.restParam=inter.restParam;
            }
        }
        obj.queryParam.forEach(function (item) {
            var obj;
            inter.queryParam.forEach(function (item1) {
                if(item.name==item1.name)
                {
                    obj=item1;
                }
            })
            if(obj && bFindInter)
            {
                for(var key in obj)
                {
                    item[key]=obj[key];
                }
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
                    status.forEach(function (obj) {
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
        if(bFindInter)
        {
            if(!inter.example && !bRun)
            {
                inter.queryParam=obj.queryParam;
            }
            else
            {
                obj.queryParam=inter.queryParam;
            }
        }
        obj.header.forEach(function (item) {
            var obj;
            inter.header.forEach(function (item1) {
                if(item.name==item1.name)
                {
                    obj=item1;
                }
            })
            if(obj && bFindInter)
            {
                for(var key in obj)
                {
                    item[key]=obj[key];
                }
            }
            else
            {
                Vue.set(item,"enable",1);
            }
        });
        if(bFindInter)
        {
            if(!inter.example && !bRun)
            {
                inter.header=obj.header;
            }
            else
            {
                obj.header=inter.header;
            }
        }
        if(obj.bodyParam)
        {
            obj.bodyParam.forEach(function (item) {
                var obj;
                inter.bodyParam.forEach(function (item1) {
                    if(item.name==item1.name && item.type==item1.type)
                    {
                        obj=item1;
                    }
                })
                if(obj && bFindInter)
                {
                    for(var key in obj)
                    {
                        item[key]=obj[key];
                    }
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
                        status.forEach(function (obj) {
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
            if(bFindInter)
            {
                if(!inter.example && !bRun)
                {
                    inter.bodyParam=obj.bodyParam;
                }
                else
                {
                    obj.bodyParam=inter.bodyParam;
                }
            }
        }
        else
        {
            inter.bodyParam=[];
        }
        if(data.method=="GET" || data.method=="DELETE")
        {
            delete inter.bodyInfo;
        }
        else
        {
            if(!inter.bodyInfo)
            {
                inter.bodyInfo={};
            }
            if(obj.bodyInfo.rawText===undefined)
            {
                Vue.set(obj.bodyInfo,"rawText","");
            }
            if(obj.bodyInfo.rawTextRemark===undefined)
            {
                Vue.set(obj.bodyInfo,"rawTextRemark","");
            }
            if(obj.bodyInfo.rawFileRemark===undefined)
            {
                Vue.set(obj.bodyInfo,"rawFileRemark","");
            }
            if(obj.bodyInfo.rawJSON==undefined)
            {
                Vue.set(obj.bodyInfo,"rawJSON",[]);
            }
            var bFind=false;
            for(var i=0;i<obj.header.length;i++)
            {
                var obj1=obj.header[i];
                if(obj1.name.toLowerCase()=="content-type" && obj1.value.toLowerCase().indexOf("application/json")>-1)
                {
                    bFind=true;
                    break;
                }
            }
            if(bFind && obj.bodyInfo.rawText)
            {
                var obj1;
                try
                {
                    obj1=JSON.parse(obj.bodyInfo.rawText);
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
                    obj.bodyInfo.rawJSON=result;
                    obj.rawText="";
                    obj.rawType=2;
                }
            }
            if(!bFindInter)
            {
                return;
            }
            else if(bFindInter && (inter.example || bRun))
            {
                obj.bodyInfo=inter.bodyInfo;
            }
            else
            {
                for(var key in obj.bodyInfo)
                {
                    if(key!="rawJSON")
                    {
                        inter.bodyInfo[key]=obj.bodyInfo[key];
                    }
                }
            }
            if(obj.bodyInfo.type==1 && obj.bodyInfo.rawType==2)
            {
                if(inter.bodyInfo.rawJSON)
                {
                    mapJSON(inter.bodyInfo.rawJSON,obj.bodyInfo.rawJSON)
                    inter.bodyInfo.rawJSON=obj.bodyInfo.rawJSON;
                }
                else
                {
                    inter.bodyInfo.rawJSON=obj.bodyInfo.rawJSON
                }
            }
        }
        function mapJSON(originData,data) {
            for (var i = 0; i < data.length; i++) {
                _mapJSON(originData, data[i]);
            }
        }
        function _mapJSON(originObj,obj) {
            var objFind;
            originObj.forEach(function (item) {
                if(item.type==obj.type && item.name==obj.name)
                {
                    objFind=item;
                }
            })
            if(objFind)
            {
                if((obj.type==3 || obj.type==4))
                {
                    for(var i=0;i<obj.data.length;i++)
                    {
                        arguments.callee(objFind.data?objFind.data:[],obj.data[i])
                    }
                }
                else
                {
                    for(var key in objFind)
                    {
                        obj[key]=objFind[key];
                    }
                }
            }
        }
    })
    return retIndex;
}

helper.runTest=async function (obj,global,test,root,opt,id) {
    root.output+="开始运行接口："+obj.name+"<br>"
    if(id!=undefined)
    {
        window.vueObj.$store.state.event.$emit("testRunStatus","interfaceStart",id);
    }
    var name=obj.name
    var method=obj.method;
    var baseUrl=obj.baseUrl=="defaultUrl"?global.baseUrl:obj.baseUrl;
    var globalVar={};
    global.baseUrls.forEach(function (obj) {
        if(obj.url==baseUrl && obj.env)
        {
            obj.env.forEach(function (obj) {
                globalVar[obj.key]=obj.value;
            })
        }
    })
    if(!baseUrl)
    {
        root.output+="baseUrl为空，请设置baseUrl<br>"
        return {};
    }
    var path=obj.url;
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
    path=helper.handleGlobalVar(path,globalVar);
    if(path.substr(0,2)=="//")
    {
        path=path.substr(1);
    }
    var objParam=$.clone(obj.restParam);
    var param={};
    objParam.forEach(function (obj) {
        param[obj.name]=helper.handleGlobalVar(obj.selValue,globalVar);
    })
    if(obj.pullInject)
    {
        if(opt && opt.param)
        {
            for(var key in opt.param)
            {
                var val=opt.param[key];
                param[key]=val;
            }
        }
    }
    var query={};
    obj.queryParam.forEach(function (obj) {
        if(!obj.name || !obj.enable)
        {
            return;
        }
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
    if(obj.pullInject)
    {
        if(opt && opt.query)
        {
            Object.assign(query,opt.query);
        }
    }
    var header={};
    obj.header.forEach(function (obj) {
        if(!obj.name || !obj.enable)
        {
            return;
        }
        if(obj.encrypt && obj.encrypt.type)
        {
            var value=helper.encrypt(obj.encrypt.type,helper.handleGlobalVar(obj.value,globalVar),obj.encrypt.salt);
            var key=obj.name;
            header[key]=helper.handleGlobalVar(value,globalVar);
        }
        else
        {
            header[obj.name]=helper.handleGlobalVar(obj.value,globalVar);
        }
    })
    if(obj.pullInject)
    {
        if(opt && opt.header)
        {
            for(var key in opt.header)
            {
                header[key]=opt.header[key];
            }
        }
    }
    var body={},bUpload=false,reqBody={};
    if(method=="POST" || method=="PUT" || method=="PATCH")
    {
        if(obj.bodyInfo.type==0)
        {
            for(var i=0;i<obj.bodyParam.length;i++)
            {
                var obj1=obj.bodyParam[i];
                if(!obj1.name || !obj1.enable)
                {
                    return;
                }
                if(obj1.type==0)
                {
                    if(obj1.encrypt && obj1.encrypt.type)
                    {
                        var value=helper.encrypt(obj1.encrypt.type,helper.handleGlobalVar(obj1.selValue,globalVar),obj1.encrypt.salt);
                        var key=obj1.name;
                        if(obj1.encrypt.key)
                        {
                            key=helper.encrypt(obj1.encrypt.type,key,obj1.encrypt.salt);
                        }
                        body[key]=value;
                    }
                    else
                    {
                        body[obj1.name]=helper.handleGlobalVar(obj1.selValue,globalVar);
                    }
                }
                else if(obj1.type==1)
                {
                    var startDate=new Date();
                    var file=await (new Promise(function (resolve,reject) {
                        var child=$.showBox(window.vueObj,require("../../project/test/component/testUploadFile.vue"),{
                            name:name,
                            url:path,
                            keyName:obj1.name,
                            remark:obj1.remark
                        });
                        child.$on("save",function (obj) {
                            resolve(obj);
                        })
                        child.$refs.box.$on("close",function (obj) {
                            resolve({
                                files:[]
                            });
                        })
                    }))
                    if(file.files.length>0)
                    {
                        body[obj1.name]=file.files[0];
                        bUpload=true;
                    }
                    else
                    {
                        body[obj1.name]="";
                    }
                }
            }
            reqBody=body;
        }
        else
        {
            if(obj.bodyInfo.rawType==0)
            {
                var encryptType=obj.encrypt.type;
                if(encryptType)
                {
                    body=helper.encrypt(encryptType,helper.handleGlobalVar(obj.bodyInfo.rawText,globalVar),obj.encrypt.salt)
                }
                else
                {
                    body=helper.handleGlobalVar(obj.bodyInfo.rawText,globalVar);
                }
            }
            else if(obj.bodyInfo.rawType==2)
            {
                var obj1=obj.bodyInfo.rawJSONType==0?{}:[];
                var result=helper.resultSave(obj.bodyInfo.rawJSON,0,globalVar);
                helper.convertToJSON(result,obj1,null,1);
                body=obj1;
            }
            else
            {
                var startDate=new Date();
                var file=await (new Promise(function (resolve,reject) {
                    var child=$.showBox(window.vueObj,require("../../project/test/component/testUploadFile.vue"),{
                        name:name,
                        url:path,
                        keyName:obj.name,
                        remark:obj.remark
                    });
                    child.$on("save",function (obj) {
                        if(obj.files.length==0)
                        {
                            resolve("");
                            return;
                        }
                        var file=obj.files[0];
                        var read=new FileReader();
                        var loading;
                        read.onloadstart=function () {
                            loading=window.vueObj.$loading({fullscreen:true});
                        }
                        read.onload=function () {
                            loading.close();
                            resolve(read.result);
                        }
                        read.onerror=function () {
                            loading.close();
                            reject({
                                code:0,
                                msg:"文件读取错误"
                            })
                        }
                        read.readAsArrayBuffer(file);
                    })
                    child.$refs.box.$on("close",function (obj) {
                        resolve("");
                    })
                }))
                body=file;
            }
            reqBody=body;
        }
    }
    if(obj.pullInject)
    {
        if((method=="POST" || method=="PUT" || method=="PATCH") && obj.bodyInfo)
        {
            if(obj.bodyInfo.type==0)
            {
                if(opt && opt.body)
                {
                    Object.assign(body,opt.body);
                }
                reqBody=body;
            }
            else
            {
                if(obj.bodyInfo.rawType==0)
                {
                    if(opt && opt.body!==undefined)
                    {
                        body=opt.body;
                    }
                    reqBody=body;
                }
                else if(obj.bodyInfo.rawType==2)
                {
                    if(opt && opt.body)
                    {
                        if(opt.body instanceof Array)
                        {
                            body=opt.body;
                        }
                        else
                        {
                            for(var key in opt.body)
                            {
                                var val=opt.body[key];
                                var arr=key.split(".");
                                if(arr.length>1)
                                {
                                    var obj1=body;
                                    for(var i=0;i<arr.length;i++)
                                    {
                                        var key1=arr[i];
                                        if(i!=arr.length-1)
                                        {
                                            if(obj1[key1]!==undefined)
                                            {
                                                obj1=obj1[key1];
                                            }
                                            else
                                            {
                                                obj1=obj1[key1]={};
                                            }
                                        }
                                        else
                                        {
                                            obj1[key1]=val;
                                        }
                                    }
                                }
                                else
                                {
                                    body[key]=val;
                                }
                            }
                        }
                    }
                    reqBody=body;
                    body=JSON.stringify(body);
                }
            }
        }
    }
    if(obj.before.mode==0)
    {
        if(global.before)
        {
            helper.runBefore(global.before,baseUrl,path,method,query,header,body,param)
        }
        helper.runBefore(obj.before.code,baseUrl,path,method,query,header,body,param)
    }
    else
    {
        helper.runBefore(obj.before.code,baseUrl,path,method,query,header,body,param)
    }
    if(!obj.pullInject)
    {
        if(opt && opt.param)
        {
            for(var key in opt.param)
            {
                var val=opt.param[key];
                param[key]=val;
            }
        }
        for(var paramKey in param)
        {
            path=path.replace("{"+paramKey+"}",param[paramKey])
        }
        if(opt && opt.query)
        {
            Object.assign(query,opt.query);
        }
        if(opt && opt.header)
        {
            for(var key in opt.header)
            {
                header[key]=opt.header[key];
            }
        }
        if((method=="POST" || method=="PUT" || method=="PATCH") && obj.bodyInfo)
        {
            if(obj.bodyInfo.type==0)
            {
                if(opt && opt.body)
                {
                    Object.assign(body,opt.body);
                }
                reqBody=body;
            }
            else
            {
                if(obj.bodyInfo.rawType==0)
                {
                    if(opt && opt.body!==undefined)
                    {
                        body=opt.body;
                    }
                    reqBody=body;
                }
                else if(obj.bodyInfo.rawType==2)
                {
                    if(opt.body instanceof Array)
                    {
                        body=opt.body;
                    }
                    else
                    {
                        if(opt && opt.body)
                        {
                            for(var key in opt.body)
                            {
                                var val=opt.body[key];
                                var arr=key.split(".");
                                if(arr.length>1)
                                {
                                    var obj1=body;
                                    for(var i=0;i<arr.length;i++)
                                    {
                                        var key1=arr[i];
                                        if(i!=arr.length-1)
                                        {
                                            if(obj1[key1]!==undefined)
                                            {
                                                obj1=obj1[key1];
                                            }
                                            else
                                            {
                                                obj1=obj1[key1]={};
                                            }
                                        }
                                        else
                                        {
                                            obj1[key1]=val;
                                        }
                                    }
                                }
                                else
                                {
                                    body[key]=val;
                                }
                            }
                        }
                    }
                    reqBody=body;
                    body=JSON.stringify(body);
                }
            }
        }
    }
    else
    {
        for(var paramKey in param)
        {
            path=path.replace("{"+paramKey+"}",param[paramKey])
        }
    }
    var reqQuery=query;
    query=$.param(query);
    if(query.length>0)
    {
        path=path+"?"+query;
    }
    for(var keyHeader in header)
    {
        var headerType=typeof (header[keyHeader]);
        if(headerType!="string")
        {
            if(headerType=="object")
            {
                header[keyHeader]=JSON.stringify(header[keyHeader]);
            }
            else
            {
                header[keyHeader]=String(header[keyHeader]);
            }
        }
    }
    var startDate=new Date();
    var func=window.apiNode.net(method,baseUrl+path,header,body);
    return func.then(function (result) {
        var res={
            req:{
                param:param,
                query:reqQuery,
                header:header,
                body:reqBody,
                info:{
                    url:method+" "+baseUrl+path
                }
            }
        };
        res.header=result.header;
        res.status=String(result.status);
        res.second=(((new Date())-startDate)/1000).toFixed(3);
        res.type=typeof (result.data);
        res.data=result.data;
        if(id!=undefined)
        {
            if(result.status>=200 && result.status<300)
            {
                window.vueObj.$store.state.event.$emit("testRunStatus","interfaceSuccess",id,res);
            }
            else
            {
                window.vueObj.$store.state.event.$emit("testRunStatus","interfaceFail",id,res);
            }
        }
        if(obj.after.mode==0)
        {
            if(global.after)
            {
                helper.runAfter(global.after,result.status,result.header,result.data)
            }
            helper.runAfter(obj.after.code,result.status,result.header,result.data)
        }
        else
        {
            helper.runAfter(obj.after.code,result.status,result.header,result.data)
        }
        root.output+="结束运行接口："+obj.name+"(耗时：<span style='color: green'>"+res.second+"秒</span>)<br>"
        return res;
    }).catch(function (err) {
        root.output+=err.message+"<br>";
        root.output+="结束运行接口："+obj.name+"(耗时：<span style='color: green'>"+(((new Date())-startDate)/1000).toFixed(3)+"秒</span>)<br>"
        return {
            status:0,
            header:{},
            data:err
        }
    })
}

helper.runTestCode=async function (code,test,global,opt,root,argv,mode,__id,level) {
    var Base64=BASE64.encoder,MD5=CryptoJS.MD5,SHA1=CryptoJS.SHA1,SHA256=CryptoJS.SHA256,SHA512=CryptoJS.SHA512,SHA3=CryptoJS.SHA3,RIPEMD160=CryptoJS.RIPEMD160,AES=CryptoJS.AES.encrypt,TripleDES=CryptoJS.TripleDES.encrypt,DES=CryptoJS.DES.encrypt,Rabbit=CryptoJS.Rabbit.encrypt,RC4=CryptoJS.RC4.encrypt,RC4Drop=CryptoJS.RC4Drop.encrypt;
    if(!global)
    {
        global={};
    }
    var env=opt.env;
    function __assert(val,id,title) {
        if(level==0)
        {
            log("断言:"+title+"("+(val?("<span style='color: green'>通过</span>"):("<span style='color: red'>不通过</span>"))+")")
            if(val)
            {
                window.vueObj.$store.state.event.$emit("testRunStatus","assertSuccess",id)
            }
            else
            {
                window.vueObj.$store.state.event.$emit("testRunStatus","assertFail",id)
            }
        }
    }
    function log(text) {
        if(typeof(text)=="object")
        {
            text=JSON.stringify(text).replace(/\s/g,"&nbsp;");
        }
        root.output+=text+"<br>";
    }
    function input(title,data) {
        return new Promise(function (resolve,reject) {
            var child=$.showBox(window.vueObj,require("../../project/test/component/testRunInput.vue"),{
                title:title,
                data:data,
                name:test.name
            });
            child.$on("save",function (obj) {
                resolve(obj);
            })
            child.$refs.box.$on("close",function (obj) {
                resolve("");
            })
        })
    }
    var ele=document.createElement("div");
    ele.innerHTML=code;
    var arr=ele.getElementsByTagName("a");
    var arrNode=[];
    for(var i=0;i<arr.length;i++)
    {
        var obj=arr[i].getAttribute("data");
        var type=arr[i].getAttribute("type");
        var objId=arr[i].getAttribute("varid");
        var text;
        if(type=="1")
        {
            var objInfo={};
            var o=JSON.parse(obj.replace(/\r|\n/g,""));
            var query={
                project:o.project._id
            }
            if(o.version)
            {
                query.version=o.version;
            }
            var bFind=false;
            for(var j=0;j<root.projectInfo.length;j++)
            {
                var objProjectInfo=root.projectInfo[j];
                if(objProjectInfo.project==query.project && objProjectInfo.version==query.version)
                {
                    objInfo=objProjectInfo;
                    bFind=true;
                    break;
                }
            }
            if(!bFind)
            {
                try
                {
                    objInfo=await net.get("/test/interfaceproject",query).then(function (data) {
                        if(data.code==200)
                        {
                            return data.data;
                        }
                        else
                        {
                            $.tip(data.msg,0);
                            throw data.msg;
                        }
                    })
                }
                catch (err)
                {
                   objInfo={
                       baseUrls:[],
                       before:"",
                       after:""
                   }
                }
                var objPush={
                    baseUrls:objInfo.baseUrls,
                    before:objInfo.before,
                    after:objInfo.after,
                    project:query.project
                }
                if(query.version)
                {
                    objPush.version=query.version;
                }
                root.projectInfo.push(objPush);
            }
            if(o.example)
            {
                try
                {
                    await net.get("/example/item",{
                        id:o.example
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            helper.updateTestInterfaceWithExample(o,data.data);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                            throw data.msg;
                        }
                    })
                    obj=JSON.stringify(o);
                }
                catch (err)
                {

                }
            }
            opt.baseUrls=objInfo.baseUrls;
            opt.before=objInfo.before;
            opt.after=objInfo.after;
            text="(function (opt1) {return helper.runTest("+obj.replace(/\r|\n/g,"")+",opt,test,root,opt1,"+(level==0?objId:undefined)+")})"
        }
        else if(type=="2")
        {
            var testObj,testMode=arr[i].hasAttribute("mode")?arr[i].getAttribute("mode"):"code";
            try
            {
                var queryTest={
                    id:obj,
                    type:testMode
                }
                if(obj.length!=24)
                {
                    queryTest.project=session.get("projectId")
                }
                testObj=await net.get("/test/test",queryTest).then(function (data) {
                    if(data.code==200)
                    {
                        return data.data
                    }
                    else
                    {
                        $.tip(data.msg,0);
                        throw "error";
                    }
                })
            }
            catch (err)
            {
                testObj={
                    code:"",
                    ui:[],
                    name:"",
                    status:0
                }
            }
            var code1;
            if(testMode=="code")
            {
                code1=testObj.code.replace(/\\\&quot\;/g,"\\\\&quot;").replace(/'/g,"\\'");
            }
            else
            {
                code1=helper.convertToCode(testObj.ui).replace(/'/g,"\\'").replace(/\\\"/g,"\\\\\"");
            }
            delete testObj.output;
            delete testObj.code;
            delete testObj.ui;
            text="(function () {var argv=Array.prototype.slice.call(arguments);return helper.runTestCode('"+code1+"',"+JSON.stringify(testObj)+",global,opt,root,argv,'"+testMode+"',"+(level==0?objId:undefined)+","+(level+1)+")})"
        }
        else
        {
            arrNode.push(undefined);
            continue;
        }
        var node=document.createTextNode(text);
        arrNode.push({
            oldNode:arr[i],
            newNode:node
        });
    }
    arrNode.forEach(function (obj) {
        if(obj)
        {
            obj.oldNode.parentNode.replaceChild(obj.newNode,obj.oldNode);
        }
    })
    root.output+="<br><div style='background-color: #ececec'>开始执行用例："+test.name+"("+(mode=="code"?"代码模式":"UI模式")+")<br>";
    var startTime=Date.now();
    var startOutputIndex=root.output.length;
    if(__id!=undefined)
    {
        window.vueObj.$store.state.event.$emit("testRunStatus","testStart",__id);
    }
    var ret=eval("(async function () {"+ele.innerText+"})()").then(function (ret) {
        var obj={
            argv:[]
        };
        var temp;
        if(typeof(ret)=="object" && (ret instanceof Array))
        {
            temp=ret[0];
            obj.argv=ret.slice(1);
        }
        else
        {
            temp=ret;
        }
        if(temp===undefined)
        {
            obj.pass=undefined;
            test.status=0;
            if(__id!=undefined)
            {
                root.unknown++;
                window.vueObj.$store.state.event.$emit("testRunStatus","testUnknown",__id);
                window.vueObj.$store.state.event.$emit("testCollectionRun",__id,root.output.substr(startOutputIndex),Date.now()-startTime);
            }
            root.output+="用例执行结束："+test.name+"(未判定)";
        }
        else if(Boolean(temp)==true)
        {
            obj.pass=true;
            test.status=1;
            if(__id!=undefined)
            {
                root.success++;
                window.vueObj.$store.state.event.$emit("testRunStatus","testSuccess",__id);
                window.vueObj.$store.state.event.$emit("testCollectionRun",__id,root.output.substr(startOutputIndex),Date.now()-startTime);
            }
            root.output+="用例执行结束："+test.name+"(<span style='color:green'>已通过</span>)";
        }
        else
        {
            obj.pass=false;
            test.status=2;
            if(__id!=undefined)
            {
                root.fail++;
                window.vueObj.$store.state.event.$emit("testRunStatus","testFail",__id);
                window.vueObj.$store.state.event.$emit("testCollectionRun",__id,root.output.substr(startOutputIndex),Date.now()-startTime);
            }
            root.output+="用例执行结束："+test.name+"(<span style='color:red'>未通过</span>)";
        }
        root.output+="</div><br>"
        return obj;
    });
    return ret;
}

helper.delay=function(duration) {
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        }, duration)
    });
};

helper.handleGlobalVar=function (str,global) {
    var type;
    if(typeof (str)=="string")
    {
        type==1;
    }
    else if(typeof(str)=="number")
    {
        type=2;
    }
    else if(typeof(str)=="boolean")
    {
        type=3;
    }
    str=str.toString().replace(/\{\{.+?\}\}/g,function (str) {
        var val=str.substr(2,str.length-4);
        if(global[val]!==undefined)
        {
            return global[val]
        }
        else
        {
            return str;
        }
    })
    if(type==2)
    {
        str=Number(str);
    }
    else if(type==3)
    {
        str=Boolean(str);
    }
    return str;
}

helper.formatJson = function (json, options) {
    var reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
            var i = 0,
                indent = 0,
                padding = '';

            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }

            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        }
    );
    return $.trim(formatted);
};

helper.convertToCode=function (data) {
    var str="";
    data.forEach(function (obj) {
        if(obj.type=="interface")
        {
            var argv="{";
            for(var key in obj.argv)
            {
                argv+=key+":{";
                for(var key1 in obj.argv[key])
                {
                    argv+=key1+":"+obj.argv[key][key1]+","
                }
                argv+="},"
            }
            argv+="}"
            str+=`<div class='testCodeLine'>var $${obj.id}=await <a href='javascript:void(0)' style='cursor: pointer; text-decoration: none;' type='1' varid='${obj.id}' data='${obj.data.replace(/\'/g,"&apos;")}'>${obj.name}</a>(${argv});</div>`
        }
        else if(obj.type=="test")
        {
            var argv="[";
            obj.argv.forEach(function (obj) {
                argv+=obj+","
            })
            argv+="]";
            str+=`<div class='testCodeLine'>var $${obj.id}=await <a type='2' href='javascript:void(0)' style='cursor: pointer; text-decoration: none;color:orange' varid='${obj.id}' data='${obj.data}' mode='${obj.mode}'>${obj.name}</a>(...${argv});</div>`
        }
        else if(obj.type=="ifbegin")
        {
            str+=`<div class='testCodeLine'>if(${obj.data}){</div>`
        }
        else if(obj.type=="elseif")
        {
            str+=`<div class='testCodeLine'>}else if(${obj.data}){</div>`
        }
        else if(obj.type=="else")
        {
            str+=`<div class='testCodeLine'>}else{</div>`
        }
        else if(obj.type=="ifend")
        {
            str+=`<div class='testCodeLine'>}</div>`
        }
        else if(obj.type=="var")
        {
            if(obj.global)
            {
                str+=`<div class='testCodeLine'>global["${obj.name}"]=${obj.data};</div>`
            }
            else
            {
                str+=`<div class='testCodeLine'>var ${obj.name}=${obj.data};</div>`
            }
        }
        else if(obj.type=="return")
        {
            if(obj.argv.length>0)
            {
                var argv=obj.argv.join(",");
                str+=`<div class='testCodeLine'>return [${obj.data},${argv}];</div>`
            }
            else
            {
                str+=`<div class='testCodeLine'>return ${obj.data};</div>`
            }
        }
        else if(obj.type=="log")
        {
            str+=`<div class='testCodeLine'>log("打印${obj.name}:");log((${obj.data}));</div>`
        }
        else if(obj.type=="input")
        {
            str+=`<div class='testCodeLine'>var $${obj.id}=await input("${obj.name}",${obj.data});</div>`
        }
        else if(obj.type=="baseurl")
        {
            str+=`<div class='testCodeLine'>opt["baseUrl"]=${obj.data};</div>`
        }
        else if(obj.type=="assert")
        {
            str+=`<div class='testCodeLine'>if(${obj.data}){</div><div class='testCodeLine'>__assert(true,${obj.id},"${obj.name}");${obj.pass?"return true;":""}</div><div class='testCodeLine'>}</div><div class='testCodeLine'>else{</div><div class='testCodeLine'>__assert(false,${obj.id},"${obj.name}");</div><div class='testCodeLine'>return false;</div><div class='testCodeLine'>}</div>`
        }
    })
    return str;
}

function filterHeader(obj) {
    var o={};
    for(var key in obj)
    {
        if(key.indexOf("-doclever")==-1)
        {
            o[key]=obj[key];
        }
    }
    return o;
}

helper.getArgvType=function (data) {
    var type;
    try
    {
        var val=eval("("+data+")");
        if(Number.isNaN(val) || val===undefined)
        {
            type="code";
        }
        else if(typeof(val)=="number")
        {
            type="number";
        }
        else if(typeof(val)=="string")
        {
            type="string";
        }
        else if(typeof(val)=="boolean")
        {
            type="boolean";
        }
        else
        {
            type="string"
        }
    }
    catch (err)
    {
        type="code"
    }
    return type;
},
helper.handleArgvData=function (key,value) {
    var o={
        type:helper.getArgvType(value)
    }
    if(key!==undefined)
    {
        o.key=key;
    }
    var data=value;
    if(o.type=="string")
    {
        data=data.substr(1,data.length-2);
    }
    o.value=data;
    return o;
},
helper.setArgvValue=function (data,type) {
    if(type=="string")
    {
        return "\""+data+"\""
    }
    else
    {
        return data;
    }
}

helper.getTestUIArgvList=function (arrUI,index) {
    var arrUI=arrUI.slice(0,index+1).filter(function (obj) {
        if(obj.type=="interface" || obj.type=="test")
        {
            return true;
        }
        else
        {
            return false;
        }
    });
    var arr=[];
    arrUI.forEach(function (obj) {
        var o={
            label:obj.name,
            value:obj.id
        }
        if(obj.type=="test")
        {
            o.data=[
                {
                    label:"pass",
                    value:"pass"
                },
                {
                    label:"argv",
                    value:"argv"
                }
            ]
        }
        else
        {
            o.data=[
                {
                    label:"header",
                    value:"header"
                },
                {
                    label:"status",
                    value:"status"
                },
                {
                    label:"second",
                    value:"second"
                },
                {
                    label:"type",
                    value:"type"
                },
            ]
            var objInter=JSON.parse(obj.data);
            var objReq={
                label:"req",
                value:"req",
                data:[]
            }
            var reqParam={
                label:"param",
                value:"param"
            }
            if(objInter.restParam && objInter.restParam.length>0)
            {
                reqParam.data=[];
                objInter.restParam.forEach(function (obj) {
                    reqParam.data.push({
                        label:obj.name,
                        value:obj.name
                    })
                })
            }
            objReq.data.push(reqParam);
            var reqQuery={
                label:"query",
                value:"query"
            }
            if(objInter.queryParam && objInter.queryParam.length>0)
            {
                reqQuery.data=[];
                objInter.queryParam.forEach(function (obj) {
                    reqQuery.data.push({
                        label:obj.name,
                        value:obj.name
                    })
                })
            }
            objReq.data.push(reqQuery);
            var reqHeader={
                label:"header",
                value:"header"
            }
            if(objInter.header && objInter.header.length>0)
            {
                reqHeader.data=[];
                objInter.header.forEach(function (obj) {
                    reqHeader.data.push({
                        label:obj.name,
                        value:obj.name
                    })
                })
            }
            objReq.data.push(reqHeader);
            var reqBody={
                label:"body",
                value:"body"
            }
            if(objInter.bodyInfo)
            {
                if(objInter.bodyInfo.type==0 && objInter.bodyParam && objInter.bodyParam.length>0)
                {
                    reqBody.data=[];
                    objInter.bodyParam.forEach(function (obj) {
                        reqBody.data.push({
                            label:obj.name,
                            value:obj.name
                        })
                    })
                }
                else if(objInter.bodyInfo.rawJSON && objInter.bodyInfo.rawJSON.length>0)
                {
                    var arrData=[];
                    (function (arrRaw,arr) {
                        for(var i=0;i<arrRaw.length;i++)
                        {
                            var o={
                                label:arrRaw[i].name?arrRaw[i].name:0,
                                value:arrRaw[i].name?arrRaw[i].name:0
                            }
                            if(arrRaw[i].data && arrRaw[i].data.length>0)
                            {
                                o.data=[];
                                arguments.callee(arrRaw[i].data,o.data);
                            }
                            arr.push(o);
                        }
                    })(objInter.bodyInfo.rawJSON,arrData)
                    reqBody.data=arrData;
                }

            }
            objReq.data.push(reqBody);
            objReq.data.push({
                label:"info",
                value:"info"
            })
            o.data.unshift(objReq)
            var objData={
                label:"data",
                value:"data"
            }
            if(objInter.outInfo.type==0)
            {
                var arrData=[];
                (function (arrRaw,arr) {
                    for(var i=0;i<arrRaw.length;i++)
                    {
                        var o={
                            label:arrRaw[i].name?arrRaw[i].name:0,
                            value:arrRaw[i].name?arrRaw[i].name:0
                        }
                        if(arrRaw[i].data && arrRaw[i].data.length>0)
                        {
                            o.data=[];
                            arguments.callee(arrRaw[i].data,o.data);
                        }
                        arr.push(o);
                    }
                })(objInter.outParam,arrData)
                objData.data=arrData;
            }
            o.data.unshift(objData);
        }
        arr.push(o);
    })
    return arr;
}

helper.updateTestInterfaceWithExample=function (objInter,objExample) {
    var obj={
        queryParam:objExample.param.query.filter(function (obj) {
            if(obj.name)
            {
                return true;
            }
            else
            {
                return false;
            }
        }),
        header:objExample.param.header.filter(function (obj) {
            if(obj.name)
            {
                return true;
            }
            else
            {
                return false;
            }
        }),
        restParam:objExample.param.param.filter(function (obj) {
            if(obj.name)
            {
                return true;
            }
            else
            {
                return false;
            }
        }),
        before:objExample.param.before,
        after:objExample.param.after
    }
    if(objExample.param.body)
    {
        obj.bodyParam=objExample.param.body.filter(function (obj) {
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
    if(objExample.param.bodyInfo)
    {
        obj.bodyInfo=objExample.param.bodyInfo;
    }
    for(var key in obj)
    {
        objInter[key]=obj[key];
    }
}

helper.getTestBaseUrlList=function (arr) {
    var ret=[];
    arr.forEach(function (obj) {
        var o={
            label:obj.name,
            value:obj._id,
            data:obj.data.map(function (obj) {
                return {
                    label:obj.name,
                    value:obj._id,
                }
            })
        }
        ret.push(o);
    })
    return ret;
}

helper.addPoint=async function(type,title)
{
    if(sessionStorage.getItem("member"))
    {
        let data=await net.get(config.online+"/member/token",{
            member:sessionStorage.getItem("member")
        },{
            desktop:"1"
        },null,1);
        if(data.code==200)
        {
            let token=data.data;
            token=window.apiNode.encode.token(token);
            let data1=await net.put(config.online+"/member/point",{
                member:sessionStorage.getItem("member"),
                type:type,
                token:token
            },{
                desktop:"1"
            },null,1);
            if(data1.code==200)
            {
                window.store.state.event.$emit("addPoint",Object.assign(data1.data,{
                    title:title,
                }));
            }
        }
    }
    return null;
}

helper.getMemberStatus=async function()
{
    if(sessionStorage.getItem("member") && navigator.onLine)
    {
        let mac=await global.apiNode.macAddress();
        let data;
        try
        {
            data=await net.get(config.online+"/member/status",{
                member:sessionStorage.getItem("member"),
                mac:mac
            },{
                desktop:"1"
            },null,1);
            return data.data;
        }
        catch (err)
        {
            return false;
        }
    }
}

module.exports=helper;












